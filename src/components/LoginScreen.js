import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Title, Background, TopLogo, ProfileContainer, ProfileImage1, InputContainer, InputWrapper, Input, Button } from './LoginStyles.js';
import { FaUser } from 'react-icons/fa';

const LoginScreen = () => {
  const { tableCode } = useParams();
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);

  const mesaNumber = tableCode ? tableCode.split('-').pop() : '';

  useEffect(() => {
    if (!tableCode) {
      alert('Código da mesa inválido!');
      navigate('/');
    }
  }, [tableCode, navigate]);

  const handleEnter = () => {
    if (username.trim() === '') {
      alert('Por favor, insira seu nome antes de continuar.');
      return;
    }
    navigate(`/${tableCode}/home?username=${encodeURIComponent(username)}`);
  };

  useEffect(() => {
    const handleResize = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
  
    window.addEventListener("resize", handleResize);
    handleResize(); // 🔹 Chama a função imediatamente para ajustar a altura inicial
  
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  return (
    <Container>
      <Title>Evento - Mesa {mesaNumber}</Title>
      <Background />
      <TopLogo src={require("../assets/empresaName.png")} alt="Empresa Logo" />
      <ProfileContainer $isKeyboardOpen={isKeyboardOpen}>
        <ProfileImage1 src={require("../assets/cloudParty.png")} alt="Upload" />
      </ProfileContainer>


      <InputContainer>
        <InputWrapper>
          <FaUser className="icon" />
          <Input
            type="text"
            placeholder="Seu Nome"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </InputWrapper>
      </InputContainer>

      <Button onClick={handleEnter}>Entrar</Button>
    </Container>
  );
};

export default LoginScreen;
