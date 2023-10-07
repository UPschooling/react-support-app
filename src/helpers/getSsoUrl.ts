import {ISSOFlow, MatrixClient} from "matrix-js-sdk";

export async function getSsoUrl(client: MatrixClient) {
  const loginFlows = await client.loginFlows();

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

  return client.getSsoLoginUrl(
    `${window.location.href}/callback`,
    "sso",
    providerForThisInstance.id,
  );
}
