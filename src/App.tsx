// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./components/sections/Sidebar";
import AuthForm from "./features/auth/AuthForm";
import EmailConfirmationNotice from "./features/auth/EmailConfirmationNotice";
import Home from "./pages/Home";
import IncomeList from "./pages/IncomeList";
import ExpenseList from "./pages/ExpenseList";
import Transaction from "./pages/TransactionList";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";

function App() {
  const { isAuthenticated, isEmailVerified } = useSelector(
    (state: any) => state.auth
  );

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  if (!isEmailVerified) {
    return <EmailConfirmationNotice />;
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
