import {MatrixContext} from "@/contexts/MatrixContext";
import {useGetSSOUrl} from "@/hooks/useGetSSOUrl";
import {useSession} from "@/hooks/useSession";
import {useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";

export function LoginPage() {
  const {client} = useContext(MatrixContext);
  const {ssoUrl} = useGetSSOUrl(client);
  const sessionService = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/protected");
    }
    sessionService.init();
    if (ssoUrl) {
      window.location.href = ssoUrl;
    }
  }, [ssoUrl, sessionService, navigate]);

  return <div>Redirecting to SSO...</div>;
}
