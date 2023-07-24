import axios from "axios";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AppContext } from '/src/context/AppContext';

export default function TransactionsPage() {
  const { type } = useParams();
  const { user } = useContext(AppContext);
  const [amount, setAmount] = useState(undefined);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (type !== "income" && type !== "expense") return navigate('/transactions');
    if (!user || !user.token) return navigate('/');
  }, []);

  function createTransaction(ev) {
    ev.preventDefault();

    const config = { headers: { Authorization: user.token } };
    const reqBody = { description, amount: parseFloat(amount) };

    axios
      .post(`${import.meta.env.VITE_API_URL}/new-transaction/${type}`, reqBody, config)
      .then(res => navigate('/transactions'))
      .catch(e => alert(e.response.data));
  }

  return (
    <TransactionsContainer>
      <h1>{`New ${type}`}</h1>
      <form onSubmit={createTransaction}>
        <input
          placeholder="Amount"
          type="number"
          minLength={1}
          required
          onChange={(ev) => setAmount(ev.target.value)}
          value={amount}
          data-test="registry-amount-input"
        />
        <input
          placeholder="Description"
          type="text"
          required
          minLength={4}
          onChange={(ev) => setDescription(ev.target.value)}
          value={description}
          data-test="registry-name-input"
        />
        <button data-test="registry-save">Save Transaction</button>
      </form>
    </TransactionsContainer>
  );
}

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
`;
