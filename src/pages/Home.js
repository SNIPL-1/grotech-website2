import React from "react";
import PageWrapper from "../components/PageWrapper";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <PageWrapper>
      <section className="home">
        <h2>Welcome to GROTECH</h2>
        <p>Your trusted partner in industrial and commercial equipment.</p>
        <div className="home-actions">
          <Link to="/products" className="btn">Explore Products</Link>
        </div>
      </section>
    </PageWrapper>
  );
}
