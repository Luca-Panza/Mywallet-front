import axios from "axios";
import styled from "styled-components";
import { BiExit } from "react-icons/bi";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AppContext } from "/src/context/AppContext";

export default function HomePage() {
  const { user } = useContext(AppContext);
  const [balance, setBalance] = useState(0.0);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const config = { headers: { token: user.token } };

    axios
      .get(`${import.meta.env.VITE_API_URL}/transactions`, config)
      .then((res) => {
        setTransactions(res.data);
        const totalBalance = res.data.reduce(
          (total, transaction) =>
            total +
            (transaction.type === "entrada"
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
        <h1 data-test="user-name">Olá, {user.name}</h1>
        <BiExit 
          data-test="logout"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        />
      </Header>

      <TransactionsContainer>
        <ul>
          {transactions.map((transaction) => (
            <ListItemContainer key={transaction._id}>
              <div>
                <span>{transaction.date}</span>
                <strong data-test="registry-name">{transaction.description}</strong>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Value data-test="registry-amount" color={transaction.type === "entrada" ? "true" : "false"}>
                  {String(transaction.amount).replace(".", ",")}
                </Value>
              </div>
            </ListItemContainer>
          ))}
        </ul>

        <article>
          <strong>Saldo</strong>
          <Value data-test="total-amount" color={balance >= 0 ? "true" : "false"}>{balance.toFixed(2)}</Value>
        </article>
      </TransactionsContainer>

      <ButtonsContainer>
        <button data-test="new-income" onClick={() => navigate("/new-transaction/entrada")}>
          <AiOutlinePlusCircle />
          <p>
            Nova
            <br />
            entrada
          </p>
        </button>
        <button data-test="new-expense" onClick={() => navigate("/new-transaction/saida")}>
          <AiOutlineMinusCircle />
          <p>
            Nova
            <br />
            saída
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
`;
const TransactionsContainer = styled.article`
  flex-grow: 1;
  background-color: #fff;
  color: #000;
  border-radius: 5px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  article {
    display: flex;
    justify-content: space-between;
    strong {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
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
    p {
      font-size: 18px;
    }
  }
`;
const Value = styled.div`
  font-size: 16px;
  text-align: right;
  color: ${(props) => (props.color === "true" ? "green" : "red")};
`;
const ListItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #000000;
  margin-right: 10px;
  div span {
    color: #c6c6c6;
    margin-right: 10px;
  }
`;
