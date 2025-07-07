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

function IncomeList() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);

  const [incomeList, setIncomeList] = useState<IncomeExpenseType[]>([]);
  const [deletingRowId, setDeletingRowId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const res = await getFromFirebase("incomes");
      const data = Object.entries(res)?.map(([key, value]: any) => ({
        id: key,
        date: new Date(value.date).toLocaleDateString(),
        description: value.description,
        amount: value.amount,
        type: value.type,
      }));
      setIncomeList(data.reverse());
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (deletingRowId) {
      handleDelete(deletingRowId);
    }
  }, [deletingRowId]);

  const handleDelete = async (id: string) => {
    try {
      await deleteFromFirebase(`incomes/${id}`);
      setDeletingRowId(null);

      const updatedList = incomeList.filter((item) => item.id !== id);
      setIncomeList(updatedList);
    } catch (err) {}
  };

  const handleAdd = async (data: any) => {
    try {
      await postToFirebase("incomes", {
        description: data.description,
        amount: data.amount,
        date: Date.now(),
        type: data.type,
      });
      setModalOpen(false);
      fetchIncomes();
    } catch (err) {}
  };

  const handleEdit = async (updatedData: any) => {
    try {
      const { id, description, amount, type } = updatedData;
      await putToFirebase(`incomes/${id}`, {
        description,
        amount,
        type,
        date: Date.now(),
      });
      setEditingRow(null);
      fetchIncomes();
    } catch (err) {}
  };
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {incomeList.length == 0 ? (
        <NoData
          showIncomeAction={true}
          onAddIncome={() => setModalOpen(true)}
          title="No Income Records"
          description="You haven’t logged any income yet. Add one to begin tracking."
        />
      ) : (
        <Table
          data={incomeList}
          showActionButton={true}
          actionButtonLabel="Add Income"
          showActionsColumn={true}
          onActionButtonClick={() => setModalOpen(true)}
          onEditButtonClick={(row) => setEditingRow(row)}
          onDeleteButtonClick={(row) => setDeletingRowId(row.id)}
        />
      )}

      {isModalOpen && (
        <ModalForm
          isOpen={true}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAdd}
          type="Income"
        />
      )}

      {editingRow && (
        <ModalForm
          isOpen={true}
          onClose={() => setEditingRow(null)}
          onSubmit={handleEdit}
          type="Income"
          initialData={editingRow}
        />
      )}
    </>
  );
}

export default IncomeList;
