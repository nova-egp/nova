import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import Product from '@/pages/Product';
import Custom from '@/pages/Custom';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import About from '@/pages/About';

import AccountLayout from '@/pages/account/AccountLayout';
import Login from '@/pages/account/Login';
import Register from '@/pages/account/Register';
import OrderHistory from '@/pages/account/OrderHistory';

import AdminLayout from '@/pages/admin/AdminLayout';
import AdminLogin from '@/pages/admin/AdminLogin';
import Dashboard from '@/pages/admin/Dashboard';
import OrdersList from '@/pages/admin/OrdersList';
import OrderDetail from '@/pages/admin/OrderDetail';
import CustomOrders from '@/pages/admin/CustomOrders';
import Inventory from '@/pages/admin/Inventory';

function NotFound() {
  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-24 text-center">
      <h1 className="font-display text-3xl text-navy-800 mb-4">Page not found</h1>
      <a href="/" className="text-gold-dim underline">Back home</a>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Storefront — shares the public Navbar/Footer */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<Product />} />
        <Route path="/custom" element={<Custom />} />
        <Route path="/about" element={<About />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/account/login" element={<Login />} />
        <Route path="/account/register" element={<Register />} />
        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<OrderHistory />} />
          <Route path="orders" element={<OrderHistory />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin — separate shell, no public Navbar/Footer */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<OrdersList />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="custom-orders" element={<CustomOrders />} />
        <Route path="inventory" element={<Inventory />} />
      </Route>
    </Routes>
  );
}
