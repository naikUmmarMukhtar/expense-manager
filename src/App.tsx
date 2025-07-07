import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import IncomeList from "./pages/IncomeList";
import ExpenseList from "./pages/ExpenseList";
import Sidebar from "./components/sections/Sidebar";
import Transaction from "./pages/TransactionList";

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 h-screen overflow-y-auto bg-white ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/incomes" element={<IncomeList />} />
            <Route path="/expenses" element={<ExpenseList />} />
            <Route path="/transactions" element={<Transaction />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
