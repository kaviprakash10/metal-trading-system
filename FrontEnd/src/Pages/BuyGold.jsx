import { useState, useEffect } from "react";

export default function BuyGold({ token }) {

  const [grams, setGrams] = useState(1);
  const [price, setPrice] = useState(0);

  // Fetch price from backend
  useEffect(() => {
    fetch("/api/assets/gold/price")
      .then(res => res.json())
      .then(data => setPrice(data.pricePerGram));
  }, []);

  const handleBuy = async () => {

    const res = await fetch("/api/assets/gold/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        grams,
        pricePerGram: price, // send frontend price
      }),
    });

    const data = await res.json();

    alert(data.message);
  };

  return (
    <div>
      <h2>Buy Gold</h2>

      <p>Price: ₹{price} / gram</p>

      <input
        type="number"
        min="0.1"
        step="0.1"
        value={grams}
        onChange={(e) => setGrams(Number(e.target.value))}
      />

      <p>Total: ₹{grams * price}</p>

      <button onClick={handleBuy}>
        Buy Gold
      </button>
    </div>
  );
}

