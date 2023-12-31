import {MatrixClientContext} from "@/contexts/MatrixClientContext";
import {useContext, useState} from "react";

export function PasswordLoginPage() {
  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });
  const {client} = useContext(MatrixClientContext);

  return (
    <div className="sm:max-w-md">
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
        Login
      </h1>
      <div className="space-y-4 md:space-y-6">
        <div>
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Benutzername
          </label>
          <input
            type="text"
            id="username"
            className="mb-3 block w-full appearance-none rounded border bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
            value={formState.username}
            onChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                username: e.target.value,
              }))
            }
          />{" "}
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="mb-3 block w-full appearance-none rounded border bg-gray-200 px-4 py-3 leading-tight text-gray-700 focus:bg-white focus:outline-none"
            value={formState.password}
            onChange={(e) =>
              setFormState((prevState) => ({
                ...prevState,
                password: e.target.value,
              }))
            }
          />{" "}
        </div>
        <button
          className="rounded-md border bg-gray-900 px-3 py-2 leading-none hover:bg-gray-600"
          onClick={() =>
            client
              .loginWithPassword(formState.username, formState.password)
              .then((response) => {
                sessionStorage.setItem("token", JSON.stringify(response));
                window.location.href = `${window.location.origin}/apps/upschoolingsupport`;
              })
          }
        >
          Login
        </button>
      </div>
    </div>
  );
}
