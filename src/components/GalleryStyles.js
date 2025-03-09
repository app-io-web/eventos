import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  max-width: 440px;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 0 auto;
  font-family: "Poppins", sans-serif; /* 🔹 Fonte aplicada globalmente no Container */
`;

export const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  margin-right: 18vw;
  max-width: 400px;
  margin-bottom: 20px;
  font-family: "Poppins", sans-serif; /* 🔹 Fonte aplicada */
`;

export const UserBox = styled.div`
  width: 80%;
  height: 40px;
  background: #D9D9D9;
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: 16px;
  font-family: "Poppins", sans-serif; /* 🔹 Fonte aplicada */
  font-weight: 400;
  margin-left: 20px;
  position: relative;

  /* Border Radius para os cantos superiores e inferiores direitos */
  -webkit-border-top-right-radius: 30px;
  -webkit-border-bottom-right-radius: 30px;
  -moz-border-radius-topright: 30px;
  -moz-border-radius-bottomright: 30px;
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  margin-bottom: 10px;

  &::before {
    content: "";
    position: absolute;
    left: -20px;
    width: 20px;
    height: 100%;
    background: #D9D9D9;
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
  }
`;

export const PhotoLimitBox = styled(UserBox)`
  width: 80%;
`;

export const TableBox = styled(UserBox)`
  width: 50%;
`;

export const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px;
  width: 100%;
  max-width: 390px;
  height: auto;
  overflow-y: auto;
  padding: 15px;
  background: white;
  border-radius: 10px;
  justify-content: center;
  font-family: "Poppins", sans-serif; /* 🔹 Fonte aplicada */
`;

export const MediaItem = styled.div`
  width: 100px;
  height: 100px;
  background: #D9D9D9;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid #000;
  font-family: "Poppins", sans-serif; /* 🔹 Fonte aplicada */
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const SelectButton = styled.button`
  width: 150px;
  height: 40px;
  background: #8c52ff;
  border-radius: 8px;
  border: 2px solid black;
  font-size: 13px;
  font-family: "Poppins", sans-serif; /* 🔹 Fonte aplicada */
  font-weight: 400;
  color: black;
  cursor: pointer;
  margin-left: 44vw;
  display: block;
  margin-bottom: 5px;
  text-align: center;
  transition: all 0.2s ease-in-out;

  &:hover {
    background:rgb(102, 61, 184);
  }
`;

export const BackButton = styled.button`
width: 80%;
    height: 45px;
    background: #8c52ff;
    border-radius: 10px;
    border: 2px solid black;
    font-size: 18px;
    font-family: "Poppins", sans-serif;
    font-weight: 400;
    color: white;
    cursor: pointer;
    margin-top: 23vh;
    position: relative;
    right: 2vh;
    transition: all 0.2sease-in-out;
  &:hover {
    background:rgb(78, 43, 150);
  }
`;
export const SelectedMediaItem = styled(MediaItem)`
  border: 3px solid #8c52ff; /* 🔥 Borda verde para indicar seleção */
`;
