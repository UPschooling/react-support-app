import {getConfig} from "@/config/getConfig";
import {Ticket} from "@/types/Ticket";
import {MatrixClient, createClient} from "matrix-js-sdk";
import {createContext} from "react";

const matrixClient = createClient({baseUrl: getConfig("synapse")});

export type MatrixClientContextType = {
  client: MatrixClient;
  isLoading?: boolean;
  profileInfo?: {displayname?: string; avatar_url?: string};
  tickets?: Ticket[];
};

export const MatrixClientContext = createContext<MatrixClientContextType>({
  client: matrixClient,
});
