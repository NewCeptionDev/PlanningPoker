import { Lobby } from "@/model/lobby";
import { LobbyState } from "@/model/LobbyState";
import { User } from "@/model/User";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LobbyScreen({ lobbyId, user }: { lobbyId: string, user: User }) {

  const [users, setUsers] = useState<User[]>([]);
  const [cardCollection, setCardCollection] = useState<string[]>([]);
  const [state, setState] = useState<LobbyState>(LobbyState.OVERVIEW);
  const [lobbyInformation, setLobbyInformation] = useState({ lobbyName: "" });

  const router = useRouter()

  useEffect(() => {
    console.log("Connecting Socket")
    socket.connect()
    socket.emit("joinLobby", { lobbyId: lobbyId, userId: user.id, name: user.name, role: user.roles[0] });

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    socket.on("fullLobbyInformation", (lobby: Lobby) => {
      console.log(lobby)
      setUsers(lobby.users);
      setCardCollection(lobby.cardCollection);
      setState(lobby.state);
    });

    return () => {
      socket.off("fullLobbyInformation");
    }
  }, [users, cardCollection, state]);

  useEffect(() => {
    async function fetchLobbyInformation() {
      const res = await fetch(
        "http://localhost:3000/management/lobbyInformation/" + lobbyId,
        {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          method: "GET",
        },
      )
      const data = await res.json();
      setLobbyInformation(data);
    }
    fetchLobbyInformation();
  }, [])

  function selectCard(card: string) {
    socket.emit("selectCard", { lobbyId: lobbyId, cardValue: card });
  }

  function showCards() {
    socket.emit("showCards", { lobbyId: lobbyId });
  }

  function resetCards() {
    socket.emit("reset", { lobbyId: lobbyId });
  }

  function leaveLobby() {
    socket.emit("leaveLobby", { lobbyId: lobbyId });
    router.push("/")
  }

  function copyLinkToClipboard() {
    navigator.clipboard.writeText(window.location.href);
  }

  return (
    <>
      <div className="flex flex-row h-[3.5vh] justify-between m-4">
        <h2 className="w-1/3 cursor-pointer" onClick={() => leaveLobby()}>Planning Poker</h2>
        <h3 className="w-1/3 text-center">{lobbyInformation.lobbyName}</h3>
        <div className="flex flex-row justify-end w-1/3">
          <p></p>
          <button className="btn" onClick={() => leaveLobby()}>Leave</button>
        </div>
      </div >
      <div className="flex flex-row h-[80vh] w-full">
        <div className="w-1/3"></div>
        <div className="w-1/3">
          <div className="flex flex-row justify-evenly m-4">
            <button onClick={showCards} className="btn">Show Cards</button>
            <button onClick={resetCards} className="btn">Reset Cards</button>
          </div>
        </div>
        <div className="w-1/3 flex flex-col items-center">
          <div className="flex flex-row justify-between w-2/3">
            <h1 className="m-4">Lobby: {lobbyId}</h1>
            <button onClick={() => copyLinkToClipboard()}>Copy Link</button>
          </div>
          <div className="flex flex-col border-white border-2 w-2/3">
            <h1 className="text-center m-4">Connected</h1>
            {users.map((user) => (
              <div key={user.id} className="m-4 mt-0">
                <p>{user.name} - {user.cardSelected ? "Card selected" : "No Card selected"} - {user.selectedCard ?? "?"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-evenly items-center h-[10vh]">

        {cardCollection.map((card) => (
          <button key={card} className="btn" onClick={() => selectCard(card)}>{card}</button>
        ))}
      </div>
    </>
  );
}
