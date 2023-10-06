import {getConfig} from "@/config/getConfig";
import {MatrixClient, createClient} from "matrix-js-sdk";
import {useEffect, useMemo} from "react";

export function useSyncedClient(beforeSync?: (client: MatrixClient) => void) {
  const token = sessionStorage.getItem("token");

  const config: {baseUrl: string; accessToken?: string; userId?: string} =
    useMemo(() => {
      if (token !== null) {
        return {
          baseUrl: getConfig("synapse"),
          accessToken: JSON.parse(sessionStorage.getItem("token")).access_token,
          userId: JSON.parse(sessionStorage.getItem("token")).user_id,
        };
      }
      return {
        baseUrl: getConfig("synapse"),
      };
    }, [token]);

  const matrixClient = useMemo(() => createClient(config), [config]);

  if (beforeSync) {
    beforeSync(matrixClient);
  }

  useEffect(() => {
    matrixClient.startClient({initialSyncLimit: 10});
  }, [matrixClient]);

  return matrixClient;
}
