import { useEffect, useState } from "react";
import Table from "../components/shared/table/Table";
import ModalForm from "../components/shared/ModalForm";
import {
  deleteFromFirebase,
  getFromFirebase,
  putToFirebase,
} from "../api/firebaseAPI";
import NoData from "../components/shared/NoData";
import { useNavigate } from "react-router-dom";
import type { IncomeExpenseType } from "../types";
import Loader from "../components/shared/Loader";

function TransactionList() {
  const [transactionList, setTransactionList] = useState<IncomeExpenseType[]>(
    []
  );
  const [editingRow, setEditingRow] = useState<IncomeExpenseType | null>(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getFromFirebase("");
      const expenses = data.expenses || {};
      const incomes = data.incomes || {};

      const expenseEntries = Object.entries(expenses).map(
        ([key, value]: any) => ({
          id: key,
          type: "expenses",
          date: new Date(value.date).toLocaleDateString(),
          amount: value.amount,
          description: value.description,
        })
      );

      const incomeEntries = Object.entries(incomes).map(
        ([key, value]: any) => ({
          id: key,
          type: "incomes",
          date: new Date(value.date).toLocaleDateString(),
          description: value.description,
          amount: value.amount,
        })
      );

      const all = expenseEntries.concat(incomeEntries).reverse();

      setTransactionList(all);
      setLoading(false);
    } catch (error) {
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
      setDeletingRow(null);
      const updatedList = transactionList.filter((item) => item.id !== row.id);
      setTransactionList(updatedList);
    } catch (err) {}
  };

  const handleEdit = async (updatedData: any) => {
    try {
      const { id, description, amount, type } = updatedData;
      await putToFirebase(`${type}/${id}`, {
        description,
        amount,
        type,
        date: Date.now(),
      });
      setEditingRow(null);
      await fetchData();
    } catch (err) {}
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
            onAddIncome={() => navigate("/incomes")}
            onAddExpense={() => navigate("/expenses")}
            title="No Transactions Yet"
            description="You haven’t added any income or expenses. Visit the Income or Expense section to create a transaction."
          />
        </div>
      ) : (
        <Table
          data={transactionList}
          showActionsColumn={true}
          showActionButton={false}
          showTotal={false}
          onEditButtonClick={(row) => setEditingRow(row)}
          onDeleteButtonClick={(row) => setDeletingRow(row)}
        />
      )}

      {editingRow && (
        <ModalForm
          isOpen={true}
          onClose={() => setEditingRow(null)}
          onSubmit={handleEdit}
          type={editingRow.type}
          initialData={editingRow}
        />
      )}
    </>
  );
}

export default TransactionList;
