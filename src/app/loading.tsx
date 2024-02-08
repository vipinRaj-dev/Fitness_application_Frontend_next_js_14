import Spinner from '@/components/loadingui/Spinner'
import React from 'react'

const loading = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
        <Spinner/>
    </div>
  )
}

export default loading