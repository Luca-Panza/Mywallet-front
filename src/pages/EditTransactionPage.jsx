import axios from "axios";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";

import { AppContext } from '/src/context/AppContext';

export default function EditTransactionPage() {
  const { id } = useParams();
  const { user } = useContext(AppContext);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [transactionType, setTransactionType] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.token) return navigate('/');
    fetchTransaction();
  }, []);

  useEffect(() => {
    if (transactionType) {
      fetchCategories();
    }
  }, [transactionType]);

  async function fetchTransaction() {
    try {
      const config = { headers: { Authorization: user.token } };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/transaction/${id}`, config);
      const transaction = response.data;
      
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setCategoryId(transaction.categoryId || "");
      setTransactionType(transaction.type);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load transaction details.',
        icon: 'error',
        confirmButtonText: 'Ok',
        background: '#fff',
        color: '#000',
        confirmButtonColor: '#282828'
      }).then(() => {
        navigate('/transactions');
      });
    }
  }

  async function fetchCategories() {
    try {
      const config = { headers: { Authorization: user.token } };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`, config);
      const filteredCategories = response.data.filter(cat => cat.type === transactionType);
      setCategories(filteredCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  function updateTransaction(ev) {
    ev.preventDefault();

    const config = { headers: { Authorization: user.token } };
    const reqBody = {
      description,
      amount: parseFloat(amount),
      categoryId: categoryId || null
    };

    axios
      .put(`${import.meta.env.VITE_API_URL}/transaction/${id}`, reqBody, config)
      .then(res => {
        Swal.fire({
          title: 'Transaction Updated!',
          icon: "success",
          confirmButtonText: 'Ok',
          background: '#fff',
          color: '#000',
          confirmButtonColor: '#282828',
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
          color: '#000',
          confirmButtonColor: '#282828'
        });
      });
  }

  function handleDescriptionChange(ev) {
    const words = ev.target.value.split(/\s+/);
    const areAllWordsValid = words.every(word => word.length <= 25);
    if (areAllWordsValid) {
      setDescription(ev.target.value);
    } else {
      Swal.fire({
        title: 'Word too long!',
        text: 'Each word must be 25 characters or less.',
        icon: 'warning',
        confirmButtonText: 'Ok',
        background: '#fff',
        color: '#000',
        confirmButtonColor: '#282828'
      });
    }
  }

  if (loading) {
    return (
      <TransactionsContainer>
        <h1>Loading...</h1>
      </TransactionsContainer>
    );
  }

  return (
    <TransactionsContainer>
      <h1>Edit {transactionType}</h1>

      <form onSubmit={updateTransaction}>
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

        <CategorySelect
          value={categoryId}
          onChange={(ev) => setCategoryId(ev.target.value)}
        >
          <option value="">No category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.icon} {category.name}
            </option>
          ))}
        </CategorySelect>

        <button data-test="registry-save">Update Transaction</button>
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

  input {
    background: #fff;
    color: #000;

    &:placeholder {
      color: #000;
    }
  }
`;

const CategorySelect = styled.select`
  width: 100%;
  height: 58px;
  background: white;
  border: 1px solid #d5d5d5;
  border-radius: 5px;
  padding: 0 15px;
  font-size: 20px;
  color: #000;
  cursor: pointer;
  margin-bottom: 13px;

  option {
    color: #000;
  }
`;
