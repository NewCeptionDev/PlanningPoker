export default function Layout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  let lobbyName = ""
  let userName = ""

  function setLobbyName() { lobbyName = lobbyName }
  function setUserName() { userName = userName }

  return (
    <>
      {children}

    </>
  )
}
