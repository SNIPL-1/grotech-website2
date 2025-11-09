// src/pages/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

const CONFIG = {
  CSV_DATA:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTp1LlW5tsWIyE7E5BGFiKHS2qBjzh8wGaZdR3EsQSzXVyxgq1hrh4y54KpkVHiL-4Moux0CA43c4nb/pub?gid=0&single=true&output=csv',
  CSV_IMAGES:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vTp1LlW5tsWIyE7E5BGFiKHS2qBjzh8wGaZdR3EsQSzXVyxgq1hrh4y54KpkVHiL-4Moux0CA43c4nb/pub?gid=676833393&single=true&output=csv',
};

export default function ProductDetail() {
  const { itemCode } = useParams();
  const [product, setProduct] = useState(null);
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProduct() {
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

      const item = dataCsv.find((r) => r['Item Code'] === itemCode);
      const img = imgCsv.find((r) => r['Item Code'] === itemCode);
      setProduct(item);
      setImage(img ? img['Image URL'] : '');
    }
    loadProduct();
  }, [itemCode]);

  if (!product) return <div>Loading...</div>;

  return (
    <div className="card product-detail">
      {image && (
        <img src={image} alt={product['Item Name']} className="product-detail-img" />
      )}
      <h2>{product['Item Name']}</h2>
      <p><strong>Item Code:</strong> {product['Item Code']}</p>
      <p><strong>Description:</strong> {product['Description']}</p>
      <p><strong>Price:</strong> {product['Price/Unit']}</p>
      <p><strong>Unit:</strong> {product['Unit']}</p>
      <p><strong>MOQ:</strong> {product['MOQ']}</p>
      <button className="btn" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}
