import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import CarDetail from './pages/CarDetail';
import Wishlist from './pages/Wishlist';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import Transactions from './pages/Transactions';
import AdminDashboard from './pages/AdminDashboard';
import AdminCars from './pages/AdminCars';
import AdminInquiries from './pages/AdminInquiries';
import AdminTestDrives from './pages/AdminTestDrives';
import AdminTransactions from './pages/AdminTransactions';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/cars/:id" element={<CarDetail />} />
            <Route path="/catalog" element={<Catalog />} />

            <Route path="/wishlist" element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/transactions" element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            <Route path="/admin/cars" element={
              <ProtectedRoute adminOnly>
                <AdminCars />
              </ProtectedRoute>
            } />

            <Route path="/admin/inquiries" element={
              <ProtectedRoute adminOnly>
                <AdminInquiries />
              </ProtectedRoute>
            } />

            <Route path="/admin/test-drives" element={
              <ProtectedRoute adminOnly>
                <AdminTestDrives />
              </ProtectedRoute>
            } />

            <Route path="/admin/transactions" element={
              <ProtectedRoute adminOnly>
                <AdminTransactions />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
