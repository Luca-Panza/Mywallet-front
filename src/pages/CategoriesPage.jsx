import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Swal from 'sweetalert2';
import { AppContext } from "../context/AppContext";
import MyWalletLogo from "../components/MyWalletLogo";

export default function CategoriesPage() {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.token) {
            navigate("/");
            return;
        }
        fetchCategories();
    }, []);

    async function fetchCategories() {
        try {
            const config = { headers: { Authorization: user.token } };
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`, config);
            setCategories(response.data);
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem("user");
                navigate("/");
                return;
            }
            console.error("Error fetching categories:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Error fetching categories',
                icon: 'error',
                confirmButtonText: 'Ok',
                background: '#fff',
                color: '#000',
                confirmButtonColor: '#282828'
            });
        } finally {
            setLoading(false);
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async function deleteCategory(id) {
        const result = await Swal.fire({
            title: 'Delete Category?',
            text: 'Are you sure you want to delete this category? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            background: '#fff',
            color: '#000'
        });

        if (!result.isConfirmed) return;

        try {
            const config = { headers: { Authorization: user.token } };
            await axios.delete(`${import.meta.env.VITE_API_URL}/categories/${id}`, config);
            Swal.fire({
                title: 'Deleted!',
                text: 'Category deleted successfully!',
                icon: 'success',
                confirmButtonText: 'Ok',
                background: '#fff',
                color: '#000',
                confirmButtonColor: '#282828',
                timer: 1500
            });
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data || 'Error deleting category',
                icon: 'error',
                confirmButtonText: 'Ok',
                background: '#fff',
                color: '#000',
                confirmButtonColor: '#282828'
            });
        }
    }

    if (loading) {
        return (
            <CategoriesContainer>
                <Header>
                    <MyWalletLogo />
                </Header>
                <p>Loading...</p>
            </CategoriesContainer>
        );
    }

    return (
        <CategoriesContainer>
            <Header>
                <MyWalletLogo />
                <button onClick={() => navigate("/transactions")}>Back</button>
            </Header>

            <ActionsContainer>
                <h2>Manage Categories</h2>
                <ActionsButtons>
                    <button onClick={() => navigate("/category/summary")}>
                        📊 View Summary
                    </button>
                    <button onClick={() => navigate("/category/new")}>
                        + New Category
                    </button>
                </ActionsButtons>
            </ActionsContainer>

            <CategoriesGrid>
                {categories.length === 0 ? (
                    <EmptyState>
                        <p>No categories created yet.</p>
                        <button onClick={() => navigate("/category/new")}>
                            Create first category
                        </button>
                    </EmptyState>
                ) : (
                    categories.map((category) => (
                        <CategoryCard key={category._id}>
                            <CategoryIcon>{category.icon}</CategoryIcon>
                            <CategoryInfo>
                                <CategoryName>{category.name}</CategoryName>
                                <CategoryType type={category.type}>
                                    {capitalizeFirstLetter(category.type)}
                                </CategoryType>
                            </CategoryInfo>
                            <CategoryActions>
                                <EditButton onClick={() => navigate(`/category/edit/${category._id}`)}>
                                    ✏️
                                </EditButton>
                                <DeleteButton onClick={() => deleteCategory(category._id)}>
                                    🗑️
                                </DeleteButton>
                            </CategoryActions>
                        </CategoryCard>
                    ))
                )}
            </CategoriesGrid>
        </CategoriesContainer>
    );
}

const CategoriesContainer = styled.div`
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

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  width: 100%;

  h2 {
    color: white;
    font-size: 24px;
    font-weight: 700;
  }
`;

const ActionsButtons = styled.div`
  display: flex;
  flex-direction: column;

  button {
    height: 46px;
    background: #282828;
    border: 1px solid #404040;
    border-radius: 5px;
    color: white;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    padding: 0 20px;
    margin: 5px 0;

    &:hover {
      background: #404040;
    }

    &:first-child {
      background: #313131ff;
      
      &:hover {
        background: #505050;
      }
    }
  }
`;

const CategoriesGrid = styled.div`
  display: flex;
  overflow-y: auto;
  flex-direction: column;
`;

const CategoryCard = styled.div`
  background: #282828;
  border-radius: 5px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  border: 1px solid #404040;
`;

const CategoryIcon = styled.div`
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #404040;
  border-radius: 50%;
`;

const CategoryInfo = styled.div`
  flex: 1;
`;

const CategoryName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #000;
  margin: 0 0 5px 0;
`;

const CategoryType = styled.span`
  font-size: 14px;
  color: ${props => props.type === "income" ? "#4CAF50" : "#F44336"};
  font-weight: 500;
`;

const CategoryActions = styled.div`
  display: flex;
  gap: 10px;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
  border-radius: 3px;
  width: auto;

  &:hover {
    background: #f0f0f0;
  }
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 5px;
  border-radius: 3px;
  width: auto;

  &:hover {
    background: #ffebee;
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  text-align: center;

  p {
    color: white;
    font-size: 18px;
    margin-bottom: 20px;
  }

  button {
    width: 200px;
    background: #282828;
    border: 1px solid #404040;
    border-radius: 5px;
    color: white;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;

    &:hover {
      background: #404040;
    }
  }
`;
