import { Lobby } from "@/model/lobby";
import { LobbyState } from "@/model/LobbyState";
import { Role } from "@/model/Role";
import { User } from "@/model/User";
import { socket } from "@/socket";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ThemeSwitcher from "../themeswitcher";

export default function LobbyScreen({ lobbyId, user }: { lobbyId: string, user: User }) {

  const [users, setUsers] = useState<User[]>([]);
  const [cardCollection, setCardCollection] = useState<string[]>([]);
  const [state, setState] = useState<LobbyState>(LobbyState.OVERVIEW);
  const [lobbyInformation, setLobbyInformation] = useState({ lobbyName: "" });
  const [userDistribution, setUserDistribution] = useState<User[][]>([]);

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
      distributePlayers(lobby.users.filter(u => u.roles.includes(Role.PLAYER)))
    });

    return () => {
      socket.off("fullLobbyInformation");
    }
  }, [users, cardCollection, state, userDistribution]);

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

  function selectedCard() {
    return users.find((u) => u.id === user.id)?.selectedCard;
  }

  function copyLinkToClipboard() {
    navigator.clipboard.writeText(window.location.href);
  }

  function distributePlayers(userList: User[]) {
    console.log("called distribute with: ", userList)
    const distribution: User[][] = [[], [], [], []]
    for (let i = 0; i < userList.length; i++) {
      distribution[i % 4]!.push(userList[i])
    }
    setUserDistribution(distribution)

  }

  return (
    <>
      <div className="flex flex-row h-[4.5vh] justify-between p-4 headline">
        <h2 className="w-1/3 cursor-pointer" onClick={() => leaveLobby()}>Planning Poker</h2>
        <h3 className="w-1/3 text-center">{lobbyInformation.lobbyName}</h3>
        <div className="flex flex-row justify-end w-1/3">
          <ThemeSwitcher />
          <p>{user.name}</p>
          <button className="btn" onClick={() => leaveLobby()}>Leave</button>
        </div>
      </div >
      <div className="flex flex-row h-[78vh] w-full">
        <div className="w-1/5 flex flex-col m-8">
          <h1>Lobby: {lobbyInformation.lobbyName}</h1>
          <h3>Id: {lobbyId}</h3>
          <button className="btn w-1/3" onClick={() => copyLinkToClipboard()}>Copy Link</button>

        </div>
        <div className="w-3/5 flex flex-col items-center justify-evenly">
          <div className="h-1/4 w-1/2 border-red border-2 flex flex-row justify-evenly items-end">
            {userDistribution[0]?.map((u) => <div className="flex flex-col items-center"><div className={u.selectedCard ? "card shown" : u.cardSelected ? "card selected" : "card"}>{u.selectedCard ? <p>{u.selectedCard}</p> : <p></p>}</div><p>{u.name}</p></div>)}
          </div>
          <div className="flex flex-row h-1/3 w-full justify-evenly">
            <div className="h-full w-1/5 border-white border-2 flex flex-col items-center justify-evenly">
              {userDistribution[3]?.map((u) => <div className="flex flex-col items-center"><div className={u.selectedCard ? "card shown" : u.cardSelected ? "card selected" : "card"}>{u.selectedCard ? <p>{u.selectedCard}</p> : <p></p>}</div><p>{u.name}</p></div>)}
            </div>
            <div className="border-white border-2 w-1/2 h-full rounded-xl flex flex-col items-center justify-center">
              {users.find(u => u.id === user.id)?.roles.includes(Role.ADMIN) ? <>
                <button onClick={showCards} className="btn m-4">Show Cards</button>
                <button onClick={resetCards} className="btn">Reset Cards</button>
              </> : <><p>{state === LobbyState.VOTING ? "Waiting for all Players to vote" : "Waiting for an admin to start the next round"}</p></>}
            </div>
            <div className="h-full w-1/5 border-white border-2 flex flex-col items-center justify-evenly">
              {userDistribution[1]?.map((u) => <div className="flex flex-col items-center"><div className={u.selectedCard ? "card shown" : u.cardSelected ? "card selected" : "card"}>{u.selectedCard ? <p>{u.selectedCard}</p> : <p></p>}</div><p>{u.name}</p></div>)}

            </div>
          </div>
          <div className="h-1/4 w-1/2 border-red border-2 flex flex-row justify-evenly">
            {userDistribution[2]?.map((u) => <div className="flex flex-col items-center"><div className={u.selectedCard ? "card shown" : u.cardSelected ? "card selected" : "card"}>{u.selectedCard ? <p>{u.selectedCard}</p> : <p></p>}</div><p>{u.name}</p></div>)}
          </div>
        </div>
        <div className="w-1/5 flex flex-col items-center">
          <div className="flex flex-col border-white border-2 w-2/3">
            <h1 className="text-center m-4">Connected</h1>
            {users.map((user) => (
              <div key={user.id} className="m-4 mt-0 flex flex-row justify-evenly">
                <p>{user.roles.includes(Role.PLAYER) ? "P" : "O"}</p>
                <p>{user.name}</p>
                <p>{user.selectedCard ? user.selectedCard : user.cardSelected ? "!" : user.roles.includes(Role.PLAYER) ? "?" : ""}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-around items-center h-[15.5vh] ml-[20vw] mr-[20vw] overflow-hidden">
        {cardCollection.map((card) => (
          <div className={(selectedCard() === card ? "selected" : "") + " selectableCard"} onClick={() => selectCard(card)} key={card}>
            <p>{card}</p>
          </div>
        ))}
      </div>
    </>
  );
}
