"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, Filters } from "@/types";
import { getCurrentMonthRange } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

interface FilterBarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const ALL_CATEGORIES = Array.from(
  new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])
);

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  function resetFilters() {
    const { start, end } = getCurrentMonthRange();
    onFiltersChange({
      period: { start, end },
      category: "all",
      type: "all",
    });
  }

  return (
    <div className="bg-white rounded-lg border p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">De</Label>
            <Input
              type="date"
              value={filters.period.start}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  period: { ...filters.period, start: e.target.value },
                })
              }
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Até</Label>
            <Input
              type="date"
              value={filters.period.end}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  period: { ...filters.period, end: e.target.value },
                })
              }
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Tipo</Label>
            <Select
              value={filters.type}
              onValueChange={(v) =>
                onFiltersChange({
                  ...filters,
                  type: v as Filters["type"],
                })
              }
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Categoria</Label>
            <Select
              value={filters.category}
              onValueChange={(v) =>
                onFiltersChange({ ...filters, category: v })
              }
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {ALL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetFilters}
          className="h-9 shrink-0"
        >
          <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
          Resetar
        </Button>
      </div>
    </div>
  );
}
