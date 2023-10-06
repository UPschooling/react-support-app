import {TicketListItem} from "@/components/TicketListItem";
import {useTickets} from "@/hooks/useTickets";
import {useUser} from "@/hooks/useUser";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export function ProtectedPage() {
  const [userIsLoading, setUserIsLoading] = useState(true);
  const {syncUser, getUserId, profileInfo} = useUser();
  const {syncTickets, startEventListening, tickets, getTicketStatus} =
    useTickets();
  const navigate = useNavigate();

  if (!sessionStorage.getItem("token")) {
    navigate("/");
  }

  useEffect(() => {
    startEventListening(getUserId());
    syncUser().then(() => {
      setUserIsLoading(false);
      syncTickets();
    });
  }, [getUserId, startEventListening, syncTickets, syncUser]);

  if (userIsLoading) return <div>Loading...</div>;

  const openTickets = tickets.filter(
    (ticket) =>
      getTicketStatus(ticket.roomId) === "offen" ||
      getTicketStatus(ticket.roomId) === "in Bearbeitung",
  );

  const closedTickets = tickets.filter(
    (ticket) => getTicketStatus(ticket.roomId) === "abgeschlossen",
  );

  return (
    <div className="h-screen">
      <header className="flex items-center border-t bg-white px-4 py-1">
        <div className="flex">
          <h2 id="content-caption" className="font-semibold">
            {profileInfo?.displayname}
          </h2>
        </div>
        <div className="ml-auto">
          <button
            title="Neues Ticket erstellen"
            className="rounded-md border bg-blue-50 px-3 py-2 leading-none hover:bg-blue-100"
            onClick={() => navigate("/create-ticket")}
          >
            Neues Ticket erstellen
          </button>
        </div>
      </header>

      <table
        aria-describedby="info-popup"
        aria-label="open tickets"
        className="flex h-full min-h-0 w-full flex-col border-t"
      >
        <thead className="flex w-full flex-col px-4">
          <tr className="flex border-b">
            <th className="w-full max-w-xs truncate px-1 py-3 text-left font-semibold xl:max-w-lg">
              Titel
            </th>
            <th className="hidden flex-1 truncate px-1 py-3 text-left font-semibold md:block">
              Ersteller
            </th>
            <th className="hidden flex-1 truncate px-1 py-3 text-left font-semibold md:block">
              Erstellt am
            </th>
            <th className="hidden flex-1 truncate px-1 py-3 text-left font-semibold md:block">
              Zuletzt aktualisiert
            </th>
            <th className="hidden flex-1 truncate px-1 py-3 text-left font-semibold md:block">
              Zuständig
            </th>
          </tr>
        </thead>
        <tbody className="flex min-h-0 w-full flex-1 flex-col overflow-hidden px-4">
          <tr className="flex border-b">
            <th className="flex-1 bg-gray-100 px-3 py-2 text-left" colSpan={5}>
              <h2 className="text-sm">{openTickets.length} offene Tickets</h2>
            </th>
          </tr>
          {openTickets.map((ticket) => (
            <TicketListItem ticket={ticket} key={ticket.roomId} />
          ))}
          <tr className="flex border-b">
            <th className="flex-1 bg-gray-100 px-3 py-2 text-left" colSpan={5}>
              <h2 className="text-sm">
                {closedTickets.length} abgeschlossene Tickets
              </h2>
            </th>
          </tr>
          {closedTickets.map((ticket) => (
            <TicketListItem ticket={ticket} key={ticket.roomId} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
