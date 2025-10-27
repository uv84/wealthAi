"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import type { z } from "zod";

import { ReceiptScanner } from "./recipt-scanner";
import { motion } from "framer-motion";

// Use input type for form values (amount is string in the form)
type TransactionForm = z.input<typeof transactionSchema>;

type Account = {
  id: string;
  name: string;
  balance: number | string;
  isDefault?: boolean;
};

type Category = {
  id: string;
  name: string;
  type: string;
};

export function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null,
}: {
  accounts: Account[];
  categories: Category[];
  editMode?: boolean;
  initialData?: Partial<{
    type: "INCOME" | "EXPENSE";
    amount: number | string;
    description: string | null;
    accountId: string;
    category: string | null;
    date: string | Date;
    isRecurring: boolean;
    recurringInterval: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | null;
  }> | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues:
      editMode && initialData
        ? {
            type: initialData.type,
            amount: String(initialData.amount ?? 0),
            description: initialData.description ?? "",
            accountId: initialData.accountId,
            category: initialData.category ?? "",
            date: initialData.date ? new Date(initialData.date) : new Date(),
            isRecurring: initialData.isRecurring ?? false,
            recurringInterval: initialData.recurringInterval ?? undefined,
          }
        : {
            type: "EXPENSE" as const,
            amount: "0",
            description: "",
            accountId: accounts.find((ac) => ac.isDefault)?.id ?? accounts[0]?.id ?? "",
            category: "",
            date: new Date(),
            isRecurring: false,
            recurringInterval: undefined,
          },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = form;

  // Prepare two typed actions and call the appropriate one
  const create = useFetch(createTransaction);
  const update = useFetch(updateTransaction);
  const transactionLoading = create.loading || update.loading;
  const transactionError = create.error || update.error;

  const onSubmit = async (data: TransactionForm) => {
    // Convert amount string to number for the API
    const payload = { 
      ...data, 
      amount: parseFloat(data.amount) 
    };
    if (editMode) {
      await update.fn(editId!, payload);
    } else {
      await create.fn(payload);
    }
  };

  const handleScanComplete = (scannedData: {
    amount?: number;
    date?: string | Date;
    description?: string;
    category?: string;
  } | null) => {
    if (!scannedData) return;
    if (scannedData.amount !== undefined) setValue("amount", String(scannedData.amount));
    if (scannedData.date) setValue("date", new Date(scannedData.date));
    if (scannedData.description) setValue("description", scannedData.description);
    if (scannedData.category) setValue("category", scannedData.category);
    toast.success("Receipt scanned successfully");
  };

  useEffect(() => {
    if ((create.data || update.data)?.success && !(create.loading || update.loading)) {
      toast.success(editMode ? "Transaction updated successfully" : "Transaction created successfully");
      reset();
      const accId = (
        editMode
          ? (update.data?.data as { accountId?: string } | undefined)?.accountId
          : (create.data?.data as { accountId?: string } | undefined)?.accountId
      );
      if (accId) {
        router.push(`/account/${accId}`);
      } else {
        router.back();
      }
    }
  }, [create.data, update.data, create.loading, update.loading, editMode, reset, router]);

  useEffect(() => {
    if (transactionError) {
      toast.error(String(transactionError?.message ?? "Failed to save transaction"));
    }
  }, [transactionError]);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date") as Date | undefined;

  const filteredCategories = categories.filter((category) => category.type === type);

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      viewport={{ once: true }}
      >
      {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

      {/* Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Type</label>
        <Select onValueChange={(value) => setValue("type", value as TransactionForm["type"])} value={watch("type")}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
          </SelectContent>
        </Select>
  {errors.type && <p className="text-sm text-red-500">{String(errors.type?.message)}</p>}
      </div>

      {/* Amount and Account */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
          />
          {errors.amount && <p className="text-sm text-red-500">{String(errors.amount?.message)}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Account</label>
          <Select onValueChange={(value) => setValue("accountId", value)} value={getValues("accountId")}>
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} (${Number(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button
                  variant="ghost"
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                >
                  Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && <p className="text-sm text-red-500">{String(errors.accountId?.message)}</p>}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select onValueChange={(value) => setValue("category", value)} value={getValues("category")}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
  {errors.category && <p className="text-sm text-red-500">{String(errors.category?.message)}</p>}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-full pl-3 text-left font-normal", !date && "text-muted-foreground")}
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => d && setValue("date", d)}
              disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
  {errors.date && <p className="text-sm text-red-500">{String(errors.date?.message)}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input placeholder="Enter description" {...register("description")} />
  {errors.description && <p className="text-sm text-red-500">{String(errors.description?.message)}</p>}
      </div>

      {/* Recurring Toggle */}
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <label className="text-base font-medium">Recurring Transaction</label>
          <div className="text-sm text-muted-foreground">Set up a recurring schedule for this transaction</div>
        </div>
        <Switch checked={Boolean(isRecurring)} onCheckedChange={(checked) => setValue("isRecurring", checked)} />
      </div>

      {/* Recurring Interval */}
      {isRecurring && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Recurring Interval</label>
          <Select 
            onValueChange={(value) => setValue("recurringInterval", value as "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY")} 
            value={getValues("recurringInterval")}
          >  <SelectTrigger>
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && <p className="text-sm text-red-500">{String(errors.recurringInterval?.message)}</p>}
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" className="w-full" disabled={transactionLoading}>
          {transactionLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>
    </motion.form>
  );
}