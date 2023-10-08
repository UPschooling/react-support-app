import {
  EmittedEvents,
  MatrixClient,
  MatrixEvent,
  RoomMember,
} from "matrix-js-sdk";
import {useEffect, useState} from "react";
import {Ticket} from "@/types/Ticket";
import {useNavigate} from "react-router-dom";

export function useLoggedInClient(client: MatrixClient) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [profileInfo, setProfileInfo] = useState<{
    displayname?: string;
    avatar_url?: string;
  }>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  client.on(
    "RoomMember.membership" as EmittedEvents,
    async (event: MatrixEvent, member: RoomMember) => {
      if (
        member.membership === "invite" &&
        member.userId === client.getUserId()
      ) {
        await client.joinRoom(member.roomId);
      }
    },
  );

  client.on("Room.timeline" as EmittedEvents, (event: MatrixEvent) => {
    switch (event.getType()) {
      case "ticket.create":
        setTickets((prevState) => {
          if (
            prevState.find((ticket) => ticket.id === event.getRoomId()) ===
            undefined
          ) {
            return [
              ...prevState,
              {
                room: client.getRoom(event.getRoomId()),
                id: event.getRoomId(),
                messages: [],
                created_by: event.getSender(),
              },
            ];
          } else {
            return prevState;
          }
        });
        break;

      case "ticket.status":
        setTickets((prevState) => {
          return prevState.map((ticket) => {
            if (ticket.id === event.getRoomId()) {
              return {...ticket, status: event.getContent().status};
            }
            return ticket;
          });
        });
        break;

      case "ticket.assign":
        setTickets((prevState) => {
          return prevState.map((ticket) => {
            if (ticket.id === event.getRoomId()) {
              return {...ticket, assignee: event.getContent().assignee};
            }
            return ticket;
          });
        });
        break;

      case "m.room.message":
        setTickets((prevState) => {
          return prevState.map((ticket) => {
            if (ticket.id === event.getRoomId()) {
              if (
                ticket.messages.find(
                  (message) => message.id === event.getId(),
                ) === undefined
              ) {
                ticket.messages.push({
                  id: event.getId(),
                  sender_id: event.getSender(),
                  message: event.getContent().body,
                  created_at: event.getDate(),
                  sender_displayname: event.getSender(),
                });
              }
            }
            return ticket;
          });
        });
        break;

      case "ticket.description":
        setTickets((prevState) => {
          return prevState.map((ticket) => {
            if (ticket.id === event.getRoomId()) {
              ticket.description = event.getContent().description;
            }
            return ticket;
          });
        });
        break;
    }
  });

  client.once("sync" as EmittedEvents, async (state: string) => {
    if (state === "PREPARED") {
      client
        .getProfileInfo(client.getUserId())
        .then((profile) => setProfileInfo(profile))
        .then(() => setIsLoading(false));
    } else if (state === "ERROR") {
      sessionStorage.removeItem("token");
      navigate("/");
    }
  });

  useEffect(() => {
    client.clearStores().then(() => {
      client
        .startClient({
          includeArchivedRooms: true,
          lazyLoadMembers: false,
          initialSyncLimit: 100000,
        })
        .then(() => {
          setTickets((prevState) =>
            prevState.map((ticket) => ({
              ...ticket,
              room: client.getRoom(ticket.id),
            })),
          );
        });
    });
  }, [client]);

  return {
    client,
    isLoading,
    profileInfo,
    tickets,
  };
}
