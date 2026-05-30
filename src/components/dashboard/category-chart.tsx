"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/types";

const EXPENSE_COLORS = [
  "#EF4444", "#F97316", "#F59E0B", "#84CC16",
  "#14B8A6", "#8B5CF6", "#EC4899", "#6B7280",
];

const INCOME_COLORS = [
  "#22C55E", "#10B981", "#06B6D4", "#3B82F6",
  "#8B5CF6", "#F59E0B", "#EC4899", "#6B7280",
];

interface CategoryChartProps {
  transactions: Transaction[];
}

function buildChartData(transactions: Transaction[], type: "expense" | "income") {
  return transactions
    .filter((t) => t.type === type)
    .reduce((acc, t) => {
      const existing = acc.find((item) => item.name === t.category);
      if (existing) {
        existing.value += t.value;
      } else {
        acc.push({ name: t.category, value: t.value });
      }
      return acc;
    }, [] as { name: string; value: number }[])
    .sort((a, b) => b.value - a.value);
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
}) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-border rounded-lg p-3 shadow-md">
        <p className="font-medium text-sm">{payload[0].name}</p>
        <p className="text-blue-600 dark:text-blue-400 font-bold">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
}

function PieSection({
  data,
  colors,
  emptyMessage,
}: {
  data: { name: string; value: number }[];
  colors: string[];
  emptyMessage: string;
}) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-56 text-muted-foreground text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-xs text-gray-600 dark:text-gray-400">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryChart({ transactions }: CategoryChartProps) {
  const expenseData = buildChartData(transactions, "expense");
  const incomeData = buildChartData(transactions, "income");

  return (
    <Card className="border-0 shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          Distribuição por Categoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="expense">
          <TabsList className="w-full mb-2">
            <TabsTrigger value="expense" className="flex-1 text-xs sm:text-sm">
              Despesas
            </TabsTrigger>
            <TabsTrigger value="income" className="flex-1 text-xs sm:text-sm">
              Receitas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="expense">
            <PieSection
              data={expenseData}
              colors={EXPENSE_COLORS}
              emptyMessage="Nenhuma despesa no período"
            />
          </TabsContent>

          <TabsContent value="income">
            <PieSection
              data={incomeData}
              colors={INCOME_COLORS}
              emptyMessage="Nenhuma receita no período"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
