"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
type DecimalLike = { toNumber(): number };

type WithOptionalDecimal = {
  balance?: number | DecimalLike;
  amount?: number | DecimalLike;
  [key: string]: unknown;
};

const serializeTransaction = <T extends WithOptionalDecimal>(obj: T) => {
  const base = obj as unknown as Omit<T, "balance" | "amount">;
  const out = {
    ...(base as unknown as Record<string, unknown>),
  } as Omit<T, "balance" | "amount"> & { balance?: number; amount?: number };
  // Always assign numeric values for balance/amount if fields exist on the object
  out.balance = typeof obj.balance === "number" ? obj.balance : obj.balance ? obj.balance.toNumber() : 0;
  out.amount = typeof obj.amount === "number" ? obj.amount : obj.amount ? obj.amount.toNumber() : 0;
  return out;
};

export type CreateAccountInput = {
  name: string;
  type: "CURRENT" | "SAVINGS";
  balance: string; // comes as string from form
  isDefault?: boolean;
};

export type DashboardAccount = {
  id: string;
  name: string;
  type: "CURRENT" | "SAVINGS";
  balance: number;
  isDefault: boolean;
  _count?: { transactions: number };
};

export async function getUserAccounts(): Promise<DashboardAccount[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    // Serialize accounts before sending to client
  const serializedAccounts = accounts.map((a: typeof accounts[number]) => serializeTransaction(a));

  return serializedAccounts as unknown as DashboardAccount[];
  } catch (error) {
    console.error(error instanceof Error ? error.message : "Unknown error");
    return [];
  }
}

export async function createAccount(data: CreateAccountInput) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get request data for ArcJet
    const req = await request();

    // Check rate limit
    const decision = await aj.protect(req, {
      userId,
      requested: 1, // Specify how many tokens to consume
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Request blocked");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Convert balance to float before saving
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }

    // Check if this is the user's first account
    const existingAccounts = await db.account.findMany({
      where: { userId: user.id },
    });

    // If it's the first account, make it default regardless of user input
    // If not, use the user's preference
    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    // If this account should be default, unset other default accounts
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Create new account
    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault, // Override the isDefault based on our logic
      },
    });

    // Serialize the account before returning
    const serializedAccount = serializeTransaction(account);

    revalidatePath("/dashboard");
    return { success: true, data: serializedAccount };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
}

export async function deleteAccount(accountId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    await db.account.delete({
      where: {
        id: accountId,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
}

export type DashboardTransaction = {
  id: string;
  accountId: string;
  date: Date;
  description: string | null;
  amount: number;
  type: "EXPENSE" | "INCOME";
  category: string | null;
};

export async function getDashboardData(): Promise<DashboardTransaction[]> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get all user transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map((t: typeof transactions[number]) => serializeTransaction(t)) as unknown as DashboardTransaction[];
}
