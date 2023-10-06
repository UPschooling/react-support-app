import {Room} from "matrix-js-sdk";

export type Ticket = {
  id: string;
  room: Room;
  status?: string;
  assignee?: string;
  created_by?: string;
  messages: {
    id: string;
    sender_id: string;
    message: string;
    created_at: Date;
    sender_displayname?: string;
  }[];
  description?: string;
};
