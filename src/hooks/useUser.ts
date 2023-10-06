import {MatrixClientContext} from "@/contexts/MatrixClientContext";
import {ILoginFlowsResponse, IMatrixProfile, ISSOFlow} from "matrix-js-sdk";
import {useCallback, useContext, useState} from "react";

export function useUser() {
  const {client} = useContext(MatrixClientContext);
  const [profileInfo, setProfileInfo] = useState<IMatrixProfile>();
  const [ssoUrl, setSsoUrl] = useState<string>();

  const syncUser = useCallback(async () => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    client.credentials = {userId: token?.user_id};
    client.setAccessToken(token?.access_token);
    return client.startClient({initialSyncLimit: 10}).then(async () => {
      await client.getProfileInfo(token?.user_id).then((response) => {
        setProfileInfo(response);
      });
    });
  }, [client]);

  const isClientReady = useCallback(() => {
    return profileInfo?.displayname !== undefined;
  }, [profileInfo?.displayname]);

  const getSsoUrl = useCallback(async () => {
    if (!ssoUrl) {
      await client.loginFlows().then((loginFlows: ILoginFlowsResponse) => {
        const ssoFlow: ISSOFlow = loginFlows.flows.find(
          (flow) => flow.type === "m.login.sso",
        ) as ISSOFlow;

        if (!ssoFlow) {
          throw new Error("No SSO flow found, check Synapse configuration.");
        }

        const providerForThisInstance = ssoFlow.identity_providers.find(
          (provider) => provider.name === window.location.origin,
        );

        if (!providerForThisInstance) {
          throw new Error(
            "No SSO provider found for this instance, check Synapse configuration.",
          );
        }

        setSsoUrl(
          client.getSsoLoginUrl(
            `${window.location.href}callback`,
            "sso",
            providerForThisInstance.id,
          ),
        );
      });
    }
    return ssoUrl;
  }, [client, ssoUrl]);

  const isLoggedIn = useCallback(() => {
    return sessionStorage.getItem("token") !== null;
  }, []);

  const login = useCallback(
    async (loginToken: string) => {
      return await client
        .login("m.login.token", {
          type: "m.login.token",
          token: loginToken,
        })
        .then((response) => {
          sessionStorage.setItem("token", JSON.stringify(response));
        });
    },
    [client],
  );

  const loginWithPassword = useCallback(
    async (username: string, password: string) => {
      return await client
        .login("m.login.password", {
          identifier: {
            type: "m.id.user",
            user: username,
          },
          password: password,
        })
        .then((response) => {
          sessionStorage.setItem("token", JSON.stringify(response));
        });
    },
    [client],
  );

  const getUserId = useCallback(() => {
    return client.getUserId();
  }, [client]);

  const getUser = useCallback(
    (userId: string) => {
      return client.getUser(userId);
    },
    [client],
  );

  const getAllUsers = useCallback(() => {
    return client.getUsers();
  }, [client]);

  return {
    profileInfo,
    syncUser,
    isClientReady,
    getSsoUrl,
    isLoggedIn,
    login,
    loginWithPassword,
    getUserId,
    getUser,
    getAllUsers,
  };
}
