import {TicketListItem} from "@/components/TicketListItem";
import {useTickets} from "@/hooks/useTickets";
import {useUser} from "@/hooks/useUser";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export function ProtectedPage() {
  const [userIsLoading, setUserIsLoading] = useState(true);
  const {syncUser, getUserId, profileInfo} = useUser();
  const {syncTickets, startEventListening, createTicket, tickets} =
    useTickets();
  const [ticketFormState, setTicketFormState] = useState({
    title: "",
  });
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

  const createTicketAndClearForm = async () => {
    createTicket(ticketFormState.title);
    setTicketFormState({title: ""});
  };

  return (
    <div>
      Hallo {profileInfo.displayname}
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
        {tickets.map((ticket) => (
          <li key={ticket.roomId}>
            <TicketListItem ticket={ticket} />
          </li>
        ))}
      </ul>
    </div>
  );
}
