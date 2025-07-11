import { useEffect, useState, useCallback } from "react";
import { getFromFirebase } from "../api/firebaseAPI";
import type { IncomeExpenseType } from "../types";

export const useTransactions = (categoriesList: any[]) => {
  const [transactionList, setTransactionList] = useState<IncomeExpenseType[]>(
    []
  );
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    // if (!categoriesList || categoriesList.length === 0) {
    //   setLoading(false);
    //   return;
    // }

    setLoading(true);
    try {
      const data = await getFromFirebase("");
      const expenses = data.expenses || {};
      const incomes = data.incomes || {};

      const resolveCategory = (id: string) =>
        categoriesList.find((cat) => cat.id === id) || "";

      const expenseList = Object.entries(expenses).map(([key, value]: any) => ({
        id: key,
        type: "expenses",
        description: value.description,
        amount: Number(value.amount),
        date: value.date,
        selectedCategory: resolveCategory(value.selectedCategory?.id),
      }));

      const incomeList = Object.entries(incomes).map(([key, value]: any) => ({
        id: key,
        type: "incomes",
        description: value.description,
        amount: Number(value.amount),
        date: value.date,
        selectedCategory: resolveCategory(value.selectedCategory?.id),
      }));

      const allTransactions = [...expenseList, ...incomeList].reverse();

      setTransactionList(allTransactions);
      setIncomeTotal(incomeList.reduce((sum, item) => sum + item.amount, 0));
      setExpenseTotal(expenseList.reduce((sum, item) => sum + item.amount, 0));
    } catch (error) {
      console.error("Error fetching transactions", error);
    } finally {
      setLoading(false);
    }
  }, [categoriesList]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactionList,
    incomeTotal,
    expenseTotal,
    loading,
    refetchTransactions: fetchTransactions,
  };
};
