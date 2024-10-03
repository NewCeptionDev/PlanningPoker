import Image from "next/image";
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

  let baseUrl = ""
  if (process.env.NEXT_PUBLIC_CUSTOM_URL !== undefined) {
    baseUrl = process.env.NEXT_PUBLIC_CUSTOM_URL
  }

  useEffect(() => {
    socket.connect()
    socket.emit("joinLobby", { lobbyId: lobbyId, userId: user.id, name: user.name, role: user.roles[0] });

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    socket.on("fullLobbyInformation", (lobby: Lobby) => {
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
        baseUrl + "/api/management/lobbyInformation/" + lobbyId,
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
    if (users.find(u => u.id === user.id)?.selectedCard === card) {
      socket.emit("selectCard", { lobbyId: lobbyId, cardValue: undefined });
      return;
    }
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
    const distribution: User[][] = [[], [], [], []]
    for (let i = 0; i < userList.length; i++) {
      distribution[i % 4]!.push(userList[i])
    }
    setUserDistribution(distribution)
  }

  function getPlayersSortedByVoting(): User[] {
    const sorted = users
      .filter((u) => u.roles.includes(Role.PLAYER))
      .sort((a, b) => getActualNumberOrMaxInt(a.selectedCard) - getActualNumberOrMaxInt(b.selectedCard));

    return addEmptyUsersAsVisualDividers(sorted);
  }

  function addEmptyUsersAsVisualDividers(users: User[]) {
    const withEmpty: User[] = []

    for (let i = 0; i < users.length; i++) {
      withEmpty.push(users[i])
      if (i < users.length - 1 && getActualNumberOrMaxInt(users[i].selectedCard) !== getActualNumberOrMaxInt(users[i + 1]?.selectedCard)) {
        withEmpty.push({ id: "", name: "", cardSelected: false, selectedCard: undefined, roles: [] })
      }
    }

    return withEmpty
  }

  function getActualNumberOrMaxInt(value?: string): number {
    return value && !isNaN(Number(value)) ? Number(value) : Number.MAX_SAFE_INTEGER;
  }

  return (
    <>
      <div className="flex flex-row h-[5vh] justify-between p-4 secondary">
        <div className="w-1/5 flex items-center" >
          <div className="flex flex-row cursor-pointer" onClick={() => leaveLobby()}>
            <Image src="/logo.png" width={16} height={21} alt="logo" className="mr-4" />
            <h1 className="text-white">Planning Poker</h1>
          </div>
        </div>
        <div className="w-3/5 flex items-center justify-center">
          <h1 className="text-white">{lobbyInformation.lobbyName}</h1>
        </div>
        <div className="flex flex-row justify-end w-1/5 items-center">
          <h3 className="text-white mr-8 ml-8">{user.name}</h3>
          <ThemeSwitcher />
          <button className="btn ml-8" onClick={() => leaveLobby()}>Leave</button>
        </div>
      </div >
      <div className="flex flex-row h-[79vh] w-full">
        <div className="w-1/5 flex flex-col m-8">
          <button className="btn w-3/4 mb-4" onClick={() => copyLinkToClipboard()}>Copy Invite Link</button>
          <h1><b>Lobby:</b> {lobbyInformation.lobbyName}</h1>
          <h3><b>Id:</b> {lobbyId}</h3>

        </div>
        <div className="w-3/5 flex flex-col items-center justify-evenly">
          <div className="h-1/4 w-1/2 flex flex-row justify-evenly items-end">
            {userDistribution[0]?.map((u) => <div key={u.id} className="flex flex-col items-center"><div className={state === LobbyState.OVERVIEW ? "card shown" : u.cardSelected ? "card selected" : "card"}>{state === LobbyState.OVERVIEW ? <p>{u.selectedCard}</p> : <p></p>}</div><p>{u.name}</p></div>)}
          </div>
          <div className="flex flex-row h-1/3 w-full justify-evenly">
            <div className="h-full w-1/5 flex flex-col items-center justify-evenly">
              {userDistribution[3]?.map((u) => <div key={u.id} className="flex flex-col items-center"><div className={state === LobbyState.OVERVIEW ? "card shown" : u.cardSelected ? "card selected" : "card"}>{state === LobbyState.OVERVIEW ? <p>{u.selectedCard}</p> : <p></p>}</div><p>{u.name}</p></div>)}
            </div>
            <div className="border-4 w-1/2 h-full rounded-xl flex flex-col items-center justify-center border-secondary">
              {users.find(u => u.id === user.id)?.roles.includes(Role.ADMIN) ? <>
                {state === LobbyState.VOTING ? <button onClick={showCards} className="btn m-4">Show Cards</button> : <></>}
                <button onClick={resetCards} className="btn">{state === LobbyState.VOTING ? "Reset Cards" : "Next Round"}</button>
              </> : <><p className="text-center">{state === LobbyState.VOTING ? "Waiting for all Players to vote" : "Waiting for an admin to start the next round"}</p></>}
            </div>
            <div className="h-full w-1/5 flex flex-col items-center justify-evenly">
              {userDistribution[1]?.map((u) => <div key={u.id} className="flex flex-col items-center"><div className={state === LobbyState.OVERVIEW ? "card shown" : u.cardSelected ? "card selected" : "card"}>{state === LobbyState.OVERVIEW ? <p>{u.selectedCard}</p> : <p></p>}</div><p>{u.name}</p></div>)}

            </div>
          </div>
          <div className="h-1/4 w-1/2 flex flex-row justify-evenly">
            {userDistribution[2]?.map((u) => <div key={u.id} className="flex flex-col items-center"><div className={state === LobbyState.OVERVIEW ? "card shown" : u.cardSelected ? "card selected" : "card"}>{state === LobbyState.OVERVIEW ? <p>{u.selectedCard}</p> : <p></p>}</div><p>{u.name}</p></div>)}
          </div>
        </div>
        <div className="w-1/5 flex flex-col items-center">
          <div className="flex flex-col w-2/3">
            <h1 className="text-center m-4"><b>Connected Users</b></h1>
            {users.filter(u => u.roles.includes(Role.PLAYER)).length > 0 ?
              <>
                <p className="mb-2"><b>Player</b></p>
                {state === LobbyState.OVERVIEW ? getPlayersSortedByVoting().map((u) => <div key={u.id} className={u.id ? "flex flex-row justify-between" : "mb-2"}>
                  <p>{u.name}</p>
                  <p>{u.selectedCard}</p>
                </div>
                ) : users.filter(u => u.roles.includes(Role.PLAYER)).map((u) => <div key={u.id} className="flex flex-row justify-between">
                  <p>{u.name}</p>
                  <p>{u.selectedCard}</p>
                </div>
                )}
              </>
              : <></>}

            {users.filter(u => u.roles.includes(Role.OBSERVER)).length > 0 ?
              <>
                <p className="mb-2 mt-6"><b>Observer</b></p>
                {users.filter(u => u.roles.includes(Role.OBSERVER)).map((u) => <p key={u.id}>{u.name}</p>)}
              </>
              : <></>}
          </div>
        </div>
      </div >
      <div className="flex flex-row justify-around items-center h-[16vh] ml-[5vw] mr-[5vw] overflow-hidden">
        {users.find(u => u.id === user.id)?.roles.includes(Role.PLAYER) ? cardCollection.map((card) => (
          <div className={(selectedCard() === card ? "selected" : "") + " selectableCard"} onClick={() => selectCard(card)} key={card}>
            <p className="text-2xl">{card}</p>
          </div>
        )) : <></>}
      </div>
    </>
  );
}
