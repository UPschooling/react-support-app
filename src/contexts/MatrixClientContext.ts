import {getConfig} from "@/config/getConfig";
import {MatrixClient, createClient} from "matrix-js-sdk";
import {createContext} from "react";

const matrixClient = createClient({baseUrl: getConfig("synapse")});

export type MatrixClientContextType = {
  client: MatrixClient;
};

export const MatrixClientContext = createContext<MatrixClientContextType>({
  client: matrixClient,
});
