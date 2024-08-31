"use client";

import { Role, roleFromString } from "@/model/Role";
import { User } from "@/model/User";
import { socket } from "@/socket";
import { useState } from "react";
import LobbyScreen from "./lobby";

export default function Page({ params }: { params: { slug: string } }) {

  const [user, setUser] = useState<User | undefined>(undefined);

  if (!user) {
    return (
      <div className="flex flex-col items-center h-[100vh] justify-center">
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
        <button className="btn" onClick={() => { setUser(undefined); socket.disconnect() }}>Leave</button>
      </div>
    )
  }

  return (
    <LobbyScreen lobbyId={params.slug} user={user} />
  )
}
