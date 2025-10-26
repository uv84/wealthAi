"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#D4A5A5",
  "#9FA8DA",
];

type Account = {
  id: string;
  name: string;
  isDefault?: boolean;
};

type Transaction = {
  id: string;
  accountId: string;
  date: string | number | Date;
  description?: string;
  amount: number | string;
  type: "EXPENSE" | "INCOME" | string;
  category?: string;
};

export function DashboardOverview({
  accounts = [],
  transactions = [],
}: {
  accounts?: Account[];
  transactions?: Transaction[];
}) {
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );

  // Ensure arrays are defined
  const accountTransactions = (transactions || []).filter(
    (t) => t.accountId === selectedAccountId
  );

  // Get recent transactions (last 5) — copy before sort to avoid mutating props
  const recentTransactions = [...accountTransactions]
    .sort((a, b) => new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime())
    .slice(0, 5);

  // Calculate expense breakdown for current month
  const currentDate = new Date();
  const currentMonthExpenses = accountTransactions.filter((t) => {
    const transactionDate = new Date(String(t.date));
    return (
      t.type === "EXPENSE" &&
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce<Record<string, number>>((acc, transaction) => {
    const category = transaction.category || "Uncategorized";
    const amt = Number(transaction.amount) || 0;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amt;
    return acc;
  }, {});

  // Format data for pie chart
  const pieChartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Recent Transactions Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-normal">Recent Transactions</CardTitle>
          <Select value={selectedAccountId} onValueChange={(v) => setSelectedAccountId(v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No recent transactions</p>
            ) : (
              recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.description || "Untitled Transaction"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(String(transaction.date)), "PP")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex items-center",
                        transaction.type === "EXPENSE" ? "text-red-500" : "text-green-500"
                      )}
                    >
                      {transaction.type === "EXPENSE" ? (
                        <ArrowDownRight className="mr-1 h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="mr-1 h-4 w-4" />
                      )}
                      ${Number(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expense Breakdown Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal">Monthly Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0 ">
          {pieChartData.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No expenses this month</p>
          ) : (
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) =>
                      `${String((entry as any).name)}: $${Number((entry as any).value).toFixed(2)}`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) =>
                      typeof value === "number" ? `$${value.toFixed(2)}` : String(value)
                    }
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}