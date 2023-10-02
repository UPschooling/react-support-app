import {useUser} from "@/hooks/useUser";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export function PasswordLoginPage() {
  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });
  const user = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user.isLoggedIn()) {
      navigate("/protected");
      return;
    }
  }, [navigate, user]);

  user;
  return (
    <div>
      <input
        type="text"
        id="username"
        className="border p-2"
        value={formState.username}
        onChange={(e) =>
          setFormState((prevState) => ({
            ...prevState,
            username: e.target.value,
          }))
        }
      />
      <input
        type="password"
        id="password"
        className="border p-2"
        value={formState.password}
        onChange={(e) =>
          setFormState((prevState) => ({
            ...prevState,
            password: e.target.value,
          }))
        }
      />
      <button
        className="border"
        onClick={() =>
          user
            .loginWithPassword(formState.username, formState.password)
            .then(() => {
              navigate("/protected");
            })
        }
      >
        Login
      </button>
    </div>
  );
}
