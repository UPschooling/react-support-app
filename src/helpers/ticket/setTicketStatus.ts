import {MatrixClient} from "matrix-js-sdk";

export function setTicketStatus(
  client: MatrixClient,
  ticketId: string,
  status: string,
) {
  return client.sendEvent(ticketId, "ticket.status", {
    status,
  });
}
