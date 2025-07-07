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
import type { IncomeExpenseType } from "../types";
import Loader from "../components/shared/Loader";

function ExpenseList() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [expenseList, setExpenseList] = useState<IncomeExpenseType[]>([]);
  const [deletingRow, setDeletingRow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    if (deletingRow) {
      handleDelete(deletingRow);
    }
  }, [deletingRow]);

  const fetchExpenses = async () => {
    try {
      const res = await getFromFirebase("expenses");
      const data = Object.entries(res)?.map(([key, value]: any) => ({
        id: key,
        date: new Date(value.date).toLocaleDateString(),
        description: value.description,
        amount: value.amount,
        type: value.type,
      }));
      setExpenseList(data.reverse());
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFromFirebase(`expenses/${id}`);
      setDeletingRow(null);
      const updatedList = expenseList.filter((item) => item.id !== id);
      setExpenseList(updatedList);
    } catch (err) {}
  };

  const handleAdd = async (data: any) => {
    try {
      await postToFirebase("expenses", {
        description: data.description,
        amount: data.amount,
        date: Date.now(),
        type: data.type,
      });
      setModalOpen(false);
      fetchExpenses();
    } catch (err) {}
  };

  const handleEdit = async (updatedData: any) => {
    try {
      const { id, description, amount, type } = updatedData;
      await putToFirebase(`expenses/${id}`, {
        description,
        amount,
        type,
        date: Date.now(),
      });
      setEditingRow(null);
      fetchExpenses();
    } catch (err) {}
  };
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {expenseList.length == 0 ? (
        <NoData
          showExpenseAction={true}
          onAddExpense={() => setModalOpen(true)}
          title="No Expenses Yet"
          description="Start tracking your spending by adding your first expense."
        />
      ) : (
        <Table
          data={expenseList}
          showActionButton={true}
          actionButtonLabel="Add Expense"
          showActionsColumn={true}
          onActionButtonClick={() => setModalOpen(true)}
          onEditButtonClick={(row) => setEditingRow(row)}
          onDeleteButtonClick={(row) => setDeletingRow(row.id)}
        />
      )}

      {isModalOpen && (
        <ModalForm
          isOpen={true}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAdd}
          type="Expense"
        />
      )}

      {editingRow && (
        <ModalForm
          isOpen={true}
          onClose={() => setEditingRow(null)}
          onSubmit={handleEdit}
          type="Expense"
          initialData={editingRow}
        />
      )}
    </>
  );
}

export default ExpenseList;
