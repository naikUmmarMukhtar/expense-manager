import { getFromFirebase, putToFirebase } from "../../api/firebaseAPI";

export const clearDeletedCategoryFromTransactions = async (
  deletedCategoryId: string
) => {
  try {
    const data = await getFromFirebase("");

    const updates: Promise<void>[] = [];

    const processEntries = (type: "incomes" | "expenses") => {
      const entries = data?.[type] || {};

      Object.entries(entries).forEach(([key, value]: any) => {
        if (value?.selectedCategory?.id === deletedCategoryId) {
          const updatedCategory = {
            ...value.selectedCategory,
            category: "",
          };

          updates.push(
            putToFirebase(`${type}/${key}`, {
              ...value,
              selectedCategory: updatedCategory,
            })
          );
        }
      });
    };

    processEntries("incomes");
    processEntries("expenses");

    await Promise.all(updates);
  } catch (err) {
    console.error("Error updating transactions after category deletion:", err);
  }
};
