import axios from "axios";
import styled from "styled-components";
import Swal from "sweetalert2";
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
        .then(res => {
            Swal.fire({
                title: 'Transaction Created!',
                icon: "success",
                confirmButtonText: 'Ok',
                background: '#fff',
                color: '#2d2d2d',
                confirmButtonColor: '#77407B',
                timer: 1500
            }).then(() => {
                navigate('/transactions');
            });
        })
        .catch(e => {
            Swal.fire({
                title: 'Error!',
                text: e.response?.data || 'An error occurred',
                icon: 'error',
                confirmButtonText: 'Ok',
                background: '#fff',
                color: '#2d2d2d',
                confirmButtonColor: '#77407B'
            });
        });
}


  function handleDescriptionChange(ev) {
    const words = ev.target.value.split(/\s+/);
    const areAllWordsValid = words.every(word => word.length <= 25);
    if (areAllWordsValid) {
      setDescription(ev.target.value);
    } else {
      alert("Each word must be 25 characters or less."); 
    }
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
          onChange={handleDescriptionChange}
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
  user-select: none;
  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
`;
