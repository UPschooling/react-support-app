import {getConfig} from "@/config/getConfig";
import {MatrixClientContext} from "@/contexts/MatrixClientContext";
import {
  EmittedEvents,
  MatrixEvent,
  Room,
  RoomMember,
  Visibility,
} from "matrix-js-sdk";
import {useCallback, useContext, useState} from "react";

export function useTickets() {
  const {client} = useContext(MatrixClientContext);
  const [tickets, setTickets] = useState<Room[]>([]);

  const getTicket = useCallback(
    (ticketId: string) => client.getRoom(ticketId),
    [client],
  );

  const syncTickets = useCallback(
    async () =>
      setTickets(
        (await client.getJoinedRooms()).joined_rooms
          .map((roomId) => client.getRoom(roomId))
          .filter(
            (room) =>
              room &&
              room
                .getLiveTimeline()
                .getEvents()
                .find((event) => event.getType() === "ticket.create") !==
                undefined,
          ),
      ),
    [client],
  );

  const createTicket = useCallback(
    async (title: string) => {
      const createdRoom = await client.createRoom({
        name: title,
        visibility: Visibility.Private,
      });

      return Promise.all([
        client.sendStateEvent(createdRoom.room_id, "m.room.join_rules", {
          allow: [
            {
              room_id: getConfig("supporterSpace"),
              type: "m.room_membership",
              state_key: {
                type: "m.room.power_levels",
                key: "",
                value: {
                  users: {
                    [getConfig("synapse")]: 50,
                  },
                },
              },
            },
          ],
          join_rule: "restricted",
        }),

        client
          .getRoom(getConfig("supporterSpace"))
          ?.getJoinedMembers()
          .filter((member) => member.powerLevelNorm >= 50)
          .forEach((member) =>
            client.invite(createdRoom.room_id, member.userId),
          ),

        client.sendEvent(createdRoom.room_id, "ticket.create", {}),
      ]).finally(() =>
        setTickets([...tickets, client.getRoom(createdRoom.room_id)]),
      );
    },
    [client, tickets],
  );

  const startEventListening = useCallback(
    (userId: string) => {
      client.once("sync" as EmittedEvents, async (state: string) => {
        if (state === "PREPARED") {
          syncTickets();
        }
      });

      client.on(
        "RoomMember.membership" as EmittedEvents,
        async (event: MatrixEvent, member: RoomMember) => {
          if (member.membership === "invite" && member.userId === userId) {
            await client.joinRoom(member.roomId).then(() => syncTickets());
          }
        },
      );

      client.on("Room.timeline" as EmittedEvents, (event: MatrixEvent) => {
        if (event.getType() === "ticket.create") {
          syncTickets();
        }
        if (event.getType() === "ticket.assign") {
          syncTickets();
        }
      });
    },
    [client, syncTickets],
  );

  const getTicketAssignee = useCallback(
    (ticketId: string) =>
      getTicket(ticketId)
        .getLiveTimeline()
        .getEvents()
        .findLast((event) => event.getType() === "ticket.assign")
        ?.getContent().assignee || "Keiner",
    [getTicket],
  );

  const assignTicket = useCallback(
    (ticketId: string, assignee: string) =>
      client.sendEvent(ticketId, "ticket.assign", {
        assignee,
      }),
    [client],
  );

  return {
    tickets,
    getTicket,
    createTicket,
    syncTickets,
    startEventListening,
    getTicketAssignee,
    assignTicket,
  };
}
