import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Button, Modal, notification, Form, Input, Select } from 'antd';
import { RiAddLine, RiDeleteBin6Line, RiEdit2Line } from 'react-icons/ri';
import { ENV } from '../../utils/constants';
import cursosService from '../../services/cursos';
import { AuthContext } from '../context/AuthContext';
import './Cursos.css';

const CursosTable = () => {
    const [cursos, setCursos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCurso, setCurrentCurso] = useState(null);
    const { user, token } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchCursos();
        fetchProfesores();
    }, []);

    const fetchCursos = async () => {
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.CURSOS}`);
            if (Array.isArray(response.data)) {
                const filteredCursos = response.data.filter(c => c._id !== user._id);
                setCursos(filteredCursos);
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
                const filteredProfesores = response.data.filter(p => p._id !== user._id);
                setProfesores(filteredProfesores);
            } else {
                setError('La respuesta de la API no es un arreglo');
            }
        } catch (err) {
            setError('Error al obtener los datos de la API');
            console.error(err);
        }
    };

    const deleteCurso = async (id) => {
        try {
            await cursosService.deleteCurso(id, token);
            fetchCursos();
            showDeleteNotification();
        } catch (error) {
            showErrorNotification('Error al eliminar el curso');
            console.error(error);
        }
    };

    const showDeleteNotification = () => {
        notification.success({
            message: 'Curso Eliminado',
            description: 'Curso eliminado correctamente.',
        });
    };

    const showErrorNotification = (message) => {
        notification.error({
            message: 'Error',
            description: message,
        });
    };

    const confirmDeleteCurso = (id) => {
        if (id === user._id) {
            showErrorNotification('No puedes eliminar tu propio curso.');
            return;
        }

        Modal.confirm({
            title: 'Confirmar Eliminación',
            content: '¿Estás seguro de que deseas eliminar este curso?',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            className: 'custom-confirm-modal',
            onOk() {
                deleteCurso(id);
            },
        });
    };

    const handleAddCurso = async (values) => {
        const { nombreCurso } = values;
        if (!nombreCurso) {
            notification.error({
                message: 'Error',
                description: 'El nombre del curso es requerido.',
            });
            return;
        }
        try {
            await cursosService.addCurso(nombreCurso.trim(), token);
            fetchCursos();
            setIsModalVisible(false);
            form.resetFields();
            notification.success({
                message: 'Curso Agregado',
                description: 'Curso agregado correctamente.',
            });
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Hubo un problema al agregar el curso.',
            });
            console.error('Error al agregar el curso:', error);
        }
    };

    const handleEditCurso = async (values) => {
        const { nombreCurso, profesores } = values;
        try {
            const updatedCurso = {
                nombre: nombreCurso.trim(),
                profesores: profesores || [],
            };
            await cursosService.editCurso(currentCurso._id, updatedCurso, token);
            fetchCursos();
            setIsModalVisible(false);
            form.resetFields();
            setIsEditing(false);
            setCurrentCurso(null);
            notification.success({
                message: 'Curso Actualizado',
                description: 'Curso actualizado correctamente.',
            });
        } catch (error) {
            showErrorNotification('Error al actualizar el curso');
            console.error(error);
        }
    };

    const showEditModal = (curso) => {
        setCurrentCurso(curso);
        setIsEditing(true);
        setIsModalVisible(true);
        form.setFieldsValue({
            nombreCurso: curso.nombre,
            profesores: curso.profesores.map(prof => prof._id),
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsEditing(false);
        setCurrentCurso(null);
        form.resetFields();
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredCursos = cursos.filter(
        (curso) =>
            curso.nombre.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="cursos-table-page">
            <div className="buttons-container">
                <Button
                    className="add-button"
                    icon={<RiAddLine />}
                    onClick={() => setIsModalVisible(true)}
                >
                    Agregar Curso
                </Button>
                <Input
                    placeholder="Buscar ..."
                    value={searchText}
                    onChange={handleSearchChange}
                    style={{ marginBottom: 20, width: '200px' }}
                />
            </div>

            <div className="table-container table-wrapper">
                <table className="formato-tabla">
                    <thead>
                        <tr>
                            <th>Nombre del Curso</th>
                            <th>Fecha de creación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCursos.map((curso) => (
                            <tr key={curso._id}>
                                <td>{curso.nombre}</td>
                                <td>{formatDate(curso.createdAt)}</td>
                                <td>
                                    <Button
                                        className="action-button ant-btn-danger"
                                        onClick={() => confirmDeleteCurso(curso._id)}
                                        icon={<RiDeleteBin6Line />}
                                    >
                                        Eliminar
                                    </Button>
                                    <Button
                                        className="action-button ant-btn-success"
                                        onClick={() => showEditModal(curso)}
                                        icon={<RiEdit2Line />}
                                    >
                                        Editar/Agregar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                title={isEditing ? "Editar Curso" : "Agregar Curso"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={isEditing ? handleEditCurso : handleAddCurso}
                >
                    <Form.Item
                        label="Nombre"
                        name="nombreCurso"
                        rules={[
                            { required: true, message: 'Por favor ingrese el nombre del curso' },
                        ]}
                    >
                        <Input placeholder="Nombre del curso" />
                    </Form.Item>
                    <Form.Item
                        label="Profesores"
                        name="profesores"
                    >
                        <Select
                            mode="multiple"
                            placeholder="Selecciona profesores"
                            options={profesores.map((prof) => ({
                                value: prof._id,
                                label: prof.nombre,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isEditing ? "Actualizar Curso" : "Agregar Curso"}
                        </Button>
                        <Button type="default" onClick={handleCancel} style={{ marginLeft: '8px' }}>
                            Cancelar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CursosTable;
