import styled from "styled-components";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { IoClose } from "react-icons/io5";
import { AppContext } from "../context/AppContext";
import dayjs from "dayjs";

export default function TransactionsContainer({ transactions, balance, onTransactionDeleted, showImport }) {
  const { user } = useContext(AppContext);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.token) {
      fetchCategories();
    }
  }, [user]);

  async function fetchCategories() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
        headers: {
          Authorization: user.token
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  function getCategoryById(categoryId) {
    return categories.find(cat => cat._id === categoryId);
  }

  const handleDeleteTransaction = async (transactionId) => {
    const result = await Swal.fire({
      title: 'Delete Transaction?',
      text: 'Are you sure you want to delete this transaction? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#fff',
      color: '#000'
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/transaction/${transactionId}`, {
          method: 'DELETE',
          headers: {
            Authorization: user.token
          },
        });

        if (response.ok) {
          Swal.fire({
            title: 'Deleted!',
            text: 'Transaction has been deleted successfully.',
            icon: 'success',
            confirmButtonText: 'Ok',
            background: '#fff',
            color: '#000',
            confirmButtonColor: '#282828',
            timer: 1500
          });
          if (onTransactionDeleted) {
            onTransactionDeleted();
          }
        } else {
          throw new Error('Failed to delete transaction');
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to delete transaction. Please try again.',
          icon: 'error',
          confirmButtonText: 'Ok',
          background: '#fff',
          color: '#000',
          confirmButtonColor: '#282828'
        });
      }
    }
  };

  const handleEditTransaction = (transactionId) => {
    navigate(`/edit-transaction/${transactionId}`);
  };

  return (
    <TransactionsContainerSC showImport={showImport} >
      <ul>
        {transactions.map((transaction) => {
          const category = getCategoryById(transaction.categoryId);
          return (
            <ListItemContainer key={transaction._id}>
              <div>
                <span>
                  {dayjs(transaction.date).format("DD/MM/YYYY")}
                </span>
                <TransactionInfo>
                  <TransactionDescription
                    data-test="registry-name"
                    onClick={() => handleEditTransaction(transaction._id)}
                    title="Click to edit transaction"
                  >
                    {transaction.description}
                  </TransactionDescription>
                  {category && (
                    <CategoryInfo>
                      <CategoryName>{category.name}</CategoryName>
                      <CategoryIcon>{category.icon}</CategoryIcon>
                    </CategoryInfo>
                  )}
                </TransactionInfo>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Value
                  data-test="registry-amount"
                  color={transaction.type === "income" ? "true" : "false"}
                >
                  {transaction.amount.toFixed(2).replace(".", ",")}
                </Value>
                <DeleteButton
                  onClick={() => handleDeleteTransaction(transaction._id)}
                  title="Delete transaction"
                >
                  <IoClose />
                </DeleteButton>
              </div>
            </ListItemContainer>
          );
        })}
      </ul>

      <article>
        <strong>Balance</strong>
        <Value
          data-test="total-amount"
          color={balance >= 0 ? "true" : "false"}
        >
          {balance.toFixed(2).replace(".", ",")}
        </Value>
      </article>
    </TransactionsContainerSC>
  );
}

const TransactionsContainerSC = styled.article`
  flex-grow: 1;
  background-color: #FFF;
  color: #fff;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  article {
    display: flex;
    justify-content: space-between;
    user-select: none;
    strong {
      font-size: 13px;
      color: #000;
      font-weight: 700;
      text-transform: uppercase;
    }
  }

  ul {
    overflow-y: auto;
    max-height: ${(props) => (props.showImport ? "calc(100vh - 600px)" : "calc(100vh - 300px)")};
    overflow-x: hidden;
  }
`;


const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "true" ? "#05720B" : "#8E2F21")};
`;

const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #fff;
  margin-right: 10px;
  user-select: none;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }

  div {
    display: flex;
  }
`;

const TransactionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
`;

const CategoryIcon = styled.span`
  font-size: 12px;
`;

const CategoryName = styled.span`
  font-size: 12px;
  color: #a0a0a0 !important;
  margin: 0 !important;
`;

const TransactionDescription = styled.strong`
  cursor: pointer;
  transition: color 0.2s ease;
  color: #000;
  
  &:hover {
    color: #4CAF50;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s ease;
  font-size: 18px;
  
  &:hover {
    background-color: #ff6b6b;
    color: white;
    transform: scale(1.1);
  }
`;