import {loginWithToken} from "@/helpers/loginWithToken";
import {useSyncedClient} from "@/hooks/useSyncedClient";
import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

export function CallbackPage() {
  const [searchParams] = useSearchParams();
  const client = useSyncedClient();
  const navigate = useNavigate();

  useEffect(() => {
    const loginToken = searchParams.get("loginToken") as string;
    loginWithToken(client, loginToken).then(() => {
      navigate("/protected");
      return;
    });
  }, [navigate, searchParams, client]);

  return <div>Redirecting to protected page...</div>;
}
