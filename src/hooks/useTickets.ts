import {getConfig} from "@/config/getConfig";
import {MatrixClientContext} from "@/contexts/MatrixClientContext";
import {
  EmittedEvents,
  MatrixEvent,
  Room,
  RoomMember,
  Visibility,
} from "matrix-js-sdk";
import {useCallback, useContext, useMemo, useState} from "react";

export function useTickets() {
  const {client} = useContext(MatrixClientContext);
  const [tickets, setTickets] = useState<Room[]>([]);

  const syncTickets = useCallback(async () => {
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
    );
  }, [client]);

  return useMemo(
    () => ({
      tickets,

      createTicket: async (title: string) => {
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

      syncTickets: (userId: string) => {
        client.once("sync" as EmittedEvents, async (state: string) => {
          if (state === "PREPARED") {
            syncTickets();
          }
        });
        client.on(
          "RoomMember.membership" as EmittedEvents,
          function (event: MatrixEvent, member: RoomMember) {
            if (member.membership === "invite" && member.userId === userId) {
              client.joinRoom(member.roomId).then(() => syncTickets());
            }
          },
        );
        client.on("Room.timeline" as EmittedEvents, function (e) {
          if (e.getType() === "ticket.assign") {
            syncTickets();
          }
        });
      },

      getTicket: (ticketId: string) => {
        return client.getRoom(ticketId);
      },

      getTicketAssignee: (ticketId: string) => {
        const room = client.getRoom(ticketId);
        return (
          room
            .getLiveTimeline()
            .getEvents()
            .findLast((event) => event.getType() === "ticket.assign")
            ?.getContent().assignee || "Keiner"
        );
      },

      assignTicket: (ticketId: string, assignee: string) => {
        return client.sendEvent(ticketId, "ticket.assign", {
          assignee,
        });
      },
    }),
    [client, syncTickets, tickets],
  );
}
