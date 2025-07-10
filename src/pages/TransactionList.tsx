import { useEffect, useState } from "react";
import Table from "../components/shared/table/Table";
import ModalForm from "../components/shared/ModalForm";
import {
  deleteFromFirebase,
  getFromFirebase,
  postToFirebase,
  putToFirebase,
} from "../api/firebaseAPI";
import NoData from "../components/shared/NoData";
import Loader from "../components/shared/Loader";
import type { IncomeExpenseType } from "../types";

function TransactionList() {
  const [transactionList, setTransactionList] = useState<IncomeExpenseType[]>(
    []
  );
  const [editingRow, setEditingRow] = useState<IncomeExpenseType | null>(null);
  const [deletingRow, setDeletingRow] = useState<IncomeExpenseType | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchData();
  }, [categoriesList]);

  const fetchCategories = async () => {
    try {
      const data = await getFromFirebase("categories");
      const categories = Object.entries(data || {}).map(
        ([key, value]: any) => ({
          id: key,
          type: value.type,
          category: value.category,
          date: value.date,
        })
      );
      setCategoriesList(categories);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchData = async () => {
    try {
      const data = await getFromFirebase("");
      const expenses = data.expenses || {};
      const incomes = data.incomes || {};

      console.log(data, "Fetched data from Firebase");

      const resolveCategory = (id: string) => {
        return categoriesList.find((cat) => cat.id === id);
      };

      const mapEntries = (entries: any, type: "incomes" | "expenses") =>
        Object.entries(entries).map(([key, value]: any) => {
          const cat = resolveCategory(value.selectedCategory?.id);
          return {
            id: key,
            type,
            date: new Date(value.date).toLocaleDateString(),
            amount: value.amount,
            description: value.description,
            selectedCategory: cat
              ? { ...cat }
              : {
                  id: value.selectedCategory?.id || "",
                  category: "Unknown",
                  type: "",
                  date: "",
                },
          };
        });

      const all = [
        ...mapEntries(expenses, "expenses"),
        ...mapEntries(incomes, "incomes"),
      ].reverse();

      setTransactionList(all);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deletingRow) {
      handleDelete(deletingRow);
    }
  }, [deletingRow]);

  const handleDelete = async (row: IncomeExpenseType) => {
    try {
      await deleteFromFirebase(`${row.type}/${row.id}`);
      setTransactionList((prev) => prev.filter((item) => item.id !== row.id));
    } catch (err) {
      console.error("Delete error", err);
    } finally {
      setDeletingRow(null);
    }
  };

  const handleEdit = async (updatedData: any) => {
    try {
      const { id, description, amount, selectedCategory, type } = updatedData;
      const category = categoriesList.find(
        (cat) => cat.id === selectedCategory.id
      );
      if (!category) throw new Error("Category not found");

      await putToFirebase(`${type}/${id}`, {
        description,
        amount,
        selectedCategory: category,
        date: Date.now(),
        type,
      });

      setEditingRow(null);
      await fetchData();
    } catch (err) {
      console.error("Edit error", err);
    }
  };

  const handleAdd = async (data: any) => {
    try {
      const category = categoriesList.find(
        (cat) => cat.id === data.selectedCategory.id
      );
      if (!category) throw new Error("Category not found");

      await postToFirebase(`${category.type}/`, {
        description: data.description,
        amount: data.amount,
        selectedCategory: category,
        date: Date.now(),
      });

      setModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error("Add error", err);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {transactionList.length === 0 ? (
        <div className="h-full p-6">
          <NoData
            showIncomeAction={true}
            showExpenseAction={true}
            onAddTransaction={() => setModalOpen(true)}
            title="No Transactions Yet"
            buttonLabel="Add Transaction"
            description="You haven’t added any income or expenses. Visit the Income or Expense section to create a transaction."
          />
        </div>
      ) : (
        <Table
          data={transactionList}
          showActionsColumn={true}
          showActionButton={true}
          actionButtonLabel="Add Transaction"
          showTotal={false}
          onEditButtonClick={(row) => setEditingRow(row)}
          onDeleteButtonClick={(row) => setDeletingRow(row)}
          onActionButtonClick={() => setModalOpen(true)}
        />
      )}

      {isModalOpen && (
        <ModalForm
          isOpen={true}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAdd}
          categoriesList={categoriesList}
        />
      )}

      {editingRow && (
        <ModalForm
          isOpen={true}
          onClose={() => setEditingRow(null)}
          onSubmit={handleEdit}
          type={editingRow.type}
          initialData={editingRow}
          categoriesList={categoriesList}
        />
      )}
    </>
  );
}

export default TransactionList;
