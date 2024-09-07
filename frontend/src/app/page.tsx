"use client";

import Image from "next/image";
import { createLobby, joinLobby } from "./actions";
import ThemeSwitcher from "./themeswitcher";

export default function Home() {
  return (
    <main className="h-screen">
      <div className="flex flex-row justify-evenly items-center h-[30vh]">
        <div className="w-1/5 m-8"></div>
        <div className="w-3/5 flex flex-col items-center justify-center">
          <Image src="/logo_large.png" width={100} height={100} alt="logo" />
          <h1 className="text-6xl text-center">Planning<br />Poker</h1>
        </div>
        <div className="w-1/5 flex justify-end m-8 self-start">
          <ThemeSwitcher />
        </div>
      </div>
      <div id="content" className="flex flex-col justify-center align-middle h-[66vh]">

        <div id="lobby-join" className="flex flex-col items-center">
          <h1 className="mb-4">Enter a Lobby Code</h1>
          <form action={joinLobby} className="flex flex-col items-center">
            <input name="lobbyId" type="text" placeholder="Lobby ID" className="input" />
            <button id="lobby-join-button" className="btn" type="submit">Join</button>
          </form>
        </div>
        <div id="spacer" className="w-1/3 h-0.5 self-center m-4 secondary">
        </div>
        <div id="lobby-create" className="flex flex-col items-center">
          <h1 className="mb-4">Create a new Lobby</h1>
          <form action={createLobby} className="flex flex-col items-center">
            <input name="lobbyName" type="text" placeholder="Lobby Name" className="input" />
            <button id="lobby-create-button" type="submit" className="btn">Create</button>
          </form>
        </div>
      </div>
      <div className="flex flex-row justify-center h-[2vh]">
        <p>Made by <a href="https://newception.dev">@NewCeption</a></p>
      </div>
    </main>
  );
}
