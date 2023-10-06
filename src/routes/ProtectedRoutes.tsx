import {MatrixClientContext} from "@/contexts/MatrixClientContext";
import {useLoggedInClient} from "@/hooks/useLoggedInClient";
import {CreateTicketPage} from "@/pages/CreateTicketPage";
import {ProtectedPage} from "@/pages/ProtectedPage";
import {TicketDetailsPage} from "@/pages/TicketDetailsPage";
import {MatrixClient} from "matrix-js-sdk";
import {Route, Routes} from "react-router-dom";

export function ProtectedRoutes({client}: {client: MatrixClient}) {
  const context = useLoggedInClient(client);
  if (!sessionStorage.getItem("token")) {
    window.location.reload();
  }
  return (
    <MatrixClientContext.Provider value={context}>
      <Routes>
        <Route path="/*" Component={ProtectedPage} />
        <Route path="/create-ticket" Component={CreateTicketPage} />
        <Route path="/details-ticket" Component={TicketDetailsPage} />
      </Routes>
    </MatrixClientContext.Provider>
  );
}
