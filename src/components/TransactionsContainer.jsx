import styled from "styled-components";

export default function TransactionsContainer({ transactions, balance }) {
  return (
    <TransactionsContainerSC>
      <ul>
        {transactions.map((transaction) => (
          <ListItemContainer key={transaction._id}>
            <div>
              <span>
                {new Date(transaction.date).toLocaleDateString("en-US", {
                  month: "numeric",
                  day: "numeric",
                })}
              </span>
              <strong data-test="registry-name">{transaction.description}</strong>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Value
                data-test="registry-amount"
                color={transaction.type === "income" ? "true" : "false"}
              >
                {transaction.amount.toFixed(2).replace(".", ",")}
              </Value>
            </div>
          </ListItemContainer>
        ))}
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
  background-color: #1D1C19;
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
      font-weight: 700;
      text-transform: uppercase;
    }
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
`;