"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => Promise<void>;
}

export function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="h-8 w-8 opacity-40" />
        </div>
        <p className="font-medium">Nenhuma transação encontrada</p>
        <p className="text-sm mt-1">
          Adicione sua primeira transação clicando nos botões acima
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center gap-3 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 hover:shadow-sm transition-shadow"
        >
          <div
            className={`p-2 rounded-full shrink-0 ${
              transaction.type === "income"
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            {transaction.type === "income" ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-sm truncate">
                {transaction.description || transaction.category}
              </p>
              <Badge
                variant={transaction.type === "income" ? "income" : "expense"}
                className="shrink-0"
              >
                {transaction.category}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDate(transaction.date)}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <p
              className={`font-bold text-sm sm:text-base ${
                transaction.type === "income"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.value)}
            </p>

            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(transaction)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    disabled={deletingId === transaction.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. A transação será
                      removida permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => handleDelete(transaction.id)}
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
