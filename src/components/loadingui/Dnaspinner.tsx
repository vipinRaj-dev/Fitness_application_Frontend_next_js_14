"use client";

import { DNA } from 'react-loader-spinner'    
const Dnaspinner = () => {
  return (
    <div className='h-screen flex justify-center items-center'>
      <DNA
    visible={true}
    height="80"
    width="80"
    ariaLabel="dna-loading"
    wrapperStyle={{}}
    wrapperClass="dna-wrapper"
    />
    </div>
  )
}

export default Dnaspinner