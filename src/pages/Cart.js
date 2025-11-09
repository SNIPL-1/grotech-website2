import React, { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";

export default function Cart() {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("grotech_cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("grotech_cart", JSON.stringify(cart));
  }, [cart]);

  function removeItem(index) {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  }

  function updateQty(index) {
    const input = prompt("Enter new quantity:");
    const qty = parseInt(input, 10);
    if (!qty || qty <= 0) return alert("Invalid quantity");
    const newCart = [...cart];
    newCart[index].qty = qty;
    setCart(newCart);
  }

  function downloadPdf() {
    // Minimal client-side PDF using jsPDF if available
    if (!cart.length) return alert("Cart empty");
    try {
      // require dynamic import to avoid bundling errors if jsPDF absent
      import("jspdf").then(({ jsPDF }) => {
        const doc = new jsPDF();
        doc.setFontSize(14);
        doc.text("GROTECH — Cart Quote", 14, 18);
        doc.setFontSize(10);
        let y = 28;
        cart.forEach((c, i) => {
          doc.text(`${i + 1}. ${c.itemName} (${c.variant}) — ${c.qty} x ${c.price}`, 14, y);
          y += 8;
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
        });
        doc.save("GROTECH_cart_quote.pdf");
      });
    } catch (e) {
      alert("PDF generation failed (jsPDF missing).");
    }
  }

  return (
    <PageWrapper>
      <h2>Cart</h2>

      {cart.length === 0 ? (
        <div className="card muted">Your cart is empty.</div>
      ) : (
        <div className="card">
          <table className="cart-table">
            <thead>
              <tr>
                <th style={{ width: 100 }}>Image</th>
                <th>Item Name</th>
                <th>Variant Code</th>
                <th>Description</th>
                <th style={{ width: 80 }}>Quantity</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((c, i) => (
                <tr key={i}>
                  <td>
                    {c.image ? (
                      <img src={c.image} alt={c.itemName} className="cart-img" onError={(e)=>e.target.style.display='none'} />
                    ) : (
                      <div className="no-img">No image</div>
                    )}
                  </td>
                  <td>{c.itemName}</td>
                  <td>{c.variant}</td>
                  <td className="small">{c.description}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span>{c.qty}</span>
                      <button className="outline tiny" onClick={() => updateQty(i)}>Edit</button>
                    </div>
                  </td>
                  <td>
                    <button className="outline" onClick={() => removeItem(i)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn" onClick={downloadPdf}>Download as PDF</button>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
