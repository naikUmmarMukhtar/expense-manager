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
  const [isModalOpen, setModalOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
    fetchCategories();
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
          selectedCategory: value.selectedCategory,
        })
      );

      const incomeEntries = Object.entries(incomes).map(
        ([key, value]: any) => ({
          id: key,
          type: "incomes",
          date: new Date(value.date).toLocaleDateString(),
          description: value.description,
          amount: value.amount,
          selectedCategory: value.selectedCategory,
        })
      );

      const all = expenseEntries.concat(incomeEntries).reverse();

      setTransactionList(all);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  console.log(transactionList, "transactionList");

  const fetchCategories = async () => {
    try {
      const data = await getFromFirebase("categories");
      const categories = Object.entries(data || {}).map(
        ([key, value]: any) => ({
          id: key,
          type: value.type,
          category: value.category,
          date: new Date(value.date).toLocaleDateString(),
        })
      );
      setCategoriesList(categories);
    } catch (error) {
      return [];
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

  const handleAdd = async (data: any) => {
    console.log(data, "data in handleAdd");

    try {
      const { description, amount, selectedCategory } = data;
      await postToFirebase(`${data.selectedCategory.type}/`, {
        description,
        amount,
        selectedCategory,
        date: Date.now(),
      });
      setModalOpen(false);
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
        />
      )}
    </>
  );
}

export default TransactionList;
