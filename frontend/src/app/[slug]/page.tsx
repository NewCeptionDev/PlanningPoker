"use client";

import { Role, roleFromString } from "@/model/Role";
import { User } from "@/model/User";
import { useEffect, useState } from "react";
import LobbyScreen from "./lobby";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "../themeswitcher";

export default function Page({ params }: { params: { slug: string } }) {

  const [user, setUser] = useState<User | undefined>(undefined);
  const [lobbyInformation, setLobbyInformation] = useState<{ lobbyName: string }>({ lobbyName: "" });

  const router = useRouter()

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

      if (!data.lobbyExists) {
        router.push("/")
      }

      setLobbyInformation(data);
    }
    fetchLobbyInformation();
  }, [])

  function titleCase(str: string) {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  if (!user) {
    return (
      <>
        <div className="flex flex-row h-[3.5vh] justify-between m-4">
          <h2 className="w-1/3 cursor-pointer" onClick={() => router.push("/")}>Planning Poker</h2>
          <h3 className="w-1/3 text-center">{lobbyInformation.lobbyName}</h3>
          <div className="flex flex-row justify-end w-1/3">
            <ThemeSwitcher />
            <p></p>
            <button className="btn" onClick={() => router.push("/")}>Leave</button>
          </div>
        </div >
        <div className="flex flex-col items-center h-[90vh] justify-center">
          <h1>Enter your name</h1>
          <form
            action={(formData: FormData) => setUser({ id: window.crypto.randomUUID(), name: formData.get("name")?.toString() || "", cardSelected: false, selectedCard: undefined, roles: [roleFromString(formData.get("role")?.toString() || "")] })}
            className="flex flex-col items-center m-4"
          >

            <input name="name" type="text" placeholder="Name" className="input" />
            <p className="m-4">Select your role</p>
            <select name="role" className="input">
              {Object.values(Role)
                .filter(role => role !== Role.ADMIN)
                .map(role => <option key={role} value={role} className="text-black">{titleCase(role)}</option>)}
            </select>
            <button className="btn mt-4" type="submit">Join</button>
          </form>
        </div>
        <div className="flex flex-row justify-center h-[2vh]">
          <p>Made by <a href="https://newception.dev">@NewCeption</a></p>
        </div>
      </>
    )
  }

  return (
    <LobbyScreen lobbyId={params.slug} user={user} />
  )
}
