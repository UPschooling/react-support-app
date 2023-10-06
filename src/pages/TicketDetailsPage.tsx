import {assignTicket} from "@/helpers/ticket/assignTicket";
import {setTicketStatus} from "@/helpers/ticket/setTicketStatus";
import {useLoggedInClient} from "@/hooks/useLoggedInClient";
import {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

export function TicketDetailsPage() {
  const [searchParams] = useSearchParams();
  const [messageFormState, setMessageFormState] = useState("");
  const navigate = useNavigate();

  const {client, tickets, isLoading} = useLoggedInClient();

  if (!client.isLoggedIn()) {
    navigate("/");
  }

  const ticket = tickets.find(
    (ticket) => ticket.id === searchParams.get("ticketId"),
  );

  if (isLoading || !ticket) {
    return <div>Loading...</div>;
  }

  const sendMessage = (ticketId: string, message: string) =>
    client.sendEvent(ticketId, "m.room.message", {
      msgtype: "m.text",
      body: message,
    });

  return (
    <div className="flex min-h-screen flex-col">
      <div className="w-full flex-1 divide-y p-8">
        <div className="flex flex-col p-8 md:flex-row">
          <div className="w-1/6 font-semibold">Titel</div>
          <div className="w-4/6">{ticket.room.name}</div>
        </div>
        <div className="flex flex-col p-8 md:flex-row">
          <div className="w-1/6 font-semibold">Beschreibung</div>
          <div className="w-4/6">{ticket.description}</div>
        </div>
        <div className="flex flex-col p-8 md:flex-row">
          <div className="w-1/6 font-semibold">Status</div>
          <div className="w-4/6">
            <select
              className="p-2"
              onChange={(e) =>
                setTicketStatus(client, ticket.room.roomId, e.target.value)
              }
              value={ticket.status}
            >
              <option value="offen">offen</option>
              <option value="in Bearbeitung">in Bearbeitung</option>
              <option value="abgeschlossen">abgeschlossen</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col p-8 md:flex-row">
          <div className="w-1/6 font-semibold">Zuständig</div>
          <div className="w-4/6">
            <select
              className="p-2"
              onChange={(e) =>
                assignTicket(client, ticket.room.roomId, e.target.value)
              }
              value={ticket.assignee}
            >
              <option value="">Keiner</option>
              {client.getUsers().map((user) => (
                <option value={user.userId} key={user.userId}>
                  {user.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="m-4 h-64 grow overflow-y-scroll border">
        {ticket.messages.map((message) => (
          <div
            key={message.id}
            className={
              message.sender_id === client.getUserId()
                ? "chat chat-end"
                : "chat chat-start"
            }
          >
            <div
              className={`chat-bubble ${
                message.sender_id === client.getUserId()
                  ? "chat-bubble-info"
                  : "chat-bubble-warning"
              }`}
            >
              <p className="text-sm font-bold">
                {message.sender_displayname} am{" "}
                {message.created_at.toLocaleString()}
              </p>
              {message.message}
            </div>
          </div>
        ))}
      </div>
      <div className="m-4 -mt-4 flex-1 flex-row">
        <input
          type="text"
          className="w-[80%] border bg-gray-200 p-2 text-gray-700 focus:bg-white focus:outline-none md:w-[90%]"
          value={messageFormState}
          onChange={(e) => setMessageFormState(e.target.value)}
        />
        <button
          className="w-[20%] border p-2 md:w-[10%]"
          onClick={() => {
            if (messageFormState) {
              sendMessage(ticket.room.roomId, messageFormState);
              setMessageFormState("");
            }
          }}
        >
          Senden
        </button>
      </div>
      <div>
        <button
          title="Zurück"
          className="rounded-md border bg-blue-50 px-3 py-2 leading-none hover:bg-blue-100"
          onClick={() => navigate("/protected")}
        >
          Zurück
        </button>
      </div>
    </div>
  );
}
