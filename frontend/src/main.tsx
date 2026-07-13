import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ApolloProvider } from "@apollo/client/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { apollo } from "./apollo";
import "./index.css";
import { AuthProvider } from "./lib/auth";
import { ConfiguracionProvider } from "./lib/configuracion";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={apollo}>
      <BrowserRouter>
        <AuthProvider>
          <ConfiguracionProvider>
            <App />
          </ConfiguracionProvider>
        </AuthProvider>
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
);
