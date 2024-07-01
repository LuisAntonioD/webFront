    //Recibe el argumento que se utiliza para obtener el valor de un campo específico del formulario
    export const validatePassword = ({ getFieldValue }) => ({
        validator(_, value) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('Las contraseñas no coinciden'));
        }
    });