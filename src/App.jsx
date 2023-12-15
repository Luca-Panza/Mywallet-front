import { BrowserRouter, Routes, Route } from "react-router-dom"
import styled from "styled-components"
import { AppProvider } from './context/AppContext';
import HomePage from "./pages/HomePage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import TransactionsPage from "./pages/TransactionPage"

export default function App() {
  return (
    <PagesContainer>
      <BrowserRouter>
        <AppProvider>
          <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/signUp" element={<SignUpPage />} />
            <Route path="/transactions" element={<HomePage />} />
            <Route path="/new-transaction/:type" element={<TransactionsPage />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </PagesContainer>
  )
}

const PagesContainer = styled.main`
  background-color: #622c69;
  width: calc(100vw - 50px);
  max-height: 100vh;
  padding: 25px;
`
