import { Lobby } from '@/model/lobby'
import { LobbyState } from '@/model/LobbyState'
import { Role } from '@/model/Role'
import { User } from '@/model/User'
import { socket } from '@/socket'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Headline from './headline'
import CardDisplayArea from './cardDisplayArea'
import PlayerLine from './playerLine'

export default function LobbyScreen({ lobbyId, user }: { lobbyId: string; user: User }) {
  const [users, setUsers] = useState<User[]>([])
  const [cardCollection, setCardCollection] = useState<string[]>([])
  const [state, setState] = useState<LobbyState>(LobbyState.OVERVIEW)
  const [lobbyInformation, setLobbyInformation] = useState({ lobbyName: '' })
  const [userDistribution, setUserDistribution] = useState<User[][]>([])

  const router = useRouter()

  let baseUrl = ''
  if (process.env.NEXT_PUBLIC_CUSTOM_URL !== undefined) {
    baseUrl = process.env.NEXT_PUBLIC_CUSTOM_URL
  }

  useEffect(() => {
    socket.connect()
    socket.emit('joinLobby', {
      lobbyId: lobbyId,
      userId: user.id,
      name: user.name,
      role: user.roles[0],
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    socket.on('fullLobbyInformation', (lobby: Lobby) => {
      setUsers(lobby.users)
      setCardCollection(lobby.cardCollection)
      setState(lobby.state)
      distributePlayers(lobby.users.filter((u) => u.roles.includes(Role.PLAYER)))
    })

    socket.on('kicked', () => {
      router.push('/')
    })

    return () => {
      socket.off('fullLobbyInformation')
    }
  }, [users, cardCollection, state, userDistribution])

  useEffect(() => {
    async function fetchLobbyInformation() {
      const res = await fetch(baseUrl + '/api/management/lobbyInformation/' + lobbyId, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        method: 'GET',
      })
      const data = await res.json()
      setLobbyInformation(data)
    }
    fetchLobbyInformation()
  }, [])

  function selectCard(card: string) {
    if (users.find((u) => u.id === user.id)?.selectedCard === card) {
      socket.emit('selectCard', { lobbyId: lobbyId, cardValue: undefined })
      return
    }
    socket.emit('selectCard', { lobbyId: lobbyId, cardValue: card })
  }

  function showCards() {
    socket.emit('showCards', { lobbyId: lobbyId })
  }

  function resetCards() {
    socket.emit('reset', { lobbyId: lobbyId })
  }

  function leaveLobby() {
    socket.emit('leaveLobby', { lobbyId: lobbyId })
    router.push('/')
  }

  function selectedCard() {
    return users.find((u) => u.id === user.id)?.selectedCard
  }

  function copyLinkToClipboard() {
    navigator.clipboard.writeText(window.location.href)
  }

  function distributePlayers(userList: User[]) {
    const distribution: User[][] = [[], [], [], []]
    for (let i = 0; i < userList.length; i++) {
      distribution[i % 4]!.push(userList[i])
    }
    setUserDistribution(distribution)
  }

  function getPlayersSortedByVoting(): User[] {
    const sorted = users
      .filter((u) => u.roles.includes(Role.PLAYER))
      .sort(
        (a, b) => getActualNumberOrMaxInt(a.selectedCard) - getActualNumberOrMaxInt(b.selectedCard),
      )

    return addEmptyUsersAsVisualDividers(sorted)
  }

  function addEmptyUsersAsVisualDividers(users: User[]) {
    const withEmpty: User[] = []
    let emptyCount = 0

    for (let i = 0; i < users.length; i++) {
      withEmpty.push(users[i])
      if (
        i < users.length - 1 &&
        getActualNumberOrMaxInt(users[i].selectedCard) !==
        getActualNumberOrMaxInt(users[i + 1]?.selectedCard)
      ) {
        withEmpty.push({
          id: emptyCount.toString(),
          name: '',
          cardSelected: false,
          selectedCard: undefined,
          roles: [],
        })
        emptyCount++
      }
    }

    return withEmpty
  }

  function getActualNumberOrMaxInt(value?: string): number {
    return value && !isNaN(Number(value)) ? Number(value) : Number.MAX_SAFE_INTEGER
  }

  return (
    <>
      <Headline
        lobbyName={lobbyInformation.lobbyName}
        userName={user.name}
        leaveAction={() => leaveLobby()}
      />
      <div className='flex flex-row h-[79vh] w-full'>
        <div
          className='w-1/5 flex flex-col m-8'
          data-testid='lobby-info'
        >
          <button
            className='btn w-3/4 mb-4'
            onClick={() => copyLinkToClipboard()}
          >
            Copy Invite Link
          </button>
          <h1>
            <b>Lobby:</b> {lobbyInformation.lobbyName}
          </h1>
          <h3>
            <b>Id:</b> {lobbyId}
          </h3>
        </div>
        <div
          className='w-3/5 flex flex-col items-center justify-evenly'
          data-testid='lobby-players'
        >
          <CardDisplayArea
            horizontal={true}
            users={userDistribution[0]}
            lobbyState={state}
          />
          <div className='flex flex-row h-1/3 w-full justify-evenly'>
            <CardDisplayArea
              horizontal={false}
              users={userDistribution[3]}
              lobbyState={state}
            />
            <div className='border-4 w-1/2 h-full rounded-xl flex flex-col items-center justify-center border-secondary'>
              {users.find((u) => u.id === user.id)?.roles.includes(Role.ADMIN) ? (
                <>
                  {state === LobbyState.VOTING ? (
                    <button
                      onClick={showCards}
                      className='btn m-4'
                    >
                      Show Cards
                    </button>
                  ) : (
                    <></>
                  )}
                  <button
                    onClick={resetCards}
                    className='btn'
                  >
                    {state === LobbyState.VOTING ? 'Reset Cards' : 'Next Round'}
                  </button>
                </>
              ) : (
                <>
                  <p className='text-center'>
                    {state === LobbyState.VOTING
                      ? users.find((u) => u.id === user.id)?.selectedCard
                        ? 'Waiting for all Players to vote'
                        : 'Select a card to cast your vote'
                      : 'Waiting for an admin to start the next round'}
                  </p>
                </>
              )}
            </div>
            <CardDisplayArea
              horizontal={false}
              users={userDistribution[1]}
              lobbyState={state}
            />
          </div>
          <CardDisplayArea
            horizontal={true}
            users={userDistribution[2]}
            lobbyState={state}
          />
        </div>
        <div className='w-1/5 flex flex-col items-center'>
          <div
            className='flex flex-col w-2/3'
            data-testid='lobby-users'
          >
            <h1 className='text-center m-4'>
              <b>Connected Users</b>
            </h1>
            {users.filter((u) => u.roles.includes(Role.PLAYER)).length > 0 ? (
              <>
                <p className='mb-2'>
                  <b>Player</b>
                </p>
                {state === LobbyState.OVERVIEW
                  ? getPlayersSortedByVoting().map((u) => (
                    <PlayerLine user={u} lobbyId={lobbyId} client={users.find((u) => u.id === user.id)} key={u.id} />
                  ))
                  : users
                    .filter((u) => u.roles.includes(Role.PLAYER))
                    .map((u) => (
                      <PlayerLine user={u} lobbyId={lobbyId} client={users.find((u) => u.id === user.id)} key={u.id} />
                    ))}
              </>
            ) : (
              <></>
            )}

            {users.filter((u) => u.roles.includes(Role.OBSERVER)).length > 0 ? (
              <>
                <p className='mb-2 mt-6'>
                  <b>Observer</b>
                </p>
                {users
                  .filter((u) => u.roles.includes(Role.OBSERVER))
                  .map((u) => (
                    <p key={u.id}>{u.name}</p>
                  ))}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <div
        className='flex flex-row justify-around items-center h-[16vh] ml-[5vw] mr-[5vw] overflow-hidden'
        data-testid='card-collection'
      >
        {users.find((u) => u.id === user.id)?.roles.includes(Role.PLAYER) ? (
          cardCollection.map((card) => (
            <div
              className={(selectedCard() === card ? 'selected' : '') + ' selectableCard'}
              onClick={() => selectCard(card)}
              key={card}
            >
              <p className='text-2xl'>{card}</p>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </>
  )
}
