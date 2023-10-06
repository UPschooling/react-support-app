import {getSsoUrl} from "@/helpers/getSsoUrl";
import {useSyncedClient} from "@/hooks/useSyncedClient";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export function LoginPage() {
  const client = useSyncedClient();
  const navigate = useNavigate();

  if (sessionStorage.getItem("token")) {
    navigate("/protected");
  }

  useEffect(() => {
    getSsoUrl(client).then((ssoUrl) => {
      window.location.href = ssoUrl;
    });
  }, [navigate, client]);

  return <div>Redirecting to SSO...</div>;
}
