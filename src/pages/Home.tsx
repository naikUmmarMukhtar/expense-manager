import { useEffect, useState } from "react";
import Table from "../components/shared/table/Table";
import { getFromFirebase } from "../api/firebaseAPI";
import PieChartCard from "../components/sections/charts/PieChartCard";
import NoData from "../components/shared/NoData";
import Loader from "../components/shared/Loader";
import { useNavigate } from "react-router-dom";
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getFromFirebase("");
      const expenses = data.expenses || {};
      const incomes = data.incomes || {};

      const expenseEntries = Object.entries(expenses).map(
        ([key, value]: any) => ({
          id: key,
          type: "Expense",
          date: value.date,
          amount: parseFloat(value.amount),
          description: value.description,
        })
      );

      const incomeEntries = Object.entries(incomes).map(
        ([key, value]: any) => ({
          id: key,
          type: "Income",
          date: value.date,
          amount: parseFloat(value.amount),
          description: value.description,
        })
      );

      const all = expenseEntries.concat(incomeEntries).reverse();
      setTransactionList(all);

      const totalIncome = incomeEntries.reduce(
        (sum, item) => sum + item.amount,
        0
      );
      const totalExpense = expenseEntries.reduce(
        (sum, item) => sum + item.amount,
        0
      );

      setIncomeTotal(totalIncome);
      setExpenseTotal(totalExpense);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          title="Welcome to Expense Tracker"
          description="You haven’t added any transactions yet. Go to the Income or Expense tab to start tracking."
        />
      )}

      {isModalOpen && (
        <ModalForm
          isOpen={true}
          onClose={() => setModalOpen(false)}
          // onSubmit={handleAdd}
          type="Income"
        />
      )}
    </>
  );
}

export default Home;
