import {useUser} from "@/hooks/useUser";
import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

export function CallbackPage() {
  const [searchParams] = useSearchParams();
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const loginToken = searchParams.get("loginToken") as string;
    if (user.isLoggedIn()) {
      navigate("/protected");
      return;
    }
    user.login(loginToken).then(() => {
      navigate("/protected");
      return;
    });
  }, [user, navigate, searchParams]);

  return <div>Redirecting to protected page...</div>;
}
