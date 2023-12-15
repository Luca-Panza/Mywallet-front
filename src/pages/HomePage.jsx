import axios from "axios";
import styled from "styled-components";
import { BiExit } from "react-icons/bi";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";

import { AppContext } from "/src/context/AppContext";
import TransactionsContainer from "/src/components/TransactionsContainer";

export default function HomePage() {
  const { user } = useContext(AppContext);
  const [balance, setBalance] = useState(0.0);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const config = { headers: { Authorization: user.token } };

    axios
      .get(`${import.meta.env.VITE_API_URL}/transactions`, config)
      .then((res) => {
        setTransactions(res.data.slice(0, 20));
        const totalBalance = res.data.reduce(
          (total, transaction) =>
            total +
            (transaction.type === "income"
              ? transaction.amount
              : -transaction.amount),
          0
        );
        setBalance(totalBalance);
      })
      .catch((e) => alert(e.response.data));
  }, []);

  return (
    <HomeContainer>
      <Header>
        <h1 data-test="user-name">Hello, {user.name}!</h1>
        <ExitIcon 
          data-test="logout"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        />
      </Header>

      <TransactionsContainer transactions={transactions} balance={balance} />

      <ButtonsContainer>
        <button data-test="new-income" onClick={() => navigate("/new-transaction/income")}>
          <AiOutlinePlusCircle />
          <p>
            New
            <br />
            Income
          </p>
        </button>
        <button data-test="new-expense" onClick={() => navigate("/new-transaction/expense")}>
          <AiOutlineMinusCircle />
          <p>
            New
            <br />
            Expense
          </p>
        </button>
      </ButtonsContainer>
    </HomeContainer>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 50px);
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 5px 2px;
  margin-bottom: 15px;
  font-size: 26px;
  color: white;
  user-select: none;
`;

const ExitIcon = styled(BiExit)`
  cursor: pointer;
`;

const ButtonsContainer = styled.section`
  margin-top: 15px;
  margin-bottom: 0;
  display: flex;
  gap: 15px;

  button {
    width: 50%;
    height: 115px;
    font-size: 22px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    user-select: none;
    p {
      font-size: 18px;
    }
    &:hover {
      opacity: 0.8;
    }
  }
`;
