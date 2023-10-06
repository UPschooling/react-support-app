import {BrowserRouter} from "react-router-dom";
import {ProtectedRoutes} from "./routes/ProtectedRoutes";
import {createClient} from "matrix-js-sdk";
import {getConfig} from "./config/getConfig";
import {PublicRoutes} from "./routes/PublicRoutes";

export function App() {
  const token = JSON.parse(sessionStorage.getItem("token"));

  if (token) {
    const client = createClient({
      accessToken: token?.access_token,
      userId: token?.user_id,
      deviceId: token?.device_id,
      baseUrl: getConfig("synapse"),
    });
    return (
      <BrowserRouter>
        <ProtectedRoutes client={client} />
      </BrowserRouter>
    );
  } else {
    const client = createClient({
      baseUrl: getConfig("synapse"),
    });
    return (
      <BrowserRouter>
        <PublicRoutes client={client} />
      </BrowserRouter>
    );
  }
}
