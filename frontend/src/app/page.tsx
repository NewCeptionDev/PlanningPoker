import { createLobby, joinLobby } from "./actions";

export default function Home() {
  return (
    <main className="h-screen">
      <div className="flex flex-col justify-center items-center h-[10vh]">

        <h1 className="text-5xl">Planning Poker</h1>
      </div>
      <div id="content" className="flex flex-col justify-center align-middle h-[90vh]">

        <div id="lobby-join" className="flex flex-col items-center">
          <form action={joinLobby} className="flex flex-col items-center">
            <input name="lobbyId" type="text" placeholder="Lobby ID" className="mb-4" />
            <button id="lobby-join-button" className="btn" type="submit">Join</button>
          </form>
        </div>
        <div id="spacer" className="bg-white w-1/2 h-0.5 self-center m-4">
        </div>
        <div id="lobby-create" className="flex flex-col items-center">
          <form action={createLobby}>

            <button id="lobby-create-button" type="submit" className="btn">Create</button>
          </form>
        </div>
      </div>
    </main>
  );
}
