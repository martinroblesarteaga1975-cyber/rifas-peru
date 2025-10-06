import React from 'react';

const HeroImage = () => {
  return (
    <div className='flex justify-center items-center w-full'>
      <img 
        src='/banner_rifasencico.jpg' 
        alt='Rifas Encico - Gana premios increíbles' 
        className='w-full max-w-6xl h-auto rounded-lg shadow-xl'
      />
    </div>
  );
};

export default HeroImage;
