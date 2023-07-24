import styled from "styled-components"
import wallet from "/src/assets/wallet.png"

export default function MyWalletLogo() {
    return (
        <LogoContainer>
        <h1>MyWallet</h1>
        <img src = {wallet} alt="Wallet Logo"></img>
        </LogoContainer>
    )
}

const LogoContainer = styled.header`
    display:flex;
    h1{
        font-family: 'Saira Stencil One', cursive;
        font-weight: 400;
        font-size: 32px;
    }
    img{
        width: 40px;
        margin-left:5%;
    }
`
