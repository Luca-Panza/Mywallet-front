import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Swal from 'sweetalert2';
import { AppContext } from "../context/AppContext";
import MyWalletLogo from "../components/MyWalletLogo";

const commonIcons = [
    "🍔", "🍕", "☕", "🛒", "🏠", "🚗", "⛽", "🎬", "🎮", "📱",
    "👕", "💊", "🏥", "🎓", "📚", "✈️", "🏖️", "💸", "💰", "📊",
    "🎯", "🏃", "💪", "🍎", "🎨", "🔧", "💡", "🎵", "📺", "🛍️"
];

export default function CategoryFormPage() {
    const { user } = useContext(AppContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [form, setForm] = useState({
        name: "",
        type: "income",
        icon: "",
        description: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user?.token) {
            navigate("/");
            return;
        }

        if (isEditing) {
            fetchCategory();
        }
    }, []);

    async function fetchCategory() {
        try {
            setLoading(true);
            const config = { headers: { Authorization: user.token } };
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`, config);

            const category = response.data.find(cat => cat._id === id);
            if (category) {
                setForm({
                    name: category.name,
                    type: category.type,
                    icon: category.icon,
                    description: category.description || ""
                });
            } else {
                navigate("/categories");
            }
        } catch (error) {
            console.error("Error fetching category:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.name.trim()) {
            Swal.fire({
                title: 'Validation Error',
                text: 'Category name is required',
                icon: 'warning',
                confirmButtonText: 'Ok',
                background: '#fff',
                color: '#000',
                confirmButtonColor: '#282828'
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: user.token,
                },
            };

            if (isEditing) {
                await axios.put(`${import.meta.env.VITE_API_URL}/categories/${id}`, form, config);
                Swal.fire({
                    title: 'Success!',
                    text: 'Category updated successfully!',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    background: '#fff',
                    color: '#000',
                    confirmButtonColor: '#282828',
                    timer: 1500
                });
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/categories`, form, config);
                Swal.fire({
                    title: 'Success!',
                    text: 'Category created successfully!',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    background: '#fff',
                    color: '#000',
                    confirmButtonColor: '#282828',
                    timer: 1500
                });
            }

            navigate("/categories");
        } catch (error) {
            console.error("Error saving category:", error);
            Swal.fire({
                title: 'Error!',
                text: error.response?.data || 'Error saving category',
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

    function handleInputChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    }

    if (loading) {
        return (
            <CategoryFormContainer>
                <Header>
                    <MyWalletLogo />
                </Header>
                <p>Loading...</p>
            </CategoryFormContainer>
        );
    }

    return (
        <CategoryFormContainer>
            <Header>
                <MyWalletLogo />
                <button onClick={() => navigate("/categories")}>Back</button>
            </Header>

            <FormContainer>
                <h2>{isEditing ? "Edit Category" : "New Category"}</h2>

                <Form onSubmit={handleSubmit}>
                    <Input
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleInputChange}
                        disabled={loading}
                        maxLength={50}
                        required
                    />

                    <Input
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleInputChange}
                        disabled={loading}
                        maxLength={100}
                        required={false}
                    />

                    <IconSection>
                        <IconLabel>Icon:</IconLabel>
                        <IconSelect
                            value={form.icon}
                            onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))}
                            disabled={loading}
                        >
                            {commonIcons.map((icon) => (
                                <option key={icon} value={icon}>
                                    {icon}
                                </option>
                            ))}
                        </IconSelect>
                    </IconSection>

                    <Select
                        name="type"
                        value={form.type}
                        onChange={handleInputChange}
                        disabled={loading}
                    >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </Select>

                    <ButtonsContainer>
                        <SubmitButton type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                        </SubmitButton>
                    </ButtonsContainer>
                </Form>
            </FormContainer>
        </CategoryFormContainer>
    );
}

const CategoryFormContainer = styled.div`
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

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    color: white;
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 25px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 500px;
`;

const Input = styled.input`
  height: 58px;
  background: white;
  border: 1px solid #d5d5d5;
  border-radius: 5px;
  padding: 0 15px;
  font-size: 20px;
  color: #000;

  &::placeholder {
    color: #000;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 58px;
  background: white;
  border: 1px solid #d5d5d5;
  border-radius: 5px;
  padding: 0 15px;
  font-size: 20px;
  color: #000;
  cursor: pointer;

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const IconSection = styled.div`
    background: white;
    border-radius: 5px;
    padding: 20px;
    display: flex;
    align-items: center;
    width: 88%;
    justify-content: space-between;
`;

const IconLabel = styled.label`
  display: block;
  font-size: 20px;
  color: #000;
  margin-right: 10px;
`;

const IconSelect = styled.select`
  width: 30%;
  height: 58px;
  background: white;
  border: 1px solid #d5d5d5;
  border-radius: 5px;
  padding: 0 15px;
  font-size: 20px;
  color: #000;
  cursor: pointer;

  option {
    font-size: 18px;
    padding: 10px;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const ButtonsContainer = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 46px;
  background: #282828;
  border: none;
  border-radius: 5px;
  color: white;
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
