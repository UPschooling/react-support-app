import {TicketListItem} from "@/components/TicketListItem";
import {useTickets} from "@/hooks/useTickets";
import {useUser} from "@/hooks/useUser";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export function ProtectedPage() {
  const [userIsLoading, setUserIsLoading] = useState(true);
  const user = useUser();
  const ticketService = useTickets();
  const [ticketFormState, setTicketFormState] = useState({
    title: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
    }
    ticketService.syncTickets(user.getUserId());
    user.syncUser().then(() => setUserIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (userIsLoading) return <div>Loading...</div>;

  const createTicketAndClearForm = async () => {
    ticketService.createTicket(ticketFormState.title);
    setTicketFormState({title: ""});
  };

  return (
    <div>
      Hallo {user.profileInfo.displayname}
      <br />
      <input
        className="border"
        name="title"
        value={ticketFormState.title}
        onChange={(e) =>
          setTicketFormState((prevState) => ({
            ...prevState,
            title: e.target.value,
          }))
        }
      />
      <button className="border-2 p-2" onClick={createTicketAndClearForm}>
        Ticket erstellen
      </button>
      <br />
      Tickets:
      <ul>
        {ticketService.tickets.map((ticket) => (
          <li key={ticket.roomId}>
            <TicketListItem ticket={ticket} />
          </li>
        ))}
      </ul>
    </div>
  );
}
