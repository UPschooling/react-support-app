import {StrictMode} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {LoginPage} from "./pages/LoginPage";
import {ProtectedPage} from "./pages/ProtectedPage";
import {CallbackPage} from "./pages/CallbackPage";
import {PasswordLoginPage} from "./pages/PasswordLoginPage";
import {CreateTicketPage} from "./pages/CreateTicketPage";
import {TicketDetailsPage} from "./pages/TicketDetailsPage";

export function App() {
  return (
    <StrictMode>
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
    </StrictMode>
  );
}
