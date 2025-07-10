import { useEffect, useState } from "react";
import Table from "../components/shared/table/Table";
import { getFromFirebase, postToFirebase } from "../api/firebaseAPI";
import PieChartCard from "../components/sections/charts/PieChartCard";
import NoData from "../components/shared/NoData";
import Loader from "../components/shared/Loader";
import type { IncomeExpenseType } from "../types";
import ModalForm from "../components/shared/ModalForm";

function Home() {
  const [transactionList, setTransactionList] = useState<IncomeExpenseType[]>(
    []
  );
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  const [categoriesList, setCategoriesList] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchData();
  }, [categoriesList]);

  const fetchCategories = async () => {
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
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  const fetchData = async () => {
    try {
      const data = await getFromFirebase("");
      const expenses = data.expenses || {};
      const incomes = data.incomes || {};

      console.log(data, "Fetched data from Firebase");

      const resolveCategory = (id: string) => {
        return categoriesList.find((cat) => cat.id === id);
      };

      const mapEntries = (entries: any, type: "incomes" | "expenses") =>
        Object.entries(entries).map(([key, value]: any) => {
          const cat = resolveCategory(value.selectedCategory?.id);
          return {
            id: key,
            type,
            date: new Date(value.date).toLocaleDateString(),
            amount: value.amount,
            description: value.description,
            selectedCategory: cat
              ? { ...cat }
              : {
                  id: value.selectedCategory?.id || "",
                  category: "Unknown",
                  type: "",
                  date: "",
                },
          };
        });

      const all = [
        ...mapEntries(expenses, "expenses"),
        ...mapEntries(incomes, "incomes"),
      ].reverse();

      // const totalIncome = incomeEntries.reduce(
      //   (sum, item) => sum + item.amount,
      //   0
      // );
      // const totalExpense = expenseEntries.reduce(
      //   (sum, item) => sum + item.amount,
      //   0
      // );
      // setIncomeTotal(totalIncome);
      // setExpenseTotal(totalExpense);

      setTransactionList(all);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  const handleAdd = async (data: any) => {
    try {
      const category = categoriesList.find(
        (cat) => cat.id === data.selectedCategory.id
      );
      if (!category) throw new Error("Category not found");

      await postToFirebase(`${category.type}/`, {
        description: data.description,
        amount: data.amount,
        selectedCategory: category,
        date: Date.now(),
      });

      setModalOpen(false);
      await fetchData();
    } catch (err) {
      console.error("Add error", err);
    }
  };
  if (loading) {
    return <Loader />;
  }

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
