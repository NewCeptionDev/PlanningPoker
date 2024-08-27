"use client";

import { Lobby } from "@/model/lobby";
import { LobbyState } from "@/model/LobbyState";
import { User } from "@/model/User";
import { socket } from "@/socket";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { slug: string } }) {

  const [users, setUsers] = useState<User[]>([]);
  const [cardCollection, setCardCollection] = useState<string[]>([]);
  const [state, setState] = useState<LobbyState>(LobbyState.OVERVIEW);

  useEffect(() => {
    socket.connect();
    socket.emit("joinLobby", { lobbyId: params.slug });

    socket.on("fullLobbyInformation", (lobby: Lobby) => {
      setUsers(lobby.users);
      setCardCollection(lobby.cardCollection);
      setState(lobby.state);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function selectCard(card: string) {
    socket.emit("selectCard", { lobbyId: params.slug, cardValue: card });
  }

  function showCards() {
    socket.emit("showCards", { lobbyId: params.slug });
  }

  function resetCards() {
    socket.emit("reset", { lobbyId: params.slug });
  }

  return (
    <div>
      <h1>Lobby: {params.slug}</h1>
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
