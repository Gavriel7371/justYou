import React from 'react';
import './ImageCard.css'; // Ensure this file exists for styles

const ImageCard = ({ image,  onClick }) => {
  return (
    <div className='imageCard' onClick={onClick}>
      <img src={image} alt="Photo" className='imageCardImage' />
    </div>
  );
};

export default ImageCard;
