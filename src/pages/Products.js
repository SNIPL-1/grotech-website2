import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";

const CONFIG = {
  CSV_CATEGORIES:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTp1LlW5tsWIyE7E5BGFiKHS2qBjzh8wGaZdR3EsQSzXVyxgq1hrh4y54KpkVHiL-4Moux0CA43c4nb/pub?gid=2136776722&single=true&output=csv",
};

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Papa.parse(CONFIG.CSV_CATEGORIES, {
      download: true,
      header: true,
      complete: (results) => {
        const cats = results.data
          .filter((r) => r.Category)
          .map((r) => ({
            category: r.Category.trim(),
            image: r["Image URL"],
          }));
        setCategories(cats);
      },
    });
  }, []);

  const filtered = categories.filter((c) =>
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper>
      <h2>Product Categories</h2>
      <input
        type="text"
        placeholder="Search categories..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <div className="grid cards">
        {filtered.map((c, idx) => (
          <motion.div
            key={c.category}
            className="card hoverable"
            onClick={() => navigate(`/products/${encodeURIComponent(c.category)}`)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            {c.image && (
              <img
                src={c.image}
                alt={c.category}
                className="category-img"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
            <h3>{c.category}</h3>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  );
}
