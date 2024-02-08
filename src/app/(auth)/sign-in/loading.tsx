import Dnaspinner from '@/components/loadingui/Dnaspinner'
import React from 'react'

const loading = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
        <Dnaspinner/>
    </div>
  )
}

export default loading