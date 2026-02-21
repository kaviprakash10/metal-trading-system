await axios.post(
  "http://localhost:1010/api/trade/buy",
  {
    metalType: "gold",
    grams: 2,
    frontendPrice: goldPrice,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

await axios.post(
  "http://localhost:1010/api/trade/sell",
  {
    metalType: "silver",
    grams: 5,
    frontendPrice: silverPrice,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
