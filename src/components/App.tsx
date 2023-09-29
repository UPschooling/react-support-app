import * as sdk from "matrix-js-sdk";
import {useEffect, useMemo} from "react";

export function App() {
  const matrixClient = useMemo(
    () => sdk.createClient({baseUrl: "http://synapse.local"}),
    [],
  );

  useEffect(() => {
    matrixClient.startClient({initialSyncLimit: 10});
  }, [matrixClient]);

  return <div>Hello World!</div>;
}
