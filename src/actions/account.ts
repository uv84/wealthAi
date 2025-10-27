"use server";

import { db } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

type DecimalLike = { toNumber(): number };

type WithOptionalDecimal = {
  balance?: number | DecimalLike;
  amount?: number | DecimalLike;
  [key: string]: unknown;
};

function isDecimalLike(v: unknown): v is DecimalLike {
  return typeof v === "object" && v !== null && "toNumber" in (v as Record<string, unknown>);
}

const serializeDecimal = <T extends WithOptionalDecimal>(obj: T) => {
  const base = obj as unknown as Omit<T, "balance" | "amount">;
  const serialized = {
    ...(base as unknown as Record<string, unknown>),
  } as Omit<T, "balance" | "amount"> & { balance?: number; amount?: number };
  if (obj.balance !== undefined) {
    serialized.balance = isDecimalLike(obj.balance) ? obj.balance.toNumber() : (obj.balance as number);
  }
  if (obj.amount !== undefined) {
    serialized.amount = isDecimalLike(obj.amount) ? obj.amount.toNumber() : (obj.amount as number);
  }
  return serialized;
};

export async function getAccountWithTransactions(accountId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  const account = await db.account.findUnique({
    where: {
      id: accountId,
      userId: user.id,
    },
    include: {
      transactions: {
        orderBy: { date: "desc" },
      },
      _count: {
        select: { transactions: true },
      },
    },
  });

  if (!account) return null;

  return {
    ...serializeDecimal(account),
    transactions: account.transactions.map(serializeDecimal),
  };
}

export async function bulkDeleteTransactions(transactionIds: string[]) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");

    // Get transactions to calculate balance changes
    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id,
      },
    });

    // Group transactions by account to update balances
    const accountBalanceChanges: Record<string, number> = transactions.reduce(
      (
        acc: Record<string, number>,
        transaction: { accountId: string; amount: DecimalLike; type: "EXPENSE" | "INCOME" }
      ) => {
        const change =
          transaction.type === "EXPENSE"
            ? transaction.amount.toNumber()
            : -transaction.amount.toNumber();
        acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
        return acc;
      },
      {} as Record<string, number>
    );

    // Delete transactions and update account balances in a transaction
    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      // Delete transactions
      await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId: user.id,
        },
      });

      // Update account balances
      for (const [accountId, balanceChange] of Object.entries(
        accountBalanceChanges
      )) {
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");

    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function updateDefaultAccount(accountId: string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // First, unset any existing default account
    await db.account.updateMany({
      where: {
        userId: user.id,
        isDefault: true,
      },
      data: { isDefault: false },
    });

    // Then set the new default account
    const account = await db.account.update({
      where: {
        id: accountId,
        userId: user.id,
      },
      data: { isDefault: true },
    });

    revalidatePath("/dashboard");
    return { success: true, data: serializeDecimal(account) };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
