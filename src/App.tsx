import {BrowserRouter} from "react-router-dom";
import {ProtectedRoutes} from "./routes/ProtectedRoutes";
import {MatrixClient, createClient} from "matrix-js-sdk";
import {getConfig} from "./config/getConfig";
import {PublicRoutes} from "./routes/PublicRoutes";
import {useEffect} from "react";

export function App() {
  const token = JSON.parse(sessionStorage.getItem("token"));

  let client: MatrixClient;
  let component;
  if (token) {
    client = createClient({
      accessToken: token?.access_token,
      userId: token?.user_id,
      deviceId: token?.device_id,
      baseUrl: getConfig("synapse"),
    });
    component = (
      <BrowserRouter basename="/apps/upschoolingsupport">
        <ProtectedRoutes client={client} />
      </BrowserRouter>
    );
  } else {
    client = createClient({
      baseUrl: getConfig("synapse"),
    });
    component = (
      <BrowserRouter basename="/apps/upschoolingsupport">
        <PublicRoutes client={client} />
      </BrowserRouter>
    );
  }

  useEffect(() => () => client.stopClient(), [client]);

  return component;
}
