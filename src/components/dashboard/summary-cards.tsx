"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
}

export function SummaryCards({ totalIncome, totalExpenses }: SummaryCardsProps) {
  const balance = totalIncome - totalExpenses;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
            Total de Receitas
          </CardTitle>
          <div className="bg-green-200 dark:bg-green-800 p-2 rounded-lg">
            <TrendingUp className="h-4 w-4 text-green-700 dark:text-green-300" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-800 dark:text-green-300">
            {formatCurrency(totalIncome)}
          </p>
          <p className="text-xs text-green-600 dark:text-green-500 mt-1">Entradas no período</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400">
            Total de Despesas
          </CardTitle>
          <div className="bg-red-200 dark:bg-red-800 p-2 rounded-lg">
            <TrendingDown className="h-4 w-4 text-red-700 dark:text-red-300" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-800 dark:text-red-300">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-xs text-red-600 dark:text-red-500 mt-1">Saídas no período</p>
        </CardContent>
      </Card>

      <Card
        className={`border-0 shadow-sm ${
          balance >= 0
            ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900"
            : "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900"
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle
            className={`text-sm font-medium ${
              balance >= 0
                ? "text-blue-700 dark:text-blue-400"
                : "text-orange-700 dark:text-orange-400"
            }`}
          >
            Saldo
          </CardTitle>
          <div
            className={`p-2 rounded-lg ${
              balance >= 0
                ? "bg-blue-200 dark:bg-blue-800"
                : "bg-orange-200 dark:bg-orange-800"
            }`}
          >
            <Wallet
              className={`h-4 w-4 ${
                balance >= 0
                  ? "text-blue-700 dark:text-blue-300"
                  : "text-orange-700 dark:text-orange-300"
              }`}
            />
          </div>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${
              balance >= 0
                ? "text-blue-800 dark:text-blue-300"
                : "text-orange-800 dark:text-orange-300"
            }`}
          >
            {formatCurrency(balance)}
          </p>
          <p
            className={`text-xs mt-1 ${
              balance >= 0
                ? "text-blue-600 dark:text-blue-500"
                : "text-orange-600 dark:text-orange-500"
            }`}
          >
            {balance >= 0 ? "Saldo positivo" : "Saldo negativo"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
