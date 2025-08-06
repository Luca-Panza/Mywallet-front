import axios from "axios";
import styled from "styled-components";
import Swal from "sweetalert2";
import { BiExit } from "react-icons/bi";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { FiUpload } from "react-icons/fi";
import { MdCategory } from "react-icons/md";
import { BiBarChart } from "react-icons/bi";
import { HiMenu } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";

import { AppContext } from "/src/context/AppContext";
import TransactionsContainer from "/src/components/TransactionsContainer";
import CSVImportComponent from "/src/components/CSVImportComponent";

export default function HomePage() {
  const { user } = useContext(AppContext);
  const [balance, setBalance] = useState(0.0);
  const [transactions, setTransactions] = useState([]);
  const [showImport, setShowImport] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const loadTransactions = () => {
    const config = { headers: { Authorization: user.token } };

    axios
      .get(`${import.meta.env.VITE_API_URL}/transactions`, config)
      .then((res) => {
        setTransactions(res.data);
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
      .catch((e) => {
        Swal.fire({
          title: 'Error!',
          text: e.response?.data || 'Failed to load transactions',
          icon: 'error',
          confirmButtonText: 'Ok',
          background: '#fff',
          color: '#000',
          confirmButtonColor: '#282828'
        });
      });
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImportSuccess = () => {
    loadTransactions(); // Reload transactions after successful import
    setShowImport(false); // Hide import component
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    Swal.fire({
      title: 'Logged Out',
      text: 'You have been successfully logged out.',
      icon: 'info',
      confirmButtonText: 'Ok',
      background: '#fff',
      color: '#000',
      confirmButtonColor: '#282828'
    });
  };

  return (
    <HomeContainer>
      <Header>
        <h1 data-test="user-name">Hello, {user.name}!</h1>
        <MenuContainer ref={menuRef}>
          <MenuIcon
            data-test="menu"
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <MenuDropdown>
              <MenuItem onClick={() => {
                setShowMenu(false);
                navigate("/categories");
              }}>
                <MdCategory /> Manage Categories
              </MenuItem>
              <MenuItem onClick={() => {
                setShowMenu(false);
                navigate("/category/summary");
              }}>
                <BiBarChart /> Category Summary
              </MenuItem>
              <MenuItem onClick={() => {
                setShowMenu(false);
                handleLogout();
              }}>
                <BiExit /> Logout
              </MenuItem>
            </MenuDropdown>
          )}
        </MenuContainer>
      </Header>

      <TransactionsContainer
        transactions={transactions}
        balance={balance}
        onTransactionDeleted={loadTransactions}
        showImport={showImport}
      />

      {showImport && (
        <CSVImportComponent onImportSuccess={handleImportSuccess} />
      )}

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
        <button data-test="import-csv" onClick={() => setShowImport(!showImport)}>
          <FiUpload />
          <p>
            Import
            <br />
            CSV
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

const MenuContainer = styled.div`
  position: relative;
`;

const MenuIcon = styled(HiMenu)`
  cursor: pointer;
  font-size: 28px;
  color: white;
  
  &:hover {
    opacity: 0.8;
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 200px;
  overflow: hidden;
  margin-top: 8px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  color: #333;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: #f5f5f5;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #eee;
  }

  svg {
    font-size: 18px;
  }
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
    flex: 1;
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
