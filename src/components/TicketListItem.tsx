import {useTickets} from "@/hooks/useTickets";
import {useUser} from "@/hooks/useUser";
import {Room} from "matrix-js-sdk";
import {useNavigate} from "react-router-dom";

export function TicketListItem({ticket}: {ticket: Room}) {
  const user = useUser();
  const {getTicketAssignee} = useTickets();
  const asignee = getTicketAssignee(ticket.roomId);
  const ticketEvents = ticket.getLiveTimeline().getEvents();
  const createEvent = ticketEvents[0];
  const lastEvent = ticketEvents[ticketEvents.length - 1];
  const navigate = useNavigate();

  return (
    <tr
      role="row"
      className="group flex cursor-pointer border-b hover:bg-blue-100"
      aria-controls="info-popup"
      onClick={() => navigate("/details-ticket?ticketId=" + ticket.roomId)}
    >
      <td className="w-full max-w-xs px-1 py-3 xl:max-w-lg">{ticket.name}</td>
      <td className="hidden flex-1 truncate px-1 py-3 md:block">
        {user.getUser(createEvent.getSender()).displayName}
      </td>
      <td className="hidden flex-1 truncate px-1 py-3 md:block">
        {createEvent.getDate().toLocaleString()}
      </td>
      <td className="hidden flex-1 truncate px-1 py-3 md:block">
        {lastEvent.getDate().toLocaleString()}
      </td>
      <td className="hidden flex-1 truncate px-1 py-3 md:block">{asignee}</td>
    </tr>
  );
}
