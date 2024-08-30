"use client";

import { Role } from "@/model/Role";
import { User } from "@/model/User";
import { socket } from "@/socket";
import { useState } from "react";
import LobbyScreen from "./lobby";

export default function Page({ params }: { params: { slug: string } }) {

  const [user, setUser] = useState<User | undefined>(undefined);

  if (!user) {
    return (
      <div>
        <h1>Enter Name</h1>
        <form action={(formData: FormData) => setUser({ id: window.crypto.randomUUID(), name: formData.get("name")?.toString() || "", cardSelected: false, selectedCard: undefined, roles: [Role.PLAYER] })}>
          <input name="name" type="text" placeholder="Name" className="text-black" />
          <select name="role">
            {Object.values(Role).filter(role => role !== Role.ADMIN.toString()).map(role => <option key={role} value={role} className="text-black">{role}</option>)}
          </select>
          <button className="btn btn-blue" type="submit">Join</button>
        </form>
        <button className="btn btn-blue" onClick={() => { setUser(undefined); socket.disconnect() }}>Leave</button>
      </div>
    )
  }

  return (
    <LobbyScreen lobbyId={params.slug} user={user} />
  )
}
