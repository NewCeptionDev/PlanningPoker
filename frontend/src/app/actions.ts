"use server";

import { redirect } from "next/navigation";

export async function createLobby() {
  const response = await fetch(
    "http://localhost:3000/management/createNewLobby",
    {
      method: "POST",
    },
  ).then((res) => res.json());
  // TODO check that id is unique
  // TODO create lobby with id and settings

  if (!response.lobbyId) {
    console.error("Failed to create lobby");
    return;
  }
  redirect(`/${response.lobbyId}`);
}
