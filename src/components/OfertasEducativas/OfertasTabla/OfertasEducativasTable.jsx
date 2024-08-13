import React, { useEffect, useState, useRef, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Button, Modal, notification, Input } from 'antd';
import {DownloadOutlined} from '@ant-design/icons';
import { RiAddLine, RiDeleteBin6Line, RiEdit2Line, RiFileTextLine } from 'react-icons/ri';
import { ENV } from '../../../utils/constants';
import ofertaEducativaService from '../../../services/OfertaEducativaService';
import NewOfertaForm from '../OfertasForm/newOferta';
import { AuthContext } from '../../context/AuthContext';
import '../OfertasTabla/OfertasTable.css'; // Asegúrate de importar el CSS
import { generatePDF } from '../../../utils/pdf';

const OfertasEducativasTable = () => {
    const [ofertas, setOfertas] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [token, setToken] = useState('');
    const { user } = useContext(AuthContext);
    const formRef = useRef();
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchOfertas();
        fetchProfesores();
    }, []);

    const fetchOfertas = async () => {
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.OFERTAEDUCATIVA}`);
            if (Array.isArray(response.data)) {
                setOfertas(response.data);
            } else {
                setError('La respuesta de la API no es un arreglo');
            }
        } catch (err) {
            setError('Error al obtener los datos de la API');
            console.error(err);
        }
    };

    const fetchProfesores = async () => {
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.PROFESORES}`);
            if (Array.isArray(response.data)) {
                setProfesores(response.data);
            } else {
                setError('La respuesta de la API no es un arreglo');
            }
        } catch (err) {
            setError('Error al obtener los datos de los profesores');
            console.error(err);
        }
    };

    const getProfesorNames = (profesorIds) => {
        return profesorIds.map(id => {
            const profesor = profesores.find(prof => prof._id === id);
            return profesor ? profesor.nombre : 'Desconocido';
        }).join(', ');
    };

    const deleteOferta = async (id) => {
        try {
            await ofertaEducativaService.deleteOfertaEducativa(id, token);
            fetchOfertas();
            showDeleteNotification();
        } catch (error) {
            showErrorNotification('Error al eliminar la oferta');
            console.error(error);
        }
    };

    const showDeleteNotification = () => {
        notification.success({
            message: 'Oferta Eliminada',
            description: 'Oferta eliminada correctamente.',
        });
    };

    const showErrorNotification = (message) => {
        notification.error({
            message: 'Error',
            description: message,
        });
    };

    const confirmDeleteOferta = (id) => {
        Modal.confirm({
            title: 'Confirmar Eliminación',
            content: '¿Estás seguro de que deseas eliminar esta oferta?',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            className: 'custom-confirm-modal', // Clase personalizada para el modal
            onOk() {
                deleteOferta(id);
            },
        });
    };

    const showEditModal = (oferta) => {
        setCurrentUser(oferta);
        setIsEditing(true);
        setIsModalVisible(true);
    };

    const handleEditOferta = async (values) => {
        try {
            const updatedOferta = {
                ...values,
            };
            await ofertaEducativaService.updateOfertaEducativa(currentUser._id, updatedOferta, token);
            fetchOfertas();
            setIsModalVisible(false);
            setIsEditing(false);
            setCurrentUser(null);
            notification.success({
                message: 'Oferta Actualizada',
                description: 'Oferta actualizada correctamente.',
            });
        } catch (error) {
            showErrorNotification('Error al actualizar la oferta');
            console.error(error);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsEditing(false);
        setCurrentUser(null);
        formRef.current.resetFormFields(); // Accede a resetFormFields a través de la referencia
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredOfertas = ofertas.filter(oferta => {
        const fechaCreacion = moment(oferta.createdAt).format('DD/MM/YYYY');
        const nombresProfesores = getProfesorNames(oferta.profesores);
        return (
            oferta.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
            (oferta.activo ? 'activo' : 'inactivo').toLowerCase().includes(searchText.toLowerCase()) ||
            fechaCreacion.toLowerCase().includes(searchText.toLowerCase()) ||
            nombresProfesores.toLowerCase().includes(searchText.toLowerCase())
        );
    });

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (error) {
        return <div>{error}</div>;
    }

    const existingNames = ofertas.map(oferta => oferta.nombre);

    const columns = [
        { title: "Nombre", dataKey: "nombre" },
        { title: "activo", dataKey: "activo" },
        { title: "Fecha de Creación", dataKey: "createdAt" },
        { title: "Profesores", dataKey: "profesores" }
    ];

    const data = filteredOfertas.map(oferta => ({
        nombre: oferta.nombre,
        activo: oferta.activo ? 'Activo' : 'Inactivo',
        createdAt: formatDate(oferta.createdAt),
        profesores: getProfesorNames(oferta.profesores)
    }));

    return (
        <div className="ofertas-educativas-table-page">
            {user && (
                <div className="buttons-container">
                    <Button
                        className="add-button"
                        icon={<RiAddLine />}
                        onClick={() => {
                            setCurrentUser(null);
                            setIsEditing(false);
                            setIsModalVisible(true);
                        }}
                        style={{backgroundColor: '#27ae60'}}
                    >
                        Agregar Oferta
                    </Button>
                    <Button
                        className="generate-button"
                        type="secondary"
                        icon={<RiFileTextLine />} style={{backgroundColor: '#3498db', color: 'white'}}
                        onClick={() => generatePDF('Reporte Ofertas educativas', columns, data, user)}
                    >
                        Generar Reporte
                    </Button>
                    <Input
                        placeholder="Buscar ..."
                           className="search-input"
                        value={searchText}
                        onChange={handleSearchChange}
                        style={{ marginBottom: 20, width: '200px' }}
                    />
                </div>
            )}
            <div className="table-container">
                <table className="formato-tabla">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Status</th>
                            <th>Fecha de Creación</th>
                            <th>Profesores</th>
                            {user && <th>Acciones</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOfertas.map((oferta) => (
                            <tr key={oferta._id}>
                                <td>{oferta.nombre}</td>
                                <td>{oferta.activo ? 'Activo' : 'Inactivo'}</td>
                                <td>{moment(oferta.createdAt).format('DD/MM/YYYY')}</td>
                                <td>{getProfesorNames(oferta.profesores)}</td>
                                {user && (
                                    <td>
                                        <div className="actions-container">
                                            <Button
                                                className="action-button ant-btn-danger"
                                                onClick={() => confirmDeleteOferta(oferta._id)}
                                                icon={<RiDeleteBin6Line />}
                                                style={{backgroundColor: '#ff0000'}}
                                            >
                                                Eliminar
                                            </Button>
                                            <Button
                                                className="action-button ant-btn-success"
                                                onClick={() => showEditModal(oferta)}
                                                icon={<RiEdit2Line />}
                                                style={{backgroundColor: '#0468BF'}}
                                            >
                                                Editar
                                            </Button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <NewOfertaForm
                ref={formRef}
                onCreate={fetchOfertas}  // Llamar la funcion fetchOfertas que sirve para volver a cargar la tabla
                onEdit={handleEditOferta}
                visible={isModalVisible}
                onCancel={handleCancel}
                editing={isEditing}
                oferta={currentUser}
                existingNames={existingNames} // Pasar los nombres existentes
            />
        </div>
    );
};

export default OfertasEducativasTable;
