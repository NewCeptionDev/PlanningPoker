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

  return (
    <div>
      <h1>Lobby: {lobbyId}</h1>
      <h2>Current State: {state.toString()}</h2>
      <h2>Users:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} - {user.cardSelected ? "Card selected" : "No Card selected"} - {user.selectedCard ?? "?"}</li>
        ))}
      </ul>
      <h2>Card Collection:</h2>
      <div className="flex flex-row justify-evenly m-4">
        {cardCollection.map((card) => (
          <button key={card} className="btn" onClick={() => selectCard(card)}>{card}</button>
        ))}
      </div>
      <div className="flex flex-row justify-evenly m-4">
        <button onClick={showCards} className="btn">Show Cards</button>
        <button onClick={resetCards} className="btn">Reset Cards</button>
      </div>
      <button className="btn" onClick={() => leaveLobby()}>Leave</button>
    </div>
  );
}
