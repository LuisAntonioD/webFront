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
                navigate('/servicios');
                break;
            case '4':
                navigate('/Usuarios');
                break;
            case '5':
                navigate('/Profesores');
                break;
            case '6':
                    navigate('/OfertaEducativa');
                  break;
            case '7':
                  <DrawerComponent/>
                break;
                    default:
                      break;
                  }
    };

    return handleMenuClick;
};
