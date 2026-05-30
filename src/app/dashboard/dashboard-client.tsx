"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { TransactionList } from "@/components/dashboard/transaction-list";
import { TransactionForm } from "@/components/dashboard/transaction-form";
import { FilterBar } from "@/components/dashboard/filter-bar";
import { useToast } from "@/components/ui/use-toast";
import { Transaction, TransactionFormData, Filters } from "@/types";
import { getCurrentMonthRange } from "@/lib/utils";
import { exportTransactionsToCSV } from "@/lib/export-csv";
import { TrendingUp, Plus, LogOut, Loader2, Sun, Moon, Download } from "lucide-react";

interface DashboardClientProps {
  userEmail: string;
  userId: string;
}

export function DashboardClient({ userEmail, userId }: DashboardClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [defaultFormType, setDefaultFormType] = useState<"income" | "expense">(
    "expense"
  );

  const { start, end } = getCurrentMonthRange();
  const [filters, setFilters] = useState<Filters>({
    period: { start, end },
    category: "all",
    type: "all",
  });

  const supabase = createClient();

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("transactions")
      .select("*")
      .gte("date", filters.period.start)
      .lte("date", filters.period.end)
      .order("date", { ascending: false });

    if (filters.type !== "all") {
      query = query.eq("type", filters.type);
    }
    if (filters.category !== "all") {
      query = query.eq("category", filters.category);
    }

    const { data, error } = await query;
    if (!error && data) {
      setTransactions(data as Transaction[]);
    }
    setLoading(false);
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth/login");
  }

  async function handleAddTransaction(data: TransactionFormData) {
    // user_id é obrigatório para satisfazer a RLS policy
    const { error } = await supabase
      .from("transactions")
      .insert([{ ...data, user_id: userId }]);
    if (error) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    toast({ title: "Transação adicionada com sucesso!" });
    await fetchTransactions();
  }

  async function handleEditTransaction(data: TransactionFormData) {
    if (!editingTransaction) return;
    const { error } = await supabase
      .from("transactions")
      .update(data)
      .eq("id", editingTransaction.id);
    if (error) {
      toast({
        title: "Erro ao atualizar",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    toast({ title: "Transação atualizada com sucesso!" });
    setEditingTransaction(null);
    await fetchTransactions();
  }

  async function handleDeleteTransaction(id: string) {
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);
    if (error) {
      toast({
        title: "Erro ao excluir",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Transação excluída!" });
    await fetchTransactions();
  }

  function openNewTransaction(type: "income" | "expense") {
    setEditingTransaction(null);
    setDefaultFormType(type);
    setFormOpen(true);
  }

  function openEditTransaction(transaction: Transaction) {
    setEditingTransaction(transaction);
    setFormOpen(true);
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.value, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.value, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold hidden sm:block">
              FinançasPro
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block truncate max-w-[160px]">
              {userEmail}
            </span>

            {/* Botão dark/light mode */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
              title={theme === "dark" ? "Modo claro" : "Modo escuro"}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Alternar tema</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:block">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Controle suas finanças pessoais
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => openNewTransaction("income")}
              className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Receita
            </Button>
            <Button
              onClick={() => openNewTransaction("expense")}
              className="bg-red-600 hover:bg-red-700 flex-1 sm:flex-none"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Despesa
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportTransactionsToCSV(transactions)}
              disabled={transactions.length === 0}
              title="Exportar transações para Excel/CSV"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <SummaryCards totalIncome={totalIncome} totalExpenses={totalExpenses} />

        {/* Filters */}
        <FilterBar filters={filters} onFiltersChange={setFilters} />

        {/* Chart + List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <CategoryChart transactions={transactions} />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-lg border dark:border-gray-800 shadow-sm">
              <div className="p-4 border-b dark:border-gray-800">
                <h2 className="font-semibold text-base">Transações</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {transactions.length} transação(ões) no período
                </p>
              </div>
              <div className="p-4">
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <TransactionList
                    transactions={transactions}
                    onEdit={openEditTransaction}
                    onDelete={handleDeleteTransaction}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <TransactionForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={
          editingTransaction ? handleEditTransaction : handleAddTransaction
        }
        initialData={editingTransaction}
        defaultType={defaultFormType}
      />
    </div>
  );
}
