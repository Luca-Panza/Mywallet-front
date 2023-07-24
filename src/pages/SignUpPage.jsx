import { Link, useNavigate } from "react-router-dom"
import axios from "axios";
import styled from "styled-components"
import MyWalletLogo from "../components/MyWalletLogo"
import { useState } from "react";

export default function SignUpPage() {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");


  function confirmRegister (e) {
		e.preventDefault();
    if(password1 !== password2) return alert("Different passwords, try again!");
      
      axios.post(`${import.meta.env.VITE_API_URL}/signUp`, {name, email, password:password1})

        .then((res) => {alert(res.data); navigate("/")}) 
        .catch(e => alert(e.response.data.message));
    }

  return (
    <SingUpContainer>
      <form onSubmit={confirmRegister}>
        <MyWalletLogo />
        <input data-test="name" type="text" placeholder="Name" value={name} required onChange={e => setName(e.target.value)}></input>
        <input data-test="email" type="email" placeholder="E-mail" value={email} required onChange={e => setEmail(e.target.value)}></input>
        <input data-test="password" type="password" placeholder="Password" value={password1} minLength={3} required onChange={e => setPassword1(e.target.value)}></input>
        <input data-test="conf-password" type="password" placeholder="Confirm Password" value={password2} minLength={3} required onChange={e => setPassword2(e.target.value)}></input>
        <button data-test="sign-up-submit">Sign Up</button>
      </form>

      <Link to={'/'}>
        Already have an account? Log in!
      </Link>
    </SingUpContainer>
  )
}

const SingUpContainer = styled.section`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  button:hover {
    opacity: 0.8;
  }
`
