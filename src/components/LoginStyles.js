import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: url('https://blog.sympla.com.br/wp-content/uploads/2022/08/espaco-para-festa-1-scaled.jpg') no-repeat center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;


export const TopLogo = styled.img`
    width: 120px;
    height: auto;
    position: absolute;
    top: -4vh;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
`;

export const Title = styled.h1`
  position: absolute;
  top: 120px;
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.7); /* 🔹 Fundo preto semi-transparente */
  padding: 10px 20px;
  border-radius: 10px; /* 🔹 Borda arredondada */
    z-index: 3; /* 🔹 Mantém o título visível */
`;

export const Background = styled.div`
  width: 329px;
  height: 412px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(2px);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 1.25);
  border-radius: 28px;
  position: absolute;
  top: 200px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  overflow: hidden;
  z-index: 1; /* 🔹 Mantém o fundo atrás da logo */

  /* 🔥 Efeito de brilho */
  &::after {
    content: "";
    position: absolute;
    top: -100%;
    left: -100%;
    width: 200%;
    height: 200%;
    background: linear-gradient(120deg, rgba(255, 255, 255, 0.15) 20%, rgba(255, 255, 255, 0.6) 50%, rgba(255, 255, 255, 0.15) 60%);
    transform: rotate(30deg);
    animation: shine 3s infinite linear;
  }

  @keyframes shine {
    0% {
      top: -100%;
      left: -100%;
    }
    100% {
      top: 100%;
      left: 100%;
    }
  }
`;

export const ProfileContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    height: 100%;
    width: 100%;
    gap: 20px;
    bottom:8vh;
    transition: justify-content 0.3sease-in-out;
`;

export const ProfileImage1 = styled.img`
  width: 170px;
  height: 170px;
  border-radius: 22px;
  z-index: 3; /* 🔹 Mantém a logo sempre visível */
  transition: all 0.3s ease-in-out;
`;



export const InputContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: absolute;
  top: 450px;
  z-index: 3; /* 🔹 Mantém o campo de input visível */
`;

export const InputWrapper = styled.div`
  width: 282px;
  height: 45px;
  background: #F6F4F4;
  border-radius: 11px;
  border: 4px solid black;
  display: flex;
  align-items: center;
  padding: 0 10px;
  z-index: 3;

  .icon {
    font-size: 18px;
    color: black;
    margin-right: 8px;
  }
`;

export const Input = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 16px; /* 🔹 Evita zoom automático */
  font-family: 'Poppins', sans-serif;
  font-weight: 400;
  color: black;
  touch-action: manipulation; /* 🔹 Evita gestos indesejados */
  -webkit-user-select: none; /* 🔹 Evita seleção acidental */
  user-select: none;
`;



export const Button = styled.button`
  width: 180px;
  height: 45px;
  background: #8c52ff;
  border-radius: 11px;
  border: 4px solid black;
  color: black;
  font-size: 22px;
  font-weight: 600;
  cursor: pointer;
  position: absolute;
  top: 530px;
  text-align: center;
  transition: all 0.2s ease-in-out;
  z-index: 3;

  &:hover {
    background: rgb(69, 4, 122);
  }
`;
