import axios from "axios";
import styled from "styled-components"
import Swal from 'sweetalert2';
import { Link, useNavigate } from "react-router-dom"
import { useState, useContext } from "react";

import MyWalletLogo from "../components/MyWalletLogo"
import { AppContext } from '/src/context/AppContext';


export default function SignInPage() {
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function confirmLogin(e) {
    e.preventDefault();
    setLoading(true);

    axios.post(`${import.meta.env.VITE_API_URL}/signIn`, { email, password })

      .then((res) => {
        setUser(res.data)
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/transactions")
        Swal.fire({
          title: 'Successful login!',
          icon: "success",
          confirmButtonText: 'Ok',
          background: '#fff',
          color: '#000',
          confirmButtonColor: '#282828',
          timer: 1500
        });
      })
      .catch(e => {
        Swal.fire({
          title: 'Incorrect email or password!',
          icon: "error",
          confirmButtonText: 'Ok',
          background: '#fff',
          color: '#000',
          confirmButtonColor: '#282828',
          timer: 1500
        });
        setPassword("");
      });

  }

  return (
    <SingInContainer>
      <form onSubmit={confirmLogin}>
        <MyWalletLogo />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
          data-test="email">
        </input>
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
          data-test="password">
        </input>
        <button data-test="sign-in-submit">Sign In</button>
      </form>

      <Link to={'/signUp'}>
        Don't have an account? Register!
      </Link>
    </SingInContainer>
  )
}

const SingInContainer = styled.section`
  user-select: none;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  button:hover {
    opacity: 0.8;
  }

  input {
    background-color: #FFF;
    color: #000;
  }
`;
