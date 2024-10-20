'use client'

import ThemeSwitcher from '../themeswitcher'
import Image from 'next/image'

export default function Headline({
  lobbyName,
  userName,
  leaveAction,
}: {
  lobbyName: string
  userName: string | undefined
  leaveAction: () => void
}) {
  return (
    <div className='flex flex-row h-[5vh] justify-between p-4 secondary'>
      <div className='w-1/5 flex items-center'>
        <div
          className='flex flex-row cursor-pointer'
          onClick={leaveAction}
        >
          <Image
            src='/logo.png'
            width={16}
            height={21}
            alt='logo'
            className='mr-4'
            data-testid='logo'
          />
          <h1
            className='text-white'
            data-testid='headline'
          >
            Planning Poker
          </h1>
        </div>
      </div>
      <div className='w-3/5 flex items-center justify-center'>
        <h1
          className='text-white'
          data-testid='lobby-name'
        >
          {lobbyName}
        </h1>
      </div>
      <div className='flex flex-row justify-end w-1/5 items-center'>
        {userName ? <h3 className='text-white mr-8 ml-8'>{userName}</h3> : <></>}
        <ThemeSwitcher data-testid='theme-switcher' />
        <button
          className='btn ml-8'
          onClick={leaveAction}
        >
          Leave
        </button>
      </div>
    </div>
  )
}
