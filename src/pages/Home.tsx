import { useState } from "react";
import { postToFirebase } from "../api/firebaseAPI";
import Table from "../components/shared/table/Table";
import PieChartCard from "../components/sections/charts/PieChartCard";
import NoData from "../components/shared/NoData";
import Loader from "../components/shared/Loader";
import ModalForm from "../components/shared/ModalForm";
import { useCategories } from "../hooks/useCategories";
import { useTransactions } from "../hooks/useTransactions";

function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { categoriesList, loadingCategories } = useCategories();
  const {
    transactionList,
    incomeTotal,
    expenseTotal,
    loading,
    refetchTransactions,
  } = useTransactions(categoriesList);

  const handleAdd = async (data: any) => {
    try {
      const category = categoriesList.find(
        (cat) => cat.id === data.selectedCategory.id
      );
      if (!category) throw new Error("Category not found");

      await postToFirebase(`${category.type}/`, {
        description: data.description,
        amount: Number(data.amount),
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
      {transactionList.length > 0 ? (
        <main className="flex-1 bg-white min-h-screen p-6 md:p-10 overflow-y-auto">
          <section className="mb-10">
            <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">
                  Financial Overview
                </h1>
                <p className="text-sm text-gray-500">Income vs Expense</p>
              </div>
              <PieChartCard income={incomeTotal} expense={expenseTotal} />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Transaction History
            </h2>
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <Table
                showTotal={true}
                data={transactionList}
                incomeTotal={incomeTotal}
                expenseTotal={expenseTotal}
              />
            </div>
          </section>
        </main>
      ) : (
        <NoData
          showIncomeAction={true}
          showExpenseAction={true}
          title="No Transactions Yet"
          buttonLabel="Add Transaction"
          onAddTransaction={() => setModalOpen(true)}
          description="You haven’t added any transactions yet. Go to the Income or Expense tab to start tracking."
        />
      )}

      {isModalOpen && (
        <ModalForm
          isOpen={true}
          onClose={() => setModalOpen(false)}
          type="Income"
          onSubmit={handleAdd}
          categoriesList={categoriesList}
        />
      )}
    </>
  );
}

export default Home;
