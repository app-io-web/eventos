import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html, body {
    -webkit-text-size-adjust: 100%;
    touch-action: manipulation;
    overflow-x: hidden;
    height: 100vh; /* 🔹 Define a altura da viewport */
    min-height: -webkit-fill-available; /* 🔹 Corrige a altura no iOS */
  }

  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

export default GlobalStyle;
