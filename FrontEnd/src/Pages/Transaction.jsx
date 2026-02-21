import React, { useEffect, useState } from "react";
import axios from "axios";

function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:1010/api/transactions/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Transaction History</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Asset</th>
            <th>Grams</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr key={t._id}>
              <td>{new Date(t.createdAt).toLocaleDateString()}</td>
              <td>{t.type}</td>
              <td>{t.asset}</td>
              <td>{t.grams}</td>
              <td>₹{t.amount}</td>
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionHistory;
