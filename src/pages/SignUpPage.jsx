import axios from "axios";
import styled from "styled-components"
import Swal from "sweetalert2";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"

import MyWalletLogo from "../components/MyWalletLogo"

export default function SignUpPage() {

  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");


  function confirmRegister(e) {
    e.preventDefault();
    if (password !== passwordConfirmation)
      return Swal.fire({
        title: 'Error!',
        text: 'Different passwords, try again!',
        icon: 'error',
        confirmButtonText: 'Ok',
        background: '#fff',
        color: '#000',
        confirmButtonColor: '#282828',
        timer: 1500
      });

    axios.post(`${import.meta.env.VITE_API_URL}/signUp`, { name, email, password: password })

      .then((res) => {
        Swal.fire({
          title: 'Account Created!',
          icon: "success",
          confirmButtonText: 'Ok',
          background: '#fff',
          color: '#000',
          confirmButtonColor: '#282828',
          timer: 1500
        });
        navigate("/")
      })
      .catch(e =>
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          confirmButtonText: 'Ok',
          background: '#fff',
          color: '#000',
          confirmButtonColor: '#282828',
          timer: 1500
        }));
  }

  return (
    <SingUpContainer>
      <form onSubmit={confirmRegister}>
        <MyWalletLogo />
        <input data-test="name" type="text" placeholder="Name" value={name} required onChange={e => setName(e.target.value)}></input>
        <input data-test="email" type="email" placeholder="E-mail" value={email} required onChange={e => setEmail(e.target.value)}></input>
        <input data-test="password" type="password" placeholder="Password" value={password} minLength={3} required onChange={e => setPassword(e.target.value)}></input>
        <input data-test="conf-password" type="password" placeholder="Confirm Password" value={passwordConfirmation} minLength={3} required onChange={e => setPasswordConfirmation(e.target.value)}></input>
        <button data-test="sign-up-submit">Sign Up</button>
      </form>

      <Link to={'/'}>
        Already have an account? Log in!
      </Link>
    </SingUpContainer>
  )
}

const SingUpContainer = styled.section`
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
`
