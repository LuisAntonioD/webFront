import React from 'react';
import LayoutComponent from '../../layout';
import FormLogin from '../../FormLogin';
import ImageLogin from '../../ImageLogin';

const Login = () => {
    return (
        <LayoutComponent
            leftColSize={{ xs: 24, sm: 24, md: 8, lg: 8 }}
            rightColSize={{ xs: 24, sm: 24, md: 16, lg: 16 }}
            leftContent={<ImageLogin />}
            rightContent={<FormLogin />}
        />
    );
};

export default Login;
