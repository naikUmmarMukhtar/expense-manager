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

function Home() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
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
    const startDate = dayjs(start).valueOf(); // convert to timestamp
    const endDate = dayjs(end).valueOf();

    const filtered = transactionList.filter((t) => {
      const transactionDate = Number(t.date); // ensure number
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
          />
        </div>

        {filteredTransactions.length ? (
          <>
            <section className="mb-10">
              <div className="rounded-lg border p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  Financial Overview
                </h1>
                <p className="text-sm text-gray-500 mb-8">Income vs Expense</p>
                <PieChartCard
                  income={filteredTransactions
                    .filter((t) => t.selectedCategory?.type === "incomes")
                    .reduce((sum, t) => sum + Number(t.amount), 0)}
                  expense={filteredTransactions
                    .filter((t) => t.selectedCategory?.type === "expenses")
                    .reduce((sum, t) => sum + Number(t.amount), 0)}
                />
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
