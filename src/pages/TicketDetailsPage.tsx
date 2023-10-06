import {MatrixClientContext} from "@/contexts/MatrixClientContext";
import {useTickets} from "@/hooks/useTickets";
import {useUser} from "@/hooks/useUser";
import {EmittedEvents, MatrixEvent} from "matrix-js-sdk";
import {useContext, useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";

export function TicketDetailsPage() {
  const [searchParams] = useSearchParams();
  const {syncUser, getUserId, getAllUsers} = useUser();
  const {
    getTicket,
    getTicketDescription,
    getTicketStatus,
    getTicketAssignee,
    syncTickets,
    startEventListening,
    assignTicket,
    setTicketStatus,
    sendMessage,
    getMessages,
  } = useTickets();
  const ticket = getTicket(searchParams.get("ticketId") as string);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<MatrixEvent[]>([]);
  const {client} = useContext(MatrixClientContext);
  const [messageFormState, setMessageFormState] = useState("");

  if (!sessionStorage.getItem("token")) {
    navigate("/");
  }

  useEffect(() => {
    client.on("Room.timeline" as EmittedEvents, (event: MatrixEvent) => {
      if (
        event.getType() === "m.room.message" &&
        event.getRoomId() === searchParams.get("ticketId")
      ) {
        setMessages((prevState) => {
          if (
            prevState.find((message) => message.getId() === event.getId()) ===
            undefined
          ) {
            return [...prevState, event];
          } else {
            return prevState;
          }
        });
      }
    });
    startEventListening(getUserId());
    syncUser();
  }, [
    client,
    getMessages,
    getUserId,
    messages,
    searchParams,
    startEventListening,
    syncTickets,
    syncUser,
  ]);

  if (!ticket) {
    return <div>Loading...</div>;
  }

  const assignee = getTicketAssignee(ticket.roomId);
  const status = getTicketStatus(ticket.roomId);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="w-full flex-1 divide-y p-8">
        <div className="flex flex-col p-8 md:flex-row">
          <div className="w-1/6 font-semibold">Titel</div>
          <div className="w-4/6">{ticket.name}</div>
        </div>
        <div className="flex flex-col p-8 md:flex-row">
          <div className="w-1/6 font-semibold">Beschreibung</div>
          <div className="w-4/6">{getTicketDescription(ticket.roomId)}</div>
        </div>
        <div className="flex flex-col p-8 md:flex-row">
          <div className="w-1/6 font-semibold">Status</div>
          <div className="w-4/6">
            <select
              onChange={(e) => setTicketStatus(ticket.roomId, e.target.value)}
            >
              <option value="offen" selected={status === "offen"}>
                offen
              </option>
              <option
                value="in Bearbeitung"
                selected={status === "in Bearbeitung"}
              >
                in Bearbeitung
              </option>
              <option
                value="abgeschlossen"
                selected={status === "abgeschlossen"}
              >
                abgeschlossen
              </option>
            </select>
          </div>
        </div>
        <div className="flex flex-col p-8 md:flex-row">
          <div className="w-1/6 font-semibold">Zuständig</div>
          <div className="w-4/6">
            <select
              onChange={(e) => assignTicket(ticket.roomId, e.target.value)}
            >
              <option value="" selected={assignee === "Keiner"}>
                Keiner
              </option>
              {getAllUsers().map((user) => (
                <option
                  value={user.userId}
                  selected={user.userId === assignee}
                  key={user.userId}
                >
                  {user.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="m-4 h-64 grow overflow-y-scroll border">
        {messages.map((message) => (
          <div
            key={message.getId()}
            className={
              message.getSender() === getUserId()
                ? "chat chat-end"
                : "chat chat-start"
            }
          >
            <div
              className={`chat-bubble ${
                message.getSender() === getUserId()
                  ? "chat-bubble-info"
                  : "chat-bubble-warning"
              }`}
            >
              {message.getContent().body}
            </div>
          </div>
        ))}
      </div>
      <div className="m-4 -mt-4 flex-1 flex-row">
        <input
          type="text"
          className="w-[80%] border p-2 md:w-[90%]"
          value={messageFormState}
          onChange={(e) => setMessageFormState(e.target.value)}
        />
        <button
          className="w-[20%] border p-2 md:w-[10%]"
          onClick={() => {
            if (messageFormState) {
              sendMessage(ticket.roomId, messageFormState);
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
