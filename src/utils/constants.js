export const ENV = {
    API_URL: "http://localhost:3000",
    //http://localhost:3000
    //https://lizard-server.vercel.app
        ENDPOINTS:{
            LOGIN:'api/auth/signin',
            REGISTER:'api/auth/signup',
            USER:'api/users',
            ADMISION: 'api/admision',
            DELETE: 'api/admision',
            UPDATE: 'api/admision',
            ROLES: 'api/roles',
            PROFESORES:'api/profesores',
            OFERTAEDUCATIVA: 'api/oferta',
            OFERTAS_RELACIONADAS: 'api/admision/:id/ofertas',
        },
        STORAGE: {
            TOKEN: "token",
        }
    }