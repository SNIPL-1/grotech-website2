// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';

const CONFIG = {
  CSV_CATEGORIES:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTp1LlW5tsWIyE7E5BGFiKHS2qBjzh8wGaZdR3EsQSzXVyxgq1hrh4y54KpkVHiL-4Moux0CA43c4nb/pub?gid=2136776722&single=true&output=csv',
};

export default function Home() {
  const [categories, setCategories] = useState([]);
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
            image: r['Image URL'],
          }));
        setCategories(cats);
      },
    });
  }, []);

  return (
    <section>
      <h2>Product Categories</h2>
      <div className="grid cards">
        {categories.map((c) => (
          <div
            key={c.category}
            className="card hoverable"
            onClick={() => navigate(`/products/${encodeURIComponent(c.category)}`)}
          >
            {c.image && (
              <img
                src={c.image}
                alt={c.category}
                className="category-img"
                onError={(e) => (e.target.style.display = 'none')}
              />
            )}
            <h3>{c.category}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}
