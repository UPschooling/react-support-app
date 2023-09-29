import {MatrixContext} from "@/contexts/MatrixContext";
import {useContext, useMemo} from "react";

export function RoomListItem({roomId}: {roomId: string}) {
  const {client} = useContext(MatrixContext);
  const room = useMemo(() => client.getRoom(roomId), [client, roomId]);
  console.log(room);

  const asignee =
    room
      .getLiveTimeline()
      .getEvents()
      .findLast((event) => event.getType() === "ticket.assign")
      ?.getContent().assignee || "Keiner";

  const assignToMe = () =>
    client.sendEvent(roomId, "ticket.assign", {
      assignee: client.getUserId(),
    });

  const unassign = () =>
    client.sendEvent(roomId, "ticket.assign", {
      assignee: null,
    });

  return (
    <>
      {room?.name} - {asignee}
      {asignee === client.getUserId() ? (
        <button className="border-2 p-2" onClick={unassign}>
          Zuweisung aufheben
        </button>
      ) : (
        <button className="border-2 p-2" onClick={assignToMe}>
          Mir zuweisen
        </button>
      )}
    </>
  );
}
