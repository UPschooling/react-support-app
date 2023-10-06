import {MatrixClientContext} from "@/contexts/MatrixClientContext";
import {getSsoUrl} from "@/helpers/getSsoUrl";
import {useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";

export function LoginPage() {
  const {client} = useContext(MatrixClientContext);
  const navigate = useNavigate();

  useEffect(() => {
    getSsoUrl(client).then((ssoUrl) => {
      window.location.href = ssoUrl;
    });
  }, [navigate, client]);

  return <div>Redirecting to SSO...</div>;
}
