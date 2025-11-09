import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import PageWrapper from "../components/PageWrapper";

const CONFIG = {
  CSV_DATA:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTp1LlW5tsWIyE7E5BGFiKHS2qBjzh8wGaZdR3EsQSzXVyxgq1hrh4y54KpkVHiL-4Moux0CA43c4nb/pub?gid=0&single=true&output=csv",
  CSV_IMAGES:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTp1LlW5tsWIyE7E5BGFiKHS2qBjzh8wGaZdR3EsQSzXVyxgq1hrh4y54KpkVHiL-4Moux0CA43c4nb/pub?gid=676833393&single=true&output=csv"
};

export default function ProductDetail() {
  const { itemCode } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [dataCsv, imgCsv] = await Promise.all([
          new Promise((res) =>
            Papa.parse(CONFIG.CSV_DATA, {
              download: true,
              header: true,
              skipEmptyLines: true,
              complete: (r) => res(r.data)
            })
          ),
          new Promise((res) =>
            Papa.parse(CONFIG.CSV_IMAGES, {
              download: true,
              header: true,
              skipEmptyLines: true,
              complete: (r) => res(r.data)
            })
          )
        ]);

        const matched = dataCsv.filter((r) => (r["Item Code"] || r.ItemCode || "").toString() === itemCode.toString());
        if (!cancelled) {
          setRows(matched);
          const imgRow = imgCsv.find((r) => (r["Item Code"] || "").toString() === itemCode.toString());
          setImage(imgRow ? imgRow["Image URL"] : "");
        }
      } catch (e) {
        console.error("Failed to load product detail", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => (cancelled = true);
  }, [itemCode]);

  function addToCart(variantRow) {
    const qtyStr = prompt("Enter quantity:");
    const qty = parseInt(qtyStr, 10);
    if (!qty || qty <= 0) {
      alert("Invalid quantity");
      return;
    }
    const stored = localStorage.getItem("grotech_cart");
    const cart = stored ? JSON.parse(stored) : [];
    const item = {
      itemName: variantRow["Item Name"] || variantRow.ItemName || rows[0]?.["Item Name"] || "",
      itemCode: variantRow["Item Code"] || variantRow.ItemCode || itemCode,
      variant: variantRow["Variant"] || variantRow.Variant || "",
      description: variantRow["Description"] || variantRow.Description || "",
      price: variantRow["Price/Unit"] || variantRow.Price || variantRow["Price"] || "",
      unit: variantRow["Unit"] || variantRow.Unit || "",
      qty,
      image
    };
    cart.push(item);
    localStorage.setItem("grotech_cart", JSON.stringify(cart));
    alert("Added to cart");
  }

  if (loading) return <PageWrapper><div>Loading product...</div></PageWrapper>;
  if (!rows || rows.length === 0) return <PageWrapper><div className="card">Product not found.</div></PageWrapper>;

  const base = rows[0];

  return (
    <PageWrapper>
      <div className="product-detail-wrap">
        <div className="card product-detail-left">
          {image ? (
            <img src={image} alt={base["Item Name"] || base.ItemName} className="product-detail-img" onError={(e)=>e.target.style.display='none'} />
          ) : (
            <div className="no-image">No image</div>
          )}
          <h2>{base["Item Name"] || base.ItemName}</h2>
          <div className="muted">Code: {base["Item Code"] || base.ItemCode}</div>
          <p className="muted">{base["Specs"] || base.Specs || ""}</p>
        </div>

        <div className="card product-detail-right">
          <h3>Variants</h3>
          <div style={{ overflowX: "auto" }}>
            <table className="variants-table">
              <thead>
                <tr>
                  <th>Variant Code</th>
                  <th>Description</th>
                  <th>Price/Unit</th>
                  <th>Unit</th>
                  <th>MOQ</th>
                  <th>Add to Cart</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{r["Variant"] || r.Variant || ""}</td>
                    <td style={{ maxWidth: 300 }}>{r["Description"] || r.Description || ""}</td>
                    <td>{r["Price/Unit"] || r.Price || ""}</td>
                    <td>{r["Unit"] || r.Unit || ""}</td>
                    <td>{r["MOQ"] || r.MOQ || ""}</td>
                    <td>
                      <button
                        className="btn"
                        onClick={() =>
                          addToCart({
                            ...r,
                            "Item Name": base["Item Name"] || base.ItemName,
                            "Item Code": base["Item Code"] || base.ItemCode
                          })
                        }
                      >
                        Add to Cart
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button className="outline" onClick={() => navigate(-1)}>
              Back
            </button>
            <button className="btn" onClick={() => navigate("/cart")}>
              Go to Cart
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
