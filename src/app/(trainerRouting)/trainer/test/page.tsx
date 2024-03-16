"use client";
import React from 'react'

const page = () => {
    const arr = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10]]
    
  return (
    <div>
        {
            arr.map((item, index) => {
                return (
                    <div key={index} onClick={() => {
                        console.log(item)
                    }}>
                        {item}
                    </div>
                )
            })
        }
    </div>
  )
}

export default page