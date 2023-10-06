import {MatrixClient} from "matrix-js-sdk";

export function assignTicket(
  client: MatrixClient,
  ticketId: string,
  assignee: string,
) {
  return client.sendEvent(ticketId, "ticket.assign", {
    assignee,
  });
}
