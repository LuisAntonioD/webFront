import React from 'react';
import { Link } from 'react-router-dom';

import loginImage from '../../assets/api.png';

const ImageLogin = () => {
  return (
    <div>
      <img src={loginImage} alt="Login" />
      {/* Agrega un enlace a la página de productos */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link to="/productos">
          <button>Ver productos</button>
        </Link>
      </div>
    </div>
  );
};



export default ImageLogin;
