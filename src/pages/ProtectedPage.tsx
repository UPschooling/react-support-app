import {RoomListItem} from "@/components/RoomListItem";
import {MatrixContext} from "@/contexts/MatrixContext";
import {EmittedEvents, Visibility} from "matrix-js-sdk";
import {useContext, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";

export function ProtectedPage() {
  const [profileInfo, setProfileInfo] = useState<{
    displayname?: string;
    avatar_url?: string;
  }>({});
  const {client} = useContext(MatrixContext);
  const token = useMemo(() => JSON.parse(sessionStorage.getItem("token")), []);
  const [rooms, setRooms] = useState([]);
  const [ticketFormState, setTicketFormState] = useState({
    title: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
    }
    client.credentials = {userId: token?.user_id};
    client.setAccessToken(token?.access_token);
    client.startClient().then(() => {
      client.getProfileInfo(token?.user_id).then((response) => {
        setProfileInfo(response);
      });
    });
    const joinAllAvailableRooms = () =>
      client.publicRooms().then((response) => {
        response.chunk.forEach(async (room) => {
          await client.joinRoom(room.room_id);
          setRooms(client.getVisibleRooms());
        });
      });

    client.once("sync" as EmittedEvents, (state: string) => {
      if (state === "PREPARED") {
        joinAllAvailableRooms();
      }
    });

    setInterval(joinAllAvailableRooms, 12000);
  }, [client, navigate, token]);

  client.on("Room.timeline" as EmittedEvents, () => {
    setRooms(client.getVisibleRooms());
  });

  if (!profileInfo.displayname) return <div>Loading...</div>;

  const createTicket = () => {
    client.createRoom({
      name: ticketFormState.title,
      visibility: Visibility.Public,
    });

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
      <button className="border-2 p-2" onClick={createTicket}>
        Ticket erstellen
      </button>
      <br />
      Tickets:
      <ul>
        {rooms.map((room) => (
          <li key={room.roomId}>
            <RoomListItem roomId={room.roomId} />
          </li>
        ))}
      </ul>
    </div>
  );
}
