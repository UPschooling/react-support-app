import {MatrixClient} from "matrix-js-sdk";

export async function loginWithToken(client: MatrixClient, loginToken: string) {
  return await client
    .login("m.login.token", {
      type: "m.login.token",
      token: loginToken,
    })
    .then((response) => {
      sessionStorage.setItem("token", JSON.stringify(response));
    });
}
