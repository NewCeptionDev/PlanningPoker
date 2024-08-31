"use client";

import { Role, roleFromString } from "@/model/Role";
import { User } from "@/model/User";
import { socket } from "@/socket";
import { useEffect, useState } from "react";
import LobbyScreen from "./lobby";

export default function Page({ params }: { params: { slug: string } }) {

  const [user, setUser] = useState<User | undefined>(undefined);
  const [lobbyInformation, setLobbyInformation] = useState<{ lobbyName: string }>({ lobbyName: "" });

  useEffect(() => {
    async function fetchLobbyInformation() {
      const res = await fetch(
        "http://localhost:3000/management/lobbyInformation/" + params.slug,
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

  if (!user) {
    return (
      <>
        <div className="flex flex-row h-[3vh] justify-between m-4">
          <h2>Planning Poker</h2>
          <h3>{lobbyInformation.lobbyName}</h3>
          <div>
            <p></p>
            <button className="btn">Leave</button>
          </div>
        </div>
        <div className="flex flex-col items-center h-[96vh] justify-center">
          <h1>Enter Name</h1>
          <form
            action={(formData: FormData) => setUser({ id: window.crypto.randomUUID(), name: formData.get("name")?.toString() || "", cardSelected: false, selectedCard: undefined, roles: [roleFromString(formData.get("role")?.toString() || "")] })}
            className="flex flex-col items-center m-4"
          >
            <input name="name" type="text" placeholder="Name" />
            <select name="role">
              {Object.values(Role).filter(role => role !== Role.ADMIN.toString()).map(role => <option key={role} value={role} className="text-black">{role}</option>)}
            </select>
            <button className="btn mt-4" type="submit">Join</button>
          </form>
        </div>
      </>
    )
  }

  return (
    <LobbyScreen lobbyId={params.slug} user={user} />
  )
}
