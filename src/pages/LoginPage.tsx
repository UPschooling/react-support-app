import {useUser} from "@/hooks/useUser";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

export function LoginPage() {
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isLoggedIn()) {
      navigate("/protected");
      return;
    }
    user.getSsoUrl().then((ssoUrl) => {
      window.location.href = ssoUrl;
    });
  }, [navigate, user]);

  return <div>Redirecting to SSO...</div>;
}
