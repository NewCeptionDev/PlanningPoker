import { LobbyState } from '@/model/LobbyState'
import { User } from '@/model/User'

export default function CardDisplayArea({
  horizontal,
  users,
  lobbyState,
}: {
  horizontal: boolean
  users: User[]
  lobbyState: LobbyState
}) {
  const horizontalClassRules = 'h-1/4 w-1/2 flex flex-row justify-evenly items-end'
  const verticalClassRules = 'h-full w-1/5 flex flex-col items-center justify-evenly'

  const cssRules = horizontal ? horizontalClassRules : verticalClassRules

  return (
    <div className={cssRules}>
      {users?.map((u) => (
        <div
          key={u.id}
          className='flex flex-col items-center'
        >
          <div
            className={
              lobbyState === LobbyState.OVERVIEW
                ? 'card shown'
                : u.cardSelected
                  ? 'card selected'
                  : 'card'
            }
          >
            {lobbyState === LobbyState.OVERVIEW ? <p>{u.selectedCard}</p> : <p></p>}
          </div>
          <p>{u.name}</p>
        </div>
      ))}
    </div>
  )
}
