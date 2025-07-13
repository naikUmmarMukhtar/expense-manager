import { useState, useEffect } from "react";
import {
  deleteFromFirebase,
  postToFirebase,
  putToFirebase,
} from "../api/firebaseAPI";
import NoData from "../components/shared/NoData";
import Loader from "../components/shared/Loader";
import CategoryModal from "../components/shared/CategoryModal";
import CategoriesTable from "../components/shared/categories-table/CategoriesTable";
import { clearDeletedCategoryFromTransactions } from "../components/helpers/clearDeletedCategoryFromTransactions";
import { useCategories } from "../hooks/useCategories";
import type { CategoryProps, IncomeExpenseType } from "../types";

function TransactionList() {
  const { categoriesList, loadingCategories, refetchCategories } =
    useCategories();
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingRow, setEditingRow] = useState<IncomeExpenseType | null>(null);
  const [deletingRow, setDeletingRow] = useState<CategoryProps | null>(null);

  console.log(categoriesList, "categoriesList");

  useEffect(() => {
    if (deletingRow) {
      handleDelete(deletingRow);
    }
  }, [deletingRow]);

  const handleDelete = async (row: CategoryProps) => {
    try {
      await deleteFromFirebase(`categories/${row.id}`);
      await clearDeletedCategoryFromTransactions(row.id);
      await refetchCategories();
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
      await refetchCategories();
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
      await refetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  if (loadingCategories) {
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
            title="No Categories Yet"
            buttonLabel="Add Category"
            description="You haven’t added any income or expense categories yet. Create one to get started."
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
