import { useNavigate } from "react-router-dom";
import DrawerComponent from '../../Drawer';


export const useMenuConfig = () => {
    const navigate = useNavigate();

    const handleMenuClick = (key) => {
        switch (key) {
            case '1':
                navigate('/');
                break;
            case '2':
                navigate('/Admisiones');
                break;

            case '3':
                navigate('/Usuarios');
                break;
            case '4':
                navigate('/Profesores');
                break;
            case '5':
                navigate('/OfertaEducativa');
                break;
                case '6':
                    navigate('/materias');
                    break;
            case '7':
                navigate('/cursos');
                break;
            case '8':
                navigate('/horarios');
                break;
            case '9':
                <DrawerComponent />
                break;
            default:
                break;
        }
    };

    return handleMenuClick;
};
