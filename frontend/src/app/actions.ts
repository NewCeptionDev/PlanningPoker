"use server";

import { redirect } from "next/navigation";

export async function createLobby() {
  const response = await fetch(
    "http://localhost:3000/management/createNewLobby",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({lobbyName: "Random Lobby Name"}),
    },
  ).then((res) => res.json());

  if (!response.lobbyId) {
    console.error("Failed to create lobby");
    return;
  }
  redirect(`/${response.lobbyId}`);
}

export async function joinLobby(formData: FormData) {
  const lobbyId = formData.get("lobbyId")?.toString();

  if (!lobbyId) {
    console.error("No lobbyId given");
    return;
  }

  const response = await fetch(
    "http://localhost:3000/management/existsLobby/" + lobbyId,
    {
      method: "GET",
    },
  ).then((res) => res.json());

  if (response.exists) {
    redirect(`/${lobbyId}`);
  }

  console.log(response);
  console.log("Failed to join lobby");
}

export async function fetchLobbyInformation(lobbyId: string): Promise<any> {
  return fetch(
    "http://localhost:3000/management/lobbyInformation/" + lobbyId,
    {
      method: "GET",
    },
  );
}
