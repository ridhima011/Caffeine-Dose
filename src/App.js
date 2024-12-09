import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.js';
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import Admin from './components/Admin.js';
import AdminLogin from './components/AdminLogin';
import PlaceOrder from './components/PlaceOrder.js';
import OrderConfirmation from './components/OrderConfirmation.js';
import AdminPage from './components/AdminPage.js';
import { CartProvider } from './components/CartContext.js'; 
// Import CartProvider


const App = () => {
  return (
    <Router>
      <CartProvider> {/* Wrap with CartProvider */}
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/register" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/place-order" element={<PlaceOrder />} />
          
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/adminpage" element={<AdminPage />} />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
};

export default App;
