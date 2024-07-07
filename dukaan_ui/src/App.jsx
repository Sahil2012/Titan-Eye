import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginForm from "./pages/LoginForm";
import AddClients from "./pages/AddClients";
import ManageProducts from "./pages/ManageProducts";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppBar from "./components/AppBar";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppBar />
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addClient" 
            element={
              <ProtectedRoute>
                <AddClients />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/addProducts" 
            element={
              <ProtectedRoute>
                <ManageProducts />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
