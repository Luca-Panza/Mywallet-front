import axios from "axios";
import styled from "styled-components";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";

import { AppContext } from '/src/context/AppContext';
import CSVImportComponent from '/src/components/CSVImportComponent';

export default function TransactionsPage() {
  const { type } = useParams();
  const { user } = useContext(AppContext);
  const [amount, setAmount] = useState(undefined);
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [showImport, setShowImport] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (type !== "income" && type !== "expense") return navigate('/transactions');
    if (!user || !user.token) return navigate('/');
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const config = { headers: { Authorization: user.token } };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`, config);
      const filteredCategories = response.data.filter(cat => cat.type === type);
      setCategories(filteredCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  function createTransaction(ev) {
    ev.preventDefault();

    const config = { headers: { Authorization: user.token } };
    const reqBody = {
      description,
      amount: parseFloat(amount),
      categoryId: categoryId || null
    };

    axios
      .post(`${import.meta.env.VITE_API_URL}/new-transaction/${type}`, reqBody, config)
      .then(res => {
        Swal.fire({
          title: 'Transaction Created!',
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
      alert("Each word must be 25 characters or less.");
    }
  }

  const handleImportSuccess = () => {
    navigate('/transactions'); // Redirect to home after successful import
  };

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

        <button data-test="registry-save">Save Transaction</button>
      </form>

      <ImportToggle>
        <button
          type="button"
          onClick={() => setShowImport(!showImport)}
          className="import-toggle-btn"
        >
          {showImport ? 'Hide CSV Import' : 'Import Multiple Transactions from CSV'}
        </button>
      </ImportToggle>

      {showImport && (
        <CSVImportComponent onImportSuccess={handleImportSuccess} />
      )}
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

const ImportToggle = styled.div`
  margin-top: 20px;
  width: 100%;
  
  .import-toggle-btn {
    width: 100%;
    height: 46px;
    background: transparent;
    color: white;
    border: 2px solid #282828;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #282828;
      color: white;
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
