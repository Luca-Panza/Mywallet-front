import styled, { keyframes } from "styled-components";
import 'animate.css';

import wallet from "/src/assets/wallet.png";

export default function MyWalletLogo() {
  return (
    <LogoContainer>
      <h1>MyWallet</h1>
      <img src={wallet} alt="Wallet Logo" />
    </LogoContainer>
  );
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const LogoContainer = styled.header`
  display: flex;
  user-select: none;
  animation: ${fadeIn} 1s ease-out;
  h1 {
    font-family: 'Saira Stencil One', cursive;
    font-weight: 400;
    font-size: 32px;
  }
  img {
    width: 40px;
    margin-left: 5%;
  }
`;
