import React from 'react'
import PlaceListCard from '../places/PlaceListCard.jsx';


const Reccomendation = ({place}) => {
  return (
    <div>
        <PlaceListCard key={place.id} place={place} />
    </div>
  )
}

export default Reccomendation