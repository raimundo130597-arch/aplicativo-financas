"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import {
  Transaction,
  TransactionFormData,
  TransactionType,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/types";

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  initialData?: Transaction | null;
  defaultType?: TransactionType;
}

export function TransactionForm({
  open,
  onClose,
  onSubmit,
  initialData,
  defaultType = "expense",
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(defaultType);
  const [value, setValue] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setValue(initialData.value.toString());
      setDate(initialData.date);
      setCategory(initialData.category);
      setDescription(initialData.description);
    } else {
      setType(defaultType);
      setValue("");
      setDate(new Date().toISOString().split("T")[0]);
      setCategory("");
      setDescription("");
    }
  }, [initialData, defaultType, open]);

  const categories =
    type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value || !date || !category) return;

    setLoading(true);
    try {
      await onSubmit({
        type,
        value: parseFloat(value.replace(",", ".")),
        date,
        category,
        description,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar transação" : "Nova transação"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setType("income");
                  setCategory("");
                }}
                className={`py-2 px-4 rounded-md border text-sm font-medium transition-colors ${
                  type === "income"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-background border-input hover:bg-accent"
                }`}
              >
                Receita
              </button>
              <button
                type="button"
                onClick={() => {
                  setType("expense");
                  setCategory("");
                }}
                className={`py-2 px-4 rounded-md border text-sm font-medium transition-colors ${
                  type === "expense"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-background border-input hover:bg-accent"
                }`}
              >
                Despesa
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="value">Valor (R$)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Almoço no restaurante..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !category}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
