export const ENV = {
    API_URL: "https://web-app-seven-pink.vercel.app",
    //http://localhost:3000
    //https://lizard-server.vercel.app
    //https://lizard-server.vercel.app
    //hola
    ENDPOINTS: {
        LOGIN: 'api/auth/signin',
        REGISTER: 'api/auth/signup',
        USER: 'api/users',
        ADMISION: 'api/admision',
        DELETE: 'api/admision',
        UPDATE: 'api/admision',
        ROLES: 'api/roles',
        PROFESORES: 'api/profesores',
        OFERTAEDUCATIVA: 'api/oferta',
        OFERTAS_RELACIONADAS: 'api/admision/:id/ofertas',
        MATERIAS: 'api/materias',
        CURSOS: 'api/cursos',
        HORARIOS: 'api/fechas',
    },
    STORAGE: {
        TOKEN: "token",
    }
}
