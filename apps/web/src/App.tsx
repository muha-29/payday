import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import Home from './pages/Home';
import Earnings from './pages/Earnings';
import AddIncome from './pages/AddIncome';
import Savings from './pages/Savings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import AddGoal from './pages/AddGoal';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="/add-income" element={<AddIncome />} />

        <Route path="savings" element={<Savings />} />
        <Route path="/add-goal" element={<AddGoal />} />

        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>)
}