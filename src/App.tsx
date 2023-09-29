import {StrictMode, useMemo, useState} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MatrixContext, MatrixContextType} from "./contexts/MatrixContext";
import {LoginPage} from "./pages/LoginPage";
import {ProtectedPage} from "./pages/ProtectedPage";
import {CallbackPage} from "./pages/CallbackPage";
import {createClient} from "matrix-js-sdk";

export function App() {
  const matrixClient = useMemo(
    () => createClient({baseUrl: "http://localhost:8008"}),
    [],
  );

  const [matrixState] = useState<MatrixContextType>({
    client: matrixClient,
  });

  return (
    <StrictMode>
      <MatrixContext.Provider value={matrixState}>
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={LoginPage} />
            <Route path="/callback" Component={CallbackPage} />
            <Route path="/protected" Component={ProtectedPage} />
          </Routes>
        </BrowserRouter>
      </MatrixContext.Provider>
    </StrictMode>
  );
}
