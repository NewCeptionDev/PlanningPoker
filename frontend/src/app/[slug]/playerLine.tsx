import { User } from "@/model/User"
import { socket } from "@/socket"

export default function PlayerLine({
  user,
  lobbyId,
  userIsAdmin
}: {
  user: User,
  lobbyId: string,
  userIsAdmin: boolean
}) {

  function removeUserFromLobby(userId: string) {
    socket.emit('removePlayer', { lobbyId: lobbyId, userId: userId })
  }

  return <div
    key={user.id}
    className={user.roles.length > 0 ? 'flex flex-row items-center mb-1' : 'mb-3'}
  >
    <div className={userIsAdmin ? 'w-2/3 flex flex-row justify-between' : 'w-full flex flex-row justify-between'}>

      <p>{user.name}</p>
      <p>{user.selectedCard}</p>
    </div>
    {userIsAdmin && user.roles.length > 0 ?
      <div className='w-1/3 flex flex-row justify-end'>
        <button className='btn px-1 py-0' onClick={() => removeUserFromLobby(user.id)}>X</button>
      </div> : <></>}
  </div >

}
