import {MatrixClientContext} from "@/contexts/MatrixClientContext";
import {useContext, useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

export function CallbackPage() {
  const [searchParams] = useSearchParams();
  const {client} = useContext(MatrixClientContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loginToken = searchParams.get("loginToken") as string;
    console.log("LOGIN");
    client
      .login("m.login.token", {
        type: "m.login.token",
        token: loginToken,
      })
      .then((response) => {
        sessionStorage.setItem("token", JSON.stringify(response));
        window.location.href = "/";
      });
  }, [navigate, searchParams, client]);

  return <div>Redirecting to protected page...</div>;
}
