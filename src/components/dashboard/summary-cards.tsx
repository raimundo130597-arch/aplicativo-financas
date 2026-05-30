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
      <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-green-700">
            Total de Receitas
          </CardTitle>
          <div className="bg-green-200 p-2 rounded-lg">
            <TrendingUp className="h-4 w-4 text-green-700" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-800">
            {formatCurrency(totalIncome)}
          </p>
          <p className="text-xs text-green-600 mt-1">Entradas no período</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-red-700">
            Total de Despesas
          </CardTitle>
          <div className="bg-red-200 p-2 rounded-lg">
            <TrendingDown className="h-4 w-4 text-red-700" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-800">
            {formatCurrency(totalExpenses)}
          </p>
          <p className="text-xs text-red-600 mt-1">Saídas no período</p>
        </CardContent>
      </Card>

      <Card
        className={`border-0 shadow-sm ${
          balance >= 0
            ? "bg-gradient-to-br from-blue-50 to-blue-100"
            : "bg-gradient-to-br from-orange-50 to-orange-100"
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle
            className={`text-sm font-medium ${
              balance >= 0 ? "text-blue-700" : "text-orange-700"
            }`}
          >
            Saldo
          </CardTitle>
          <div
            className={`p-2 rounded-lg ${
              balance >= 0 ? "bg-blue-200" : "bg-orange-200"
            }`}
          >
            <Wallet
              className={`h-4 w-4 ${
                balance >= 0 ? "text-blue-700" : "text-orange-700"
              }`}
            />
          </div>
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${
              balance >= 0 ? "text-blue-800" : "text-orange-800"
            }`}
          >
            {formatCurrency(balance)}
          </p>
          <p
            className={`text-xs mt-1 ${
              balance >= 0 ? "text-blue-600" : "text-orange-600"
            }`}
          >
            {balance >= 0 ? "Saldo positivo" : "Saldo negativo"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
