import {MatrixClientContext} from "@/contexts/MatrixClientContext";
import {CallbackPage} from "@/pages/CallbackPage";
import {LoginPage} from "@/pages/LoginPage";
import {PasswordLoginPage} from "@/pages/PasswordLoginPage";
import {MatrixClient} from "matrix-js-sdk";
import {Route, Routes} from "react-router-dom";

export function PublicRoutes({client}: {client: MatrixClient}) {
  if (sessionStorage.getItem("token")) {
    window.location.reload();
  }
  return (
    <MatrixClientContext.Provider value={{client}}>
      <Routes>
        <Route path="/callback" Component={CallbackPage} />
        <Route path="/password" Component={PasswordLoginPage} />
        <Route path="/" Component={LoginPage} />
      </Routes>
    </MatrixClientContext.Provider>
  );
}
