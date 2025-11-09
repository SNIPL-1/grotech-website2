// src/pages/CategoryItems.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Papa from 'papaparse';

const CONFIG = {
  CSV_DATA:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTp1LlW5tsWIyE7E5BGFiKHS2qBjzh8wGaZdR3EsQSzXVyxgq1hrh4y54KpkVHiL-4Moux0CA43c4nb/pub?gid=0&single=true&output=csv',
  CSV_IMAGES:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTp1LlW5tsWIyE7E5BGFiKHS2qBjzh8wGaZdR3EsQSzXVyxgq1hrh4y54KpkVHiL-4Moux0CA43c4nb/pub?gid=676833393&single=true&output=csv',
};

export default function CategoryItems() {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [images, setImages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      const [dataCsv, imgCsv] = await Promise.all([
        new Promise((res) =>
          Papa.parse(CONFIG.CSV_DATA, {
            download: true,
            header: true,
            complete: (r) => res(r.data),
          })
        ),
        new Promise((res) =>
          Papa.parse(CONFIG.CSV_IMAGES, {
            download: true,
            header: true,
            complete: (r) => res(r.data),
          })
        ),
      ]);

      const imgs = {};
      imgCsv.forEach((r) => (imgs[r['Item Code']] = r['Image URL']));
      setImages(imgs);

      const catItems = dataCsv
        .filter((r) => r.Category === category)
        .map((r) => ({
          ItemCode: r['Item Code'],
          ItemName: r['Item Name'],
        }));

      setItems(catItems);
    }
    loadData();
  }, [category]);

  return (
    <section>
      <h2>{category}</h2>
      <div className="grid cards">
        {items.map((item) => (
          <div
            key={item.ItemCode}
            className="card hoverable"
            onClick={() => navigate(`/product/${item.ItemCode}`)}
          >
            {images[item.ItemCode] && (
              <img
                src={images[item.ItemCode]}
                alt={item.ItemName}
                className="product-thumb"
              />
            )}
            <div>
              <strong>{item.ItemName}</strong>
              <div className="muted">Code: {item.ItemCode}</div>
            </div>
          </div>
        ))}
      </div>
      <button className="btn" onClick={() => navigate('/products')}>
        Back to Categories
      </button>
    </section>
  );
}
