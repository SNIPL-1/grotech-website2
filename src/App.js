import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import CategoryItems from "./pages/CategoryItems";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Enquiry from "./pages/Enquiry";
import Contact from "./pages/Contact";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:category" element={<CategoryItems />} />
        <Route path="/product/:itemCode" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <Header />
      <main className="container">
        <AnimatedRoutes />
      </main>
      <Footer />
    </Router>
  );
}
