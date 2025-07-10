import { useEffect, useState } from "react";
import {
  deleteFromFirebase,
  getFromFirebase,
  postToFirebase,
  putToFirebase,
} from "../api/firebaseAPI";
import NoData from "../components/shared/NoData";
import type { CategoryProps, IncomeExpenseType } from "../types";
import Loader from "../components/shared/Loader";
import CategoryModal from "../components/shared/CategoryModal";
import CategoriesTable from "../components/shared/categories-table/CategoriesTable";
import { clearDeletedCategoryFromTransactions } from "../components/helpers/clearDeletedCategoryFromTransactions";

function TransactionList() {
  const [categoriesList, setCategoriesList] = useState<CategoryProps[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingRow, setEditingRow] = useState<IncomeExpenseType | null>(null);
  const [deletingRow, setDeletingRow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
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

  const handleDelete = async (row: CategoryProps) => {
    try {
      await deleteFromFirebase(`categories/${row.id}`);
      await clearDeletedCategoryFromTransactions(row.id);

      const updatedList = categoriesList.filter((item) => item.id !== row.id);
      setCategoriesList(updatedList);
      setDeletingRow(null);
    } catch (err) {
      console.error("Error deleting category:", err);
    }
  };

  const handleEdit = async (updatedData: any) => {
    try {
      const { id, category, type } = updatedData;
      await putToFirebase(`categories/${id}`, {
        category,
        type,
        date: Date.now(),
      });
      setEditingRow(null);
      await fetchData();
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  const handleAdd = async (data: any) => {
    try {
      await postToFirebase(`categories/`, {
        category: data.category,
        type: data.type,
        date: Date.now(),
      });
      setShowCategoryModal(false);
      fetchData();
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {categoriesList.length === 0 ? (
        <div className="h-full p-6">
          <NoData
            showIncomeAction={true}
            showExpenseAction={true}
            onAddTransaction={() => setShowCategoryModal(true)}
            title="No Transactions Yet"
            buttonLabel="Add Category"
            description="You haven’t added any income or expenses. Visit the Income or Expense section to create a transaction."
          />
        </div>
      ) : (
        <CategoriesTable
          data={categoriesList}
          showActionsColumn={true}
          showActionButton={true}
          actionButtonLabel="New Category"
          onActionButtonClick={() => setShowCategoryModal(true)}
          showTotal={false}
          onEditButtonClick={(row) => setEditingRow(row)}
          onDeleteButtonClick={(row) => setDeletingRow(row)}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          isOpen={true}
          onClose={() => setShowCategoryModal(false)}
          onSave={handleAdd}
        />
      )}

      {editingRow && (
        <CategoryModal
          isOpen={true}
          onClose={() => setEditingRow(null)}
          onSave={handleEdit}
          initialData={editingRow}
        />
      )}
    </>
  );
}

export default TransactionList;
