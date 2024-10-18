"use client";

import { v4 as uuidv4 } from "uuid";
import { Role, roleFromString } from "@/model/Role";
import { User } from "@/model/User";
import { useEffect, useState } from "react";
import LobbyScreen from "./lobby";
import { useRouter } from "next/navigation";
import Headline from "./headline";
import Footer from "../footer";

export default function Page({ params }: { params: { slug: string } }) {

  const [user, setUser] = useState<User | undefined>(undefined);
  const [lobbyInformation, setLobbyInformation] = useState<{ lobbyName: string }>({ lobbyName: "" });

  const router = useRouter()

  let baseUrl = ""
  if (process.env.NEXT_PUBLIC_CUSTOM_URL !== undefined) {
    baseUrl = process.env.NEXT_PUBLIC_CUSTOM_URL
  }

  useEffect(() => {
    async function fetchLobbyInformation() {
      const res = await fetch(
        baseUrl + "/api/management/lobbyInformation/" + params.slug,
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
        <Headline lobbyName={lobbyInformation.lobbyName} leaveAction={() => router.push("/")} userName={undefined} />
        <div className="flex flex-col items-center h-[91vh] justify-center" data-testid="lobby-join">
          <h1>Enter your name</h1>
          <form
            action={(formData: FormData) => setUser({ id: uuidv4(), name: formData.get("name")?.toString() || "", cardSelected: false, selectedCard: undefined, roles: [roleFromString(formData.get("role")?.toString() || "")] })}
            className="flex flex-col items-center m-4"
          >

            <input name="name" type="text" placeholder="Name" className="input" />
            <p className="m-4">Select your role</p>
            <select name="role" className="input">
              {Object.values(Role)
                .filter(role => role !== Role.ADMIN)
                .map(role => <option key={role} value={role} className="text-black dark:text-white">{titleCase(role)}</option>)}
            </select>
            <button className="btn mt-4" type="submit">Join</button>
          </form>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <LobbyScreen lobbyId={params.slug} user={user} data-testid="lobby-screen" />
  )
}
