import { Role } from "@/model/Role"
import { User } from "@/model/User"
import { socket } from "@/socket"

export default function PlayerLine({
  user,
  lobbyId,
  client
}: {
  user: User,
  lobbyId: string,
  client: User | undefined
}) {

  function removeUserFromLobby(userId: string) {
    socket.emit('removePlayer', { lobbyId: lobbyId, userId: userId })
  }

  return <div
    key={user.id}
    className={user.roles.length > 0 ? 'flex flex-row items-center mb-1' : 'mb-3'}
  >
    <div className={client && client.roles.includes(Role.ADMIN) ? 'w-2/3 flex flex-row justify-between' : 'w-full flex flex-row justify-between'}>

      <p>{user.name}</p>
      <p>{user.selectedCard}</p>
    </div>
    {client && client.roles.includes(Role.ADMIN) && user.roles.length > 0 && user.id !== client.id ?
      <div className='w-1/3 flex flex-row justify-end'>
        <button className='btn px-1 py-0' onClick={() => removeUserFromLobby(user.id)}>X</button>
      </div> : <></>}
  </div >

}
