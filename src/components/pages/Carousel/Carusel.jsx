import React from 'react';
import { Carousel } from 'antd';
import an from '../../../assets/an.png';
import bn from '../../../assets/bn.png';
import cn from '../../../assets/cn.png';
import dn from '../../../assets/dn.png';

const contentStyle = {
  height: '260px',
  textAlign: 'center',
  background: '#364d79',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const imageStyle = {
  maxWidth: '100%',
  maxHeight: '100%',
};

const Carrousel = () => (
  <Carousel autoplay>
    <div>
      <div style={contentStyle}>
        <img src={an} alt="Slide 1" style={imageStyle} />
      </div>
    </div>
    <div>
      <div style={contentStyle}>
        <img src={bn} alt="Slide 2" style={imageStyle} />
      </div>
    </div>
    <div>
      <div style={contentStyle}>
        <img src={cn} alt="Slide 3" style={imageStyle} />
      </div>
    </div>
    <div>
      <div style={contentStyle}>
        <img src={dn} alt="Slide 4" style={imageStyle} />
      </div>
    </div>
  </Carousel>
);

export default Carrousel;
