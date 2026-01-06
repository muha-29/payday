import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './layouts/AppLayout';
import Home from './pages/Home';
import Earnings from './pages/Earnings/EarningsHome';
import AddIncome from './pages/Earnings/AddEarning';
import Savings from './pages/Savings/SavingsHome';
import Profile from './pages/Profile/ProfileHome';
import Login from './pages/Login';
import AddGoal from './pages/AddGoal';
import ChatHistory from './pages/Profile/ChatHistory';
import { ChatPage } from './components/chat/ChatPage';

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
        <Route path="/app/add-income" element={<AddIncome />} />

        <Route path="savings" element={<Savings />} />
        <Route path="/add-goal" element={<AddGoal />} />
        <Route path="/app/profile/history" element={<ChatHistory />} />
        <Route path="profile" element={<Profile />} />
        <Route path="/app/chat" element={<ChatPage />} />
      </Route>
    </Routes>)
}