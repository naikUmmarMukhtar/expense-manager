import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/sections/Sidebar";
import AuthForm from "./features/auth/AuthForm";
import Home from "./pages/Home";
import IncomeList from "./pages/IncomeList";
import ExpenseList from "./pages/ExpenseList";
import Transaction from "./pages/TransactionList";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";
import Loader from "./components/shared/Loader";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <Loader />;

  if (!user || !user.emailVerified) {
    return <AuthForm />;
  }

  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 h-screen overflow-y-auto bg-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/incomes" element={<IncomeList />} />
            <Route path="/expenses" element={<ExpenseList />} />
            <Route path="/transactions" element={<Transaction />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
