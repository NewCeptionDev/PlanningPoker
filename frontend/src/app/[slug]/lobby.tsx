import { Lobby } from "@/model/lobby";
import { LobbyState } from "@/model/LobbyState";
import { User } from "@/model/User";
import { socket } from "@/socket";
import { useEffect, useState } from "react";

export default function LobbyScreen({ lobbyId, user }: { lobbyId: string, user: User }) {

  const [users, setUsers] = useState<User[]>([]);
  const [cardCollection, setCardCollection] = useState<string[]>([]);
  const [state, setState] = useState<LobbyState>(LobbyState.OVERVIEW);

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

    socket.on("confirmCardSelection", (cardId: string) => {
      console.log("confirm Card selected: " + cardId);
      const localCopy = [...users];
      const ownUser = localCopy.find((u) => u.id === user?.id);
      console.log("users", users)
      console.log("user", user)
      if (ownUser) {
        console.log("Own user: " + ownUser.name);
        ownUser.cardSelected = true;
        ownUser.selectedCard = cardId;
        setUsers(localCopy);
      }
    })

    socket.on("cardSelected", (userId: string) => {
      console.log("Card selected: " + userId);
      const localCopy = [...users];
      const otherUser = localCopy.find((u) => u.id === userId);
      if (otherUser) {
        otherUser.cardSelected = true;
        setUsers(localCopy);
      }
    })

    return () => {
      socket.off("fullLobbyInformation");
      socket.off("cardSelected");
      socket.off("confirmCardSelection");
    }
  }, [users]);


  function selectCard(card: string) {
    socket.emit("selectCard", { lobbyId: lobbyId, cardValue: card });
  }

  function showCards() {
    socket.emit("showCards", { lobbyId: lobbyId });
  }

  function resetCards() {
    socket.emit("reset", { lobbyId: lobbyId });
  }

  return (
    <div>
      <h1>Lobby: {lobbyId}</h1>
      <h2>Current State: {state}</h2>
      <h2>Users:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} - {user.cardSelected} - {user.selectedCard}</li>
        ))}
      </ul>
      <h2>Card Collection:</h2>
      <div>
        {cardCollection.map((card) => (
          <button key={card} onClick={() => selectCard(card)}>{card}</button>
        ))}
      </div>
      <button onClick={showCards}>Show Cards</button>
      <button onClick={resetCards}>Reset Cards</button>
    </div>
  );
}
