import { useEffect, useState } from "react";
import Table from "../components/shared/table/Table";
import ModalForm from "../components/shared/ModalForm";
import {
  deleteFromFirebase,
  postToFirebase,
  putToFirebase,
} from "../api/firebaseAPI";
import NoData from "../components/shared/NoData";
import Loader from "../components/shared/Loader";
import type { IncomeExpenseType } from "../types";
import { useCategories } from "../hooks/useCategories";
import { useTransactions } from "../hooks/useTransactions";

function TransactionList() {
  const [editingRow, setEditingRow] = useState<IncomeExpenseType | null>(null);
  const [deletingRow, setDeletingRow] = useState<IncomeExpenseType | null>(
    null
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const { categoriesList, loadingCategories } = useCategories();

  const { transactionList, loading, refetchTransactions } =
    useTransactions(categoriesList);

  useEffect(() => {
    if (deletingRow) {
      handleDelete(deletingRow);
    }
  }, [deletingRow]);

  const handleDelete = async (row: IncomeExpenseType) => {
    try {
      await deleteFromFirebase(`${row.type}/${row.id}`);
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
      await refetchTransactions();
    } catch (err) {
      console.error("Add error", err);
    }
  };

  if (loading || loadingCategories) return <Loader />;

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
