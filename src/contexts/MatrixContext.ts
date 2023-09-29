import {MatrixClient} from "matrix-js-sdk";
import {createContext} from "react";

export type MatrixContextType = {
  client?: MatrixClient;
  access_token?: string;
  device_id?: string;
  user_id?: string;
  expires_in_ms?: number;
  refresh_token?: string;
};

export const MatrixContext = createContext<MatrixContextType>({});
