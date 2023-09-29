import {ILoginFlowsResponse, ISSOFlow, MatrixClient} from "matrix-js-sdk";
import {useCallback, useEffect, useState} from "react";

export function useGetSSOUrl(client: MatrixClient) {
  const [loginFlows, setLoginFlows] = useState<ILoginFlowsResponse>();
  const [ssoUrl, setSsoUrl] = useState<string>();
  const [isLoading] = useState<boolean>(false);

  const getSsoUrl = useCallback(() => {
    (async () => {
      setLoginFlows(await client.loginFlows());
    })();

    if (!loginFlows) {
      return;
    }

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
  }, [client, loginFlows]);

  useEffect(() => {
    if (!ssoUrl) {
      getSsoUrl();
    }
  }, [ssoUrl, isLoading, getSsoUrl]);

  return {ssoUrl};
}
