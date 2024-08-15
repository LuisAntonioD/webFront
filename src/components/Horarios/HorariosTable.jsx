import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Button, Modal, notification, Form, Input, DatePicker, TimePicker, Select } from 'antd';
import { RiAddLine, RiDeleteBin6Line, RiEdit2Line, RiFileTextLine } from 'react-icons/ri';
import { ENV } from '../../utils/constants';
import horariosService from '../../services/horarios';
import { AuthContext } from '../context/AuthContext';
import './HorariosTable.css';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const HorariosTable = () => {
    const [horarios, setHorarios] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentHorario, setCurrentHorario] = useState(null);
    const { user, token } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchHorarios();
        fetchProfesores();
    }, []);

    const fetchHorarios = async () => {
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.HORARIOS}`);
            if (Array.isArray(response.data)) {
                setHorarios(response.data);
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
            setError('Error al obtener los datos de la API');
            console.error(err);
        }
    };

    const handleAddHorario = async (values) => {
        const { fecha, horaInicio, horaFinal, profesores } = values;
    
        const formattedFecha = fecha.format('DD-MM-YYYY');
        const formattedHoraInicio = horaInicio.format('HH:mm');
        const formattedHoraFinal = horaFinal.format('HH:mm');
    
        console.log('Agregar Horario:', {
            fecha: formattedFecha,
            horaInicio: formattedHoraInicio,
            horaFinal: formattedHoraFinal,
            profesores,
        });
    
        try {
            const response = await horariosService.addHorario(token, formattedFecha, formattedHoraInicio, formattedHoraFinal, profesores);
            console.log('Respuesta del backend:', response.data); // Aquí verificas la respuesta
            fetchHorarios();
            setIsModalVisible(false);
            form.resetFields();
            notification.success({
                message: 'Horario Agregado',
                description: 'Horario agregado correctamente.',
            });
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Hubo un problema al agregar el horario.',
            });
            console.error('Error al agregar el horario:', error);
        }
    };
    

    const handleEditHorario = async (values) => {
        const { fecha, horaInicio, horaFinal, profesores } = values;

        const formattedFecha = fecha.format('DD-MM-YYYY');
        const formattedHoraInicio = horaInicio.format('HH:mm');
        const formattedHoraFinal = horaFinal.format('HH:mm');

        try {
            const updatedHorario = {
                fecha: formattedFecha,
                horaInicio: formattedHoraInicio,
                horaFinal: formattedHoraFinal,
                profesores: profesores,
            };
            await horariosService.editHorario(currentHorario._id, updatedHorario, token);
            fetchHorarios();
            setIsModalVisible(false);
            form.resetFields();
            setIsEditing(false);
            setCurrentHorario(null);
            notification.success({
                message: 'Horario Actualizado',
                description: 'Horario actualizado correctamente.',
            });
        } catch (error) {
            notification.error({
                message: 'Error',
                description: 'Hubo un problema al actualizar el horario.',
            });
            console.error('Error al actualizar el horario:', error);
        }
    };

    const showEditModal = (horario) => {
        const profesoresIds = Array.isArray(horario.profesor)
            ? horario.profesor.map(prof => prof._id)
            : [];

        setCurrentHorario(horario);
        setIsEditing(true);
        setIsModalVisible(true);

        form.setFieldsValue({
            fecha: moment(horario.fecha, 'DD-MM-YYYY'),
            horaInicio: moment(horario.horaInicio, 'HH:mm'),
            horaFinal: moment(horario.horaFinal, 'HH:mm'),
            profesores: profesoresIds,
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsEditing(false);
        setCurrentHorario(null);
        form.resetFields();
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredHorarios = horarios.filter(
        (horario) =>
            (horario.fecha || '').toLowerCase().includes(searchText.toLowerCase())
    );

    const getProfesorNames = (profesorArray) => {
        if (!Array.isArray(profesorArray)) {
            return '';
        }
        const nombresProfesores = profesorArray.map(prof => prof.nombre).join(', ');
        return nombresProfesores;
    };

    const deleteHorario = async (id) => {
        try {
            await horariosService.deleteHorario(id, token);
            fetchHorarios();
            showDeleteNotification();
        } catch (error) {
            showErrorNotification('Error al eliminar el horario');
            console.error(error);
        }
    };

    const showDeleteNotification = () => {
        notification.success({
            message: 'Horario Eliminado',
            description: 'Horario eliminado correctamente.',
        });
    };

    const showErrorNotification = (message) => {
        notification.error({
            message: 'Error',
            description: message,
        });
    };

    const confirmDeleteHorario = (id) => {
        if (id === user._id) {
            showErrorNotification('No puedes eliminar tu propio horario.');
            return;
        }

        Modal.confirm({
            title: 'Confirmar Eliminación',
            content: '¿Estás seguro de que deseas eliminar este horario?',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            className: 'custom-confirm-modal',
            onOk() {
                deleteHorario(id);
            },
        });
    };

    const generatePDF = (title, columns, data, userlogeado) => {
        const doc = new jsPDF();

        const currentDate = new Date();
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        };
        const formattedDate = formatDate(currentDate);

        doc.text(title, 14, 20);

        const rows = data.map(row => columns.map(col => row[col.dataIndex] || ''));

        doc.autoTable({
            head: [columns.map(col => col.title)],
            body: rows,
            startY: 40,
        });

        doc.setFontSize(10);
        doc.text(`Generado por: ${userlogeado.username} (${userlogeado.email})`, 14, 30);
        doc.text(`Fecha de Generación: ${formattedDate}`, 14, 35);

        doc.save(`${title.replace(/\s+/g, '_').toLowerCase()}.pdf`);
    };

    const handleGenerateReport = () => {
        const columns = [
            { title: 'Fecha', dataIndex: 'fecha' },
            { title: 'Hora de Inicio', dataIndex: 'horaInicio' },
            { title: 'Hora de Fin', dataIndex: 'horaFinal' },
            { title: 'Profesores', dataIndex: 'profesor', render: getProfesorNames },
        ];
        generatePDF('Reporte de Horarios', columns, horarios, user);
    };

    return (
        <div className="horarios-table-page">
            <div className="buttons-container">
                <Button
                    className="add-button"
                    icon={<RiAddLine />}
                    onClick={() => setIsModalVisible(true)}
                    style={{ backgroundColor: '#28a745', color: 'white' }} // Estilo replicado
                >
                    Nuevo Horario
                </Button>
                <Button
                    className="report-button"
                    type="default"
                    onClick={handleGenerateReport}
                    icon={<RiFileTextLine />}
                    style={{ backgroundColor: '#3498db', color: 'white' }}
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

            <div className="table-container table-wrapper">
                <table className="formato-tabla">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Hora de Inicio</th>
                            <th>Hora de Fin</th>
                            <th>Profesores</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredHorarios.map((horario) => (
                            <tr key={horario._id}>
                                <td>{horario.fecha}</td>
                                <td>{horario.horaInicio}</td>
                                <td>{horario.horaFinal}</td>
                                <td>{getProfesorNames(horario.profesor)}</td>
                                <td>
                                    <Button
                                        className="delete-button"
                                        onClick={() => confirmDeleteHorario(horario._id)}
                                        icon={<RiDeleteBin6Line />}
                                        style={{ backgroundColor: '#dc3545', color: 'white' }} // Estilo replicado
                                    >
                                        Eliminar
                                    </Button>
                                    <Button
                                        className="edit-button"
                                        onClick={() => showEditModal(horario)}
                                        icon={<RiEdit2Line />}
                                        style={{ backgroundColor: '#ffc107', color: 'black' }} // Estilo replicado
                                    >
                                        Editar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                title={isEditing ? "Editar Horario" : "Nuevo Horario"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                className="custom-modal"
            >
                <Form
                    form={form}
                    onFinish={isEditing ? handleEditHorario : handleAddHorario}
                    layout="vertical"
                >
                    <Form.Item
                        label="Fecha"
                        name="fecha"
                        rules={[
                            { required: true, message: 'Por favor selecciona una fecha' },
                        ]}
                    >
                        <DatePicker format="DD-MM-YYYY" />
                    </Form.Item>
                    <Form.Item
                        label="Hora de Inicio"
                        name="horaInicio"
                        rules={[
                            { required: true, message: 'Por favor selecciona una hora de inicio' },
                        ]}
                    >
                        <TimePicker format='HH:mm' placeholder="Selecciona la hora de inicio" />
                    </Form.Item>
                    <Form.Item
                        label="Hora de Fin"
                        name="horaFinal"
                        rules={[
                            { required: true, message: 'Por favor selecciona una hora de fin' },
                        ]}
                    >
                        <TimePicker format='HH:mm' placeholder="Selecciona la hora de fin" />
                    </Form.Item>
                    <Form.Item
                        label="Profesores"
                        name="profesores"
                    >
                        <Select
                            mode="multiple"
                            placeholder="Selecciona profesores"
                            options={profesores.map(prof => ({
                                label: prof.nombre,
                                value: prof._id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {isEditing ? "Guardar Cambios" : "Agregar Horario"}
                        </Button>
                        <Button onClick={handleCancel} style={{ marginLeft: '10px' }}>
                            Cancelar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default HorariosTable;
