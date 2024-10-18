"use client";

import Image from "next/image";
import { createLobby, joinLobby } from "./actions";
import ThemeSwitcher from "./themeswitcher";
import { useState } from "react";
import { cardGroupSelection } from "./cardGroups";
import Footer from "./footer";

export default function Home() {

  const [selectedCardGroup, setSelectedCardGroup] = useState("Simple");

  return (
    <main className="h-screen light-bg dark:dark-bg">
      <div className="flex flex-row justify-evenly items-center h-[30vh]">
        <div className="w-1/5 m-8"></div>
        <div className="w-3/5 flex flex-col items-center justify-center">
          <Image src="/logo_large.png" width={100} height={100} alt="logo" data-testid="logo" />
          <h1 className="text-6xl text-center" data-testid="headline">Planning<br />Poker</h1>
        </div>
        <div className="w-1/5 flex justify-end m-8 self-start">
          <ThemeSwitcher data-testid="theme-switcher" />
        </div>
      </div>
      <div id="content" className="flex flex-col justify-center items-center h-[66vh]">

        <div id="lobby-join" className="flex flex-col items-center" data-testid="lobby-join">
          <h1 className="mb-4">Enter a Lobby Code</h1>
          <form action={joinLobby} className="flex flex-col items-center">
            <input name="lobbyId" type="text" placeholder="Lobby ID" className="input" />
            <button id="lobby-join-button" className="btn" type="submit">Join</button>
          </form>
        </div>
        <div id="spacer" className="w-1/3 h-0.5 self-center m-8 secondary">
        </div>
        <div id="lobby-create" className="flex flex-col items-center justify-center w-1/4" data-testid="lobby-create">
          <h1 className="mb-4">Create a new Lobby</h1>
          <form action={createLobby} className="flex flex-col items-center">
            <input name="lobbyName" type="text" placeholder="Lobby Name" className="input" />
            <p className="mb-2">Select the Cards to be used</p>
            <select id="cardGroupSelect" name="cardGroup" className="input flex" onChange={(e) => setSelectedCardGroup(e.target.value)} data-testid="cardGroupSelect">
              {Array.from(cardGroupSelection.entries()).map(([key, value]) => <option key={key} value={key} className="w-[90%] max-w-[90%] overflow-ellipsis">{key}{value.length > 0 ? ` (${value.join(", ")})` : ""}</option>)}
            </select>
            {selectedCardGroup === "Custom" ?
              <>
                <p className="mb-2">Enter Cards (separated by ,)</p>
                <input name="customCards" type="text" placeholder="Custom Cards" className="input" data-testid="lobby-create-custom-cards" />
              </>
              : <></>
            }
            <button id="lobby-create-button" type="submit" className="btn">Create</button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}
