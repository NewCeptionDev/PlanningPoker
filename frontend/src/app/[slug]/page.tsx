"use client";

import { socket } from "@/socket";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { slug: string } }) {

  useEffect(() => {
    socket.connect();
    socket.emit("joinLobby", { lobbyId: params.slug });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>{params.slug}</h1>
    </div>
  );
}
