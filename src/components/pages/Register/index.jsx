import React from 'react';
import LayoutComponent from '../../layout';
import FormRegister from '../../FormRegister';
import ImageLogin from '../../ImageLogin'

const Register = () => {
    return (
        <LayoutComponent
        leftColSize={{ xs: 24, sm: 24, md: 8, lg: 8 }}
        rightColSize={{ xs: 24, sm: 24, md: 16, lg: 16 }}
        leftContent={<ImageLogin />}
        rightContent={<FormRegister />}
      />
    );
};

export default Register;