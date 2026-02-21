import { useState, useEffect } from "react";

export default function BuySilver({ token }) {

  const [grams, setGrams] = useState(10);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    fetch("/api/assets/silver/price")
      .then(res => res.json())
      .then(data => setPrice(data.pricePerGram));
  }, []);

  const handleBuy = async () => {

    const res = await fetch("/api/assets/silver/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        grams,
        pricePerGram: price,
      }),
    });

    const data = await res.json();

    alert(data.message);
  };

  return (
    <div>
      <h2>Buy Silver</h2>

      <p>Price: ₹{price} / gram</p>

      <input
        type="number"
        value={grams}
        onChange={(e) => setGrams(Number(e.target.value))}
      />

      <p>Total: ₹{grams * price}</p>

      <button onClick={handleBuy}>
        Buy Silver
      </button>
    </div>
  );
}

