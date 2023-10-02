import {useTickets} from "@/hooks/useTickets";
import {useUser} from "@/hooks/useUser";
import {Room} from "matrix-js-sdk";

export function TicketListItem({ticket}: {ticket: Room}) {
  const user = useUser();
  const {assignTicket, getTicketAssignee} = useTickets();
  const userId = user.getUserId();
  const asignee = getTicketAssignee(ticket.roomId);

  const assignToMe = () => assignTicket(ticket.roomId, userId);
  const unassign = () => assignTicket(ticket.roomId, null);

  return (
    <>
      {ticket.name} - {asignee}
      {asignee === userId ? (
        <button className="border-2 p-2" onClick={unassign}>
          Zuweisung aufheben
        </button>
      ) : (
        <button className="border-2 p-2" onClick={assignToMe}>
          Mir zuweisen
        </button>
      )}
    </>
  );
}
