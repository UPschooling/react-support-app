import {Ticket} from "@/types/Ticket";
import {useNavigate} from "react-router-dom";

export function TicketListItem({ticket}: {ticket: Ticket}) {
  const ticketEvents = ticket.room.getLiveTimeline().getEvents();
  const createEvent = ticketEvents[0];
  const lastEvent = ticketEvents[ticketEvents.length - 1];
  const navigate = useNavigate();

  return (
    <tr
      role="row"
      className="group flex cursor-pointer border-b hover:bg-blue-100"
      aria-controls="info-popup"
      onClick={() => navigate("/details-ticket?ticketId=" + ticket.id)}
    >
      <td className="w-full max-w-xs px-1 py-3 xl:max-w-lg">
        {ticket.room?.name}
      </td>
      <td className="hidden flex-1 truncate px-1 py-3 md:block">
        {ticket.created_by}
      </td>
      <td className="hidden flex-1 truncate px-1 py-3 md:block">
        {createEvent?.getDate().toLocaleString()}
      </td>
      <td className="hidden flex-1 truncate px-1 py-3 md:block">
        {lastEvent?.getDate().toLocaleString()}
      </td>
      <td className="hidden flex-1 truncate px-1 py-3 md:block">
        {ticket.assignee}
      </td>
    </tr>
  );
}
