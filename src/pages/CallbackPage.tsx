import {MatrixContext} from "@/contexts/MatrixContext";
import {useSession} from "@/hooks/useSession";
import {useContext, useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

export function CallbackPage() {
  const [searchParams] = useSearchParams();
  const sessionService = useSession();
  const {client} = useContext(MatrixContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loginToken = searchParams.get("loginToken") as string;
    client
      .login("m.login.token", {
        type: "m.login.token",
        token: loginToken,
        txn_id: sessionService.getItem("nonce"),
        session: sessionService.getItem("sessionId"),
      })
      .then((response) => {
        sessionService.setItem("token", response);
        navigate("/protected");
      });
  }, [client, navigate, searchParams, sessionService]);

  return <div>Redirecting to protected page...</div>;
}
