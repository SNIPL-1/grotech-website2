import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Papa from "papaparse";
import PageWrapper from "../components/PageWrapper";

const CONFIG = {
  CSV_DATA:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTp1LlW5tsWIyE7E5BGFiKHS2qBjzh8wGaZdR3EsQSzXVyxgq1hrh4y54KpkVHiL-4Moux0CA43c4nb/pub?gid=0&single=true&output=csv",
  CSV_IMAGES:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTp1LlW5tsWIyE7E5BGFiKHS2qBjzh8wGaZdR3EsQSzXVyxgq1hrh4y54KpkVHiL-4Moux0CA43c4nb/pub?gid=676833393&single=true&output=csv",
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
          Papa.parse(CONFIG.CSV_DATA, { download: true, header: true, complete: (r) => res(r.data) })
        ),
        new Promise((res) =>
          Papa.parse(CONFIG.CSV_IMAGES, { download: true, header: true, complete: (r) => res(r.data) })
        ),
      ]);

      const imgs = {};
      imgCsv.forEach((r) => (imgs[r["Item Code"]] = r["Image URL"]));
      setImages(imgs);

      const catItems = dataCsv
        .filter((r) => r.Category === category)
        .map((r) => ({
          ItemCode: r["Item Code"],
          ItemName: r["Item Name"],
        }));

      setItems(catItems);
    }
    loadData();
  }, [category]);

  return (
    <PageWrapper>
      <h2>{category}</h2>
      <div className="grid cards">
        {items.map((item, idx) => (
          <motion.div
            key={item.ItemCode}
            className="card hoverable"
            onClick={() => navigate(`/product/${item.ItemCode}`)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            {images[item.ItemCode] && (
              <img src={images[item.ItemCode]} alt={item.ItemName} className="product-thumb" />
            )}
            <strong>{item.ItemName}</strong>
            <div className="muted">Code: {item.ItemCode}</div>
          </motion.div>
        ))}
      </div>
      <button className="btn" onClick={() => navigate("/products")}>Back</button>
    </PageWrapper>
  );
}
