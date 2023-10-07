import {getConfig} from "@/config/getConfig";
import {MatrixClient, Visibility} from "matrix-js-sdk";

export async function createTicket(
  client: MatrixClient,
  title: string,
  description: string,
) {
  const createdRoom = await client.createRoom({
    name: title,
    visibility: Visibility.Private,
  });

  return client
    .sendStateEvent(createdRoom.room_id, "m.room.join_rules", {
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
    })
    .then(() =>
      Promise.all(
        client
          .getRoom(getConfig("supporterSpace"))
          ?.getMembers()
          .filter(
            (member) =>
              member.powerLevelNorm >= 50 &&
              member.userId !== client.getUserId(),
          )
          .map((member) => client.invite(createdRoom.room_id, member.userId)),
      ),
    )
    .then(() => client.sendEvent(createdRoom.room_id, "ticket.create", {}))
    .then(() =>
      client.sendEvent(createdRoom.room_id, "ticket.description", {
        description,
      }),
    )
    .then(() =>
      client.sendEvent(createdRoom.room_id, "ticket.status", {
        status: "offen",
      }),
    );
}
