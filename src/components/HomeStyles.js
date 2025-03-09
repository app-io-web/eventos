import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: white;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const UploadBox = styled.div`
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed black;
  border-radius: 15px;
  cursor: pointer;
  position: relative;
`;

/* ✅ 🔥 Corrigindo a ausência do `Background` 🔥 ✅ */
export const Background = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: white;
  border-radius: 15px;
  border: 2px solid black;
`;

export const UploadImage = styled.img`
  width: 100px;
  height: 100px;
  position: relative; /* 🔥 Garante que não fique atrás do Background */
  z-index: 2; /* 🔥 Coloca a imagem na frente */
`;


export const HiddenInput = styled.input`
  display: none;
`;

export const ButtonProcess = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  color: white;
  background-color: #8c52ff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  border: 3px solid black;
`;

export const ButtonGallery = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 18px;
  color: white;
  background-color:rgb(174, 0, 255);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  border: 3px solid black;
`;

/* ✅ 🔥 Corrigindo `FileList` e `FileItem` 🔥 ✅ */
export const FileList = styled.ul`
  margin-top: 15px;
  list-style: none;
  padding: 0;
  width: 100%;
  text-align: center;
`;

export const FileItem = styled.li`
  font-size: 16px;
  font-weight: bold;
  color: black;
  margin-bottom: 5px;
  background: #f1f1f1;
  padding: 5px;
  border-radius: 8px;
  border: 1px solid black;
  display: inline-block;
  width: 90%;
`;