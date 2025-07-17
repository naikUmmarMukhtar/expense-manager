import { useEffect, useState } from "react";
import { postToFirebase } from "../api/firebaseAPI";
import Table from "../components/shared/table/Table";
import PieChartCard from "../components/sections/charts/PieChartCard";
import NoData from "../components/shared/NoData";
import Loader from "../components/shared/Loader";
import ModalForm from "../components/shared/ModalForm";
import SearchFilters from "../components/shared/SearchFilters";
import { useCategories } from "../hooks/useCategories";
import { useTransactions } from "../hooks/useTransactions";
import dayjs from "dayjs";
import type { IncomeExpenseType } from "../types";
import LineChartCard from "../components/sections/charts/LineChartCard";

function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState<
    IncomeExpenseType[]
  >([]);
  const [hasSearched, setHasSearched] = useState(false);

  const { categoriesList, loadingCategories } = useCategories();
  const {
    transactionList,
    incomeTotal,
    expenseTotal,
    loading,
    refetchTransactions,
  } = useTransactions(categoriesList);

  useEffect(() => {
    setFilteredTransactions(transactionList);
  }, [transactionList]);

  const handleAdd = async (data: any) => {
    const category = categoriesList.find(
      (cat) => cat.id === data.selectedCategory.id
    );
    if (!category) return console.error("Category not found");

    await postToFirebase(`${category.type}/`, {
      description: data.description,
      amount: +data.amount,
      selectedCategory: category,
      date: Date.now(),
    });

    setModalOpen(false);
    refetchTransactions();
  };

  const handleSearchByKeyword = (keyword: string) => {
    const filtered = transactionList.filter((t) =>
      t.description.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilteredTransactions(filtered);
    setHasSearched(true);
  };
  const handleSearchByDate = (start: string, end: string) => {
    console.log(start, end);

    const startDate = dayjs(start).valueOf();
    const endDate = dayjs(end).endOf("day").valueOf();

    const filtered = transactionList.filter((t) => {
      const transactionDate = Number(t.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    setFilteredTransactions(filtered);
    setHasSearched(true);
  };

  if (loading || loadingCategories) return <Loader />;

  if (!transactionList.length) {
    return (
      <>
        <NoData
          showIncomeAction
          showExpenseAction
          title="No Transactions Yet"
          buttonLabel="Add Transaction"
          onAddTransaction={() => setModalOpen(true)}
          description="You haven’t added any transactions yet. Go to the Income or Expense tab to start tracking."
        />
        {isModalOpen && (
          <ModalForm
            isOpen
            onClose={() => setModalOpen(false)}
            type="Income"
            onSubmit={handleAdd}
            categoriesList={categoriesList}
          />
        )}
      </>
    );
  }

  return (
    <>
      <main className="flex-1 bg-white min-h-screen p-6 md:p-10 overflow-y-auto">
        <div className="sticky top-0 z-20 bg-white pb-4">
          <SearchFilters
            onSearchByKeyword={handleSearchByKeyword}
            onSearchByDate={handleSearchByDate}
            resetDate={() => {
              setFilteredTransactions(transactionList);
              setHasSearched(false);
            }}
          />
        </div>

        {filteredTransactions.length ? (
          <>
            <section className="mb-10">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
                <div className="mb-6">
                  <h1 className="text-3xl font-semibold text-gray-900">
                    Financial Overview
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Track your income and expenses visually
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-[50%] w-full bg-white border border-gray-100 rounded-xl shadow-sm p-4">
                    <h2 className="text-lg font-medium text-gray-800 mb-3">
                      Expense Breakdown
                    </h2>
                    <PieChartCard
                      income={filteredTransactions
                        .filter((t) => t.selectedCategory?.type === "incomes")
                        .reduce((sum, t) => sum + Number(t.amount), 0)}
                      expense={filteredTransactions
                        .filter((t) => t.selectedCategory?.type === "expenses")
                        .reduce((sum, t) => sum + Number(t.amount), 0)}
                    />
                  </div>

                  <div className="md:w-[50%] w-full bg-white border border-gray-100 rounded-xl shadow-sm p-4">
                    <h2 className="text-lg font-medium text-gray-800 mb-3">
                      Income vs Expense Over Time
                    </h2>
                    <LineChartCard data={filteredTransactions} />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Transaction History
              </h2>
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <Table
                  showTotal
                  data={filteredTransactions}
                  incomeTotal={incomeTotal}
                  expenseTotal={expenseTotal}
                />
              </div>
            </section>
          </>
        ) : hasSearched ? (
          <NoData
            title="No Results Found"
            description="We couldn’t find any transactions matching your search."
            showIncomeAction={false}
            showExpenseAction={false}
          />
        ) : (
          <Loader />
        )}
      </main>

      {isModalOpen && (
        <ModalForm
          isOpen
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
