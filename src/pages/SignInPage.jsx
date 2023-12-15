import axios from "axios";
import styled from "styled-components"
import { Link, useNavigate} from "react-router-dom"
import { useState, useContext } from "react";
import { ThreeDots } from 'react-loader-spinner';

import MyWalletLogo from "../components/MyWalletLogo"
import { AppContext } from '/src/context/AppContext';


export default function SignInPage() {
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState( false );

  function confirmLogin (e) {
		e.preventDefault();
    setLoading( true );

    axios.post(`${import.meta.env.VITE_API_URL}/signIn`, {email, password})

        .then((res) => {
          setUser(res.data)
          localStorage.removeItem("user");
          localStorage.setItem("user", JSON.stringify(res.data));
          navigate("/transactions")
          }) 
        .catch(e => alert(e.response.data.message));

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
`;
