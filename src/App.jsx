import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardHome from "./pages/DashboardHome";
import CoinDetail from "./pages/CoinDetail";
import Watchlist from "./pages/Watchlist";
import UpgradePremium from "./pages/UpgradePremium";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardHome />} />
          <Route path="/coin/:coinId" element={<CoinDetail />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/upgrade" element={<UpgradePremium />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
