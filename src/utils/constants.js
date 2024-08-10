export const ENV = {
    API_URL: "https://lizard-server.vercel.app",
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
            CURSOS: 'api/cursos',
        },
        STORAGE: {
            TOKEN: "token",
        }
    }