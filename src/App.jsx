import { BrowserRouter, Routes, Route } from "react-router-dom"
import styled from "styled-components"
import { AppProvider } from './context/AppContext';
import HomePage from "./pages/HomePage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import TransactionsPage from "./pages/TransactionPage"
import EditTransactionPage from "./pages/EditTransactionPage"
import CategoriesPage from "./pages/CategoriesPage"
import CategoryFormPage from "./pages/CategoryFormPage"
import CategorySummaryPage from "./pages/CategorySummaryPage"

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
            <Route path="/edit-transaction/:id" element={<EditTransactionPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/new" element={<CategoryFormPage />} />
            <Route path="/category/edit/:id" element={<CategoryFormPage />} />
            <Route path="/category/summary" element={<CategorySummaryPage />} />
          </Routes>
        </AppProvider>
      </BrowserRouter>
    </PagesContainer>
  )
}

const PagesContainer = styled.main`
  background-color: #3C3C3C;
  width: calc(100vw - 50px);
  max-height: 100vh;
  padding: 25px;
`
