import {StrictMode, useMemo, useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage";
import {ProtectedPage} from "./pages/ProtectedPage";
import {CallbackPage} from "./pages/CallbackPage";
import {createClient} from "matrix-js-sdk";
import {getConfig} from "./config/getConfig";
import {
  MatrixClientContext,
  MatrixClientContextType,
} from "./contexts/MatrixClientContext";
import {PasswordLoginPage} from "./pages/PasswordLoginPage";
import {CreateTicketPage} from "./pages/CreateTicketPage";
import {TicketDetailsPage} from "./pages/TicketDetailsPage";

export function App() {
  const matrixClient = useMemo(
    () => createClient({baseUrl: getConfig("synapse")}),
    [],
  );

  const [matrixState] = useState<MatrixClientContextType>({
    client: matrixClient,
  });

  return (
    <StrictMode>
      <MatrixClientContext.Provider value={matrixState}>
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={LoginPage} />
            <Route path="/callback" Component={CallbackPage} />
            <Route path="/protected" Component={ProtectedPage} />
            <Route path="/password" Component={PasswordLoginPage} />
            <Route path="/create-ticket" Component={CreateTicketPage} />
            <Route path="/details-ticket" Component={TicketDetailsPage} />
          </Routes>
        </BrowserRouter>
      </MatrixClientContext.Provider>
    </StrictMode>
  );
}
