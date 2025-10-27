"use client";

import { ArrowUpRight, ArrowDownRight, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { updateDefaultAccount } from "@/actions/account";
import { deleteAccount } from "@/actions/dashboard";


type Account = {
  id: string;
  name: string;
  balance: number | string;
  type: string;
  isDefault?: boolean;
};

export function AccountCard({ account }: { account: Account }) {
  const { name, type, balance, id, isDefault } = account;
  const [ deleteLoading, setDeleteLoading ] = useState(false);
  const [ isPopoverOpen, setIsPopoverOpen ] = useState(false);

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  

  // called with new checked state from Switch
  const handleDefaultChange = async (checked: boolean) => {
    // prevent turning off the only default account from here
    if (!checked && isDefault) {
      toast.warning("You need at least one default account");
      return;
    }

    if (checked) {
      await updateDefaultFn(id);
    }
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(
        (error as Error)?.message || "Failed to update default account"
      );
    }
  }, [error]);

  const handleDelete = async (id: string) => {
    // Implement delete functionality here
    // toast.error("Delete functionality not implemented yet.");
    setDeleteLoading(true);
    const result = await deleteAccount(id);
    if (result.success) {
      toast.success("Account deleted successfully.");
      setIsPopoverOpen(false); // Close popover on successful deletion
    } else {
      toast.error("Failed to delete account.");
    }
    setDeleteLoading(false);
  }

  

  const formattedBalance = (() => {
    const num =
      typeof balance === "number"
        ? balance
        : parseFloat(String(balance ?? "0"));
    return isNaN(num) ? "0.00" : num.toFixed(2);
  })();

  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium capitalize">
            <Link href={`/account/${id}`} className="hover:underline">
              {name}
            </Link>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {type.charAt(0) + type.slice(1).toLowerCase()} Account
          </p>
        </div>

        <Switch
          className="cursor-pointer"
          checked={Boolean(isDefault)}
          onCheckedChange={handleDefaultChange}
          disabled={updateDefaultLoading}
          aria-label={isDefault ? "Default account" : "Set as default account"}
        />
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">${formattedBalance}</div>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger className="flex items-center text-sm text-red-500  hover:underline hover:text-red-600 cursor-pointer">
              <X className="mr-1 h-4 w-4 text-red-500" />
              Delete Account
            </PopoverTrigger>
            <PopoverContent><div>
              Are you sure you want to delete this account? This action cannot be undone.
              <div className="mt-2 flex justify-between gap-2">
                <button 
                  onClick={() => setIsPopoverOpen(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                onClick={() => handleDelete(id)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                disabled={deleteLoading}
                >
                 {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div></PopoverContent>
          </Popover>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center">
          <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
          Income
        </div>
        <div className="flex items-center">
          <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
          Expense
        </div>
      </CardFooter>
    </Card>
  );
}
