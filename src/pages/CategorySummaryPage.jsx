import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import MyWalletLogo from "../components/MyWalletLogo";

export default function CategorySummaryPage() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    if (!user?.token) {
      navigate("/");
      return;
    }
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const config = { headers: { Authorization: user.token } };

      const [categoriesResponse, transactionsResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/categories`, config),
        axios.get(`${import.meta.env.VITE_API_URL}/transactions`, config),
      ]);

      calculateSummary(categoriesResponse.data, transactionsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  function calculateSummary(categories, transactions) {
    const categorySummary = {};
    let income = 0;
    let expense = 0;

    categories.forEach(category => {
      categorySummary[category._id] = {
        category,
        total: 0,
        count: 0,
        transactions: []
      };
    });

    categorySummary["uncategorized"] = {
      category: { name: "Uncategorized", icon: "📂", type: "Both" },
      total: 0,
      count: 0,
      transactions: []
    };

    transactions.forEach(transaction => {
      const amount = transaction.type === "income" ? transaction.amount : -transaction.amount;
      const categoryKey = transaction.categoryId || "uncategorized";

      if (categorySummary[categoryKey]) {
        categorySummary[categoryKey].total += amount;
        categorySummary[categoryKey].count += 1;
        categorySummary[categoryKey].transactions.push(transaction);
      }

      if (transaction.type === "income") {
        income += transaction.amount;
      } else {
        expense += transaction.amount;
      }
    });

    const summaryArray = Object.values(categorySummary)
      .filter(item => item.count > 0)
      .sort((a, b) => Math.abs(b.total) - Math.abs(a.total));

    setSummaryData(summaryArray);
    setTotalIncome(income);
    setTotalExpense(expense);
  }

  if (loading) {
    return (
      <SummaryContainer>
        <Header>
          <MyWalletLogo />
        </Header>
        <p>Loading...</p>
      </SummaryContainer>
    );
  }

  return (
    <SummaryContainer>
      <Header>
        <MyWalletLogo />
        <button onClick={() => navigate("/transactions")}>Back</button>
      </Header>

      <TitleContainer>
        <h2>Category Summary</h2>
        <TotalSummary>
          <TotalItem type="income">
            <span>Total Income:</span>
            <strong>R$ {totalIncome.toFixed(2)}</strong>
          </TotalItem>
          <TotalItem type="expense">
            <span>Total Expenses:</span>
            <strong>R$ {totalExpense.toFixed(2)}</strong>
          </TotalItem>
          <TotalItem type="balance">
            <span>Balance:</span>
            <strong>R$ {(totalIncome - totalExpense).toFixed(2)}</strong>
          </TotalItem>
        </TotalSummary>
      </TitleContainer>

      <SummaryGrid>
        {summaryData.length === 0 ? (
          <EmptyState>
            <p>No transactions found.</p>
          </EmptyState>
        ) : (
          summaryData.map((item, index) => (
            <CategorySummaryCard key={index}>
              <CategoryHeader>
                <CategoryIcon>{item.category.icon}</CategoryIcon>
                <CategoryDetails>
                  <CategoryName>{item.category.name}</CategoryName>
                  <CategoryType type={item.category.type}>
                    {item.category.type === "Both" ? "Mixed" :
                      item.category.type === "Entrada" ? "Income" :
                        item.category.type === "Saída" ? "Expense" : item.category.type}
                  </CategoryType>
                </CategoryDetails>
              </CategoryHeader>

              <SummaryStats>
                <StatItem>
                  <StatLabel>Total:</StatLabel>
                  <StatValue positive={item.total >= 0}>
                    R$ {Math.abs(item.total).toFixed(2)}
                  </StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>Transactions:</StatLabel>
                  <StatValue>{item.count}</StatValue>
                </StatItem>
              </SummaryStats>

              <TransactionsList>
                <h4>Recent transactions:</h4>
                {item.transactions.slice(0, 3).map(transaction => (
                  <TransactionItem key={transaction._id}>
                    <span>{transaction.description}</span>
                    <TransactionAmount positive={transaction.type === "income"}>
                      {transaction.type === "income" ? "+" : "-"}R$ {transaction.amount.toFixed(2)}
                    </TransactionAmount>
                  </TransactionItem>
                ))}
                {item.transactions.length > 3 && (
                  <MoreTransactions>+ {item.transactions.length - 3} more</MoreTransactions>
                )}
              </TransactionsList>
            </CategorySummaryCard>
          ))
        )}
      </SummaryGrid>
    </SummaryContainer>
  );
}

const SummaryContainer = styled.div`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;

  button {
    width: auto;
    padding: 0;
    background: none;
    border: none;
    color: white;
    font-size: 16px;
    cursor: pointer;
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const TitleContainer = styled.div`
  margin-bottom: 25px;

  h2 {
    color: white;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 15px;
  }
`;

const TotalSummary = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const TotalItem = styled.div`
  background: #282828;
  border: 1px solid #404040;
  padding: 15px;
  border-radius: 8px;
  min-width: 150px;

  span {
    display: block;
    font-size: 14px;
    color: #ccc;
    margin-bottom: 5px;
  }

  strong {
    font-size: 18px;
    color: ${props =>
    props.type === "income" ? "#4CAF50" :
      props.type === "expense" ? "#F44336" :
        "#fff"};
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  flex: 1;
  overflow-y: auto;
`;

const CategorySummaryCard = styled.div`
  background: #282828;
  border: 1px solid #404040;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
`;

const CategoryIcon = styled.div`
  font-size: 28px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #404040;
  border-radius: 50%;
`;

const CategoryDetails = styled.div`
  flex: 1;
`;

const CategoryName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 5px 0;
`;

const CategoryType = styled.span`
  font-size: 14px;
  color: ${props =>
    props.type === "Income" || props.type === "Entrada" ? "#4CAF50" :
      props.type === "Expense" || props.type === "Saída" ? "#F44336" :
        "#ccc"};
  font-weight: 500;
`;

const SummaryStats = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  padding: 15px;
  background: #1D1C19;
  border: 1px solid #404040;
  border-radius: 6px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #ccc;
  margin-bottom: 5px;
`;

const StatValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.positive === true ? "#4CAF50" : props.positive === false ? "#F44336" : "#fff"};
`;

const TransactionsList = styled.div`
  h4 {
    font-size: 14px;
    color: #ccc;
    margin: 0 0 10px 0;
  }
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #404040;

  span {
    font-size: 14px;
    color: #ccc;
  }
`;

const TransactionAmount = styled.span`
  font-weight: 600;
  color: ${props => props.positive ? "#4CAF50" : "#F44336"} !important;
`;

const MoreTransactions = styled.div`
  font-size: 12px;
  color: #888;
  text-align: center;
  margin-top: 10px;
  font-style: italic;
`;

const EmptyState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  p {
    color: white;
    font-size: 18px;
  }
`;
