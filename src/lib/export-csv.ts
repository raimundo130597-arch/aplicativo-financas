import { Transaction } from "@/types";
import { formatDate } from "@/lib/utils";

export function exportTransactionsToCSV(
  transactions: Transaction[],
  filename = "financas"
) {
  const headers = ["Data", "Tipo", "Categoria", "Descrição", "Valor (R$)"];

  const rows = transactions.map((t) => [
    formatDate(t.date),
    t.type === "income" ? "Receita" : "Despesa",
    t.category,
    t.description || "",
    t.value.toFixed(2).replace(".", ","),
  ]);

  // BOM garante que o Excel abre com acentos corretos
  const bom = "﻿";
  const separator = ";";
  const content =
    bom +
    [headers, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(separator)
      )
      .join("\r\n");

  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
