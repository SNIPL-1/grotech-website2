import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <div className="brand">
          <h1>GROTECH</h1>
          <p className="tagline">Sri Neelkanth Impex Pvt. Ltd.</p>
        </div>
        <nav id="mainNav">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/products">Products</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/enquiry">Enquiry</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
