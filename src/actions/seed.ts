"use server";

import { db } from "@/lib/prisma";
import { subDays } from "date-fns";
import { randomUUID } from "crypto";
import type { Prisma } from "@prisma/client";

// Prisma enums are not exported from @prisma/client in this setup (custom output),
// so model the status as a string literal union to match the schema.
type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED";

const ACCOUNT_ID = "97c29248-5d10-446f-b69a-d46c93304bc8";
const USER_ID = "0aee6a7c-49a1-4c2b-a5b4-509a4545ee92";

type CategoryDef = { name: string; range: [number, number] };
type CategoriesMap = Record<"INCOME" | "EXPENSE", CategoryDef[]>;

const CATEGORIES: CategoriesMap = {
  INCOME: [
    { name: "salary", range: [5000, 8000] },
    { name: "freelance", range: [1000, 3000] },
    { name: "investments", range: [500, 2000] },
    { name: "other-income", range: [100, 1000] },
  ],
  EXPENSE: [
    { name: "housing", range: [1000, 2000] },
    { name: "transportation", range: [100, 500] },
    { name: "groceries", range: [200, 600] },
    { name: "utilities", range: [100, 300] },
    { name: "entertainment", range: [50, 200] },
    { name: "food", range: [50, 150] },
    { name: "shopping", range: [100, 500] },
    { name: "healthcare", range: [100, 1000] },
    { name: "education", range: [200, 1000] },
    { name: "travel", range: [500, 2000] },
  ],
};

function getRandomAmount(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomCategory(type: "INCOME" | "EXPENSE") {
  const categories = CATEGORIES[type];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const amount = getRandomAmount(category.range[0], category.range[1]);
  return { category: category.name, amount };
}

type SeedTransaction = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string;
  date: Date;
  category: string;
  status: TransactionStatus;
  userId: string;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function seedTransactions(): Promise<
  | { success: true; message: string }
  | { success: false; error: string }
> {
  try {
    const transactions: SeedTransaction[] = [];

    let totalBalance = 0;

    for (let i = 90; i >= 0; i--) {
      const date = subDays(new Date(), i);

      const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < transactionsPerDay; j++) {
        const type: "INCOME" | "EXPENSE" = Math.random() < 0.4 ? "INCOME" : "EXPENSE";
        const { category, amount } = getRandomCategory(type);

        const transaction: SeedTransaction = {
          id: randomUUID(),
          type,
          amount,
          description: `${type === "INCOME" ? "Received" : "Paid for"} ${category}`,
          date,
          category,
          status: "COMPLETED",
          userId: USER_ID,
          accountId: ACCOUNT_ID,
          createdAt: date,
          updatedAt: date,
        };

        totalBalance += type === "INCOME" ? amount : -amount;
        transactions.push(transaction);
      }
    }

    await db.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.transaction.deleteMany({
        where: { accountId: ACCOUNT_ID },
      });

      // Prisma createMany may fail if array is empty; guard just in case
      if (transactions.length > 0) {
        await tx.transaction.createMany({
          data: transactions,
        });
      }

      await tx.account.update({
        where: { id: ACCOUNT_ID },
        data: { balance: totalBalance },
      });
    });

    return {
      success: true,
      message: `Created ${transactions.length} transactions`,
    };
  } catch (error: unknown) {
    return { success: false, error: String((error as Error)?.message ?? error) };
  }
}