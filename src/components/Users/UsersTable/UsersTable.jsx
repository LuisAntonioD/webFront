import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Button} from 'antd';
import { RiAddLine } from 'react-icons/ri';
import { ENV } from '../../../utils/constants';
import authService from '../../../services/admisiones';
import { AuthContext } from '../../context/AuthContext';
import './UsersTable.css';

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const { user, token } = useContext(AuthContext);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.USER}`);
            if (Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                setError('La respuesta de la API no es un arreglo');
            }
        } catch (err) {
            setError('Error al obtener los datos de la API');
            console.error(err);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="users-table-page">
             <div className="buttons-container">
                    <Button
                        className="add-button"
                        type="primary"
                        icon={<RiAddLine />}
                    >
                        Agregar Usuario
                    </Button>
                </div>
            <div className="table-container table-wrapper">
                <table className="formato-tabla">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Fecha de creación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((users) => (
                            <tr key={users._id}>
                                <td>{users.username}</td>
                                <td>{users.email}</td>
                                <td>{formatDate(users.createdAt)}</td>
                                <td>
                                            <Button
                                             className="action-button ant-btn-danger">
                                                Eliminar
                                            </Button>
                                            <Button
                                              className="action-button ant-btn-success">
                                                Editar
                                            </Button>   
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTable;


