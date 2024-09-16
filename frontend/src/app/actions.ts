"use server";

import { redirect } from "next/navigation";
import { cardGroupSelection } from "./cardGroups";

let baseUrl = "http://localhost/api";
if (process.env.NEXT_PUBLIC_CUSTOM_URL !== undefined) {
  baseUrl = process.env.NEXT_PUBLIC_CUSTOM_URL + "/api";
}

export async function createLobby(formData: FormData) {
  const lobbyName = formData.get("lobbyName")?.toString();
  const selectedCardGroup = formData.get("cardGroup")?.toString();
  const customCards = formData.get("customCards")?.toString().split(",");

  const response = await fetch(baseUrl + "/management/createNewLobby", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      lobbyName: lobbyName,
      availableCards:
        selectedCardGroup === "Custom"
          ? getUniqueValues(customCards!)
          : cardGroupSelection.get(selectedCardGroup!),
    }),
  }).then((res) => res.json());

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

  const response = await fetch(baseUrl + "/management/existsLobby/" + lobbyId, {
    method: "GET",
  }).then((res) => res.json());

  if (response.exists) {
    redirect(`/${lobbyId}`);
  }

  console.log(response);
  console.log("Failed to join lobby");
}

export async function fetchLobbyInformation(lobbyId: string): Promise<any> {
  return fetch(baseUrl + "/lobbyInformation/" + lobbyId, {
    method: "GET",
  });
}

function getUniqueValues(arr: string[]) {
  const uniqueValues = new Set(arr);
  return Array.from(uniqueValues);
}
