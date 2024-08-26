import { createLobby } from "./actions";

export default function Home() {
  return (
    <main className="h-screen">
      <h1 className="text-center text-5xl h-1/6">Planning Poker</h1>
      <div id="content" className="flex flex-col justify-center align-middle h-5/6">

        <div id="lobby-join" className="flex flex-col items-center">
          <input id="lobby-join-input" type="text" placeholder="Lobby ID" />
          <button id="lobby-join-button" className="btn btn-blue">Join</button>
        </div>
        <div id="spacer" className="bg-white w-1/2 h-0.5 self-center">
        </div>
        <div id="lobby-create" className="flex flex-col items-center">
          <form action={createLobby}>

            <button id="lobby-create-button" type="submit" className="btn btn-blue">Create</button>
          </form>
        </div>
      </div>
    </main>
  );
}