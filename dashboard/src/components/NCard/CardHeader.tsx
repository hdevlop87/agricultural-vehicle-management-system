import React from 'react'
import { CardFilters } from './CardFilters'
import { CardAddButton } from './CardAddButton'
import { CardSort } from './CardSort'

const CardHeader = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <CardFilters />
      <div className='flex gap-2 items-center'>
        <CardSort />
        <CardAddButton />
      </div>
    </div>
  )
}

export default CardHeader