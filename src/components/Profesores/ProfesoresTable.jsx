import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Modal, Form, Input, message } from 'antd';
import axios from 'axios';
import { ENV } from '../../utils/constants'; // Ajusta la ruta de importación según la ubicación de tu archivo constants.js

const ProfesoresTable = () => {
    const [profesores, setProfesores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchProfesores();
    }, []);

    const fetchProfesores = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.PROFESORES}`);
            setProfesores(response.data);
        } catch (error) {
            console.error('Error fetching profesores:', error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Apellidos',
            dataIndex: 'apellidos',
            key: 'apellidos',
        },
        {
            title: 'Número de Empleado',
            dataIndex: 'numeroEmpleado',
            key: 'numeroEmpleado',
        },
        {
            title: 'Correo',
            dataIndex: 'correo',
            key: 'correo',
        },
        {
            title: 'Fecha de Nacimiento',
            dataIndex: 'fechaNacimiento',
            key: 'fechaNacimiento',
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={() => setModalVisible(true)} style={{ marginBottom: 16 }}>
                Agregar Profesor
            </Button>
            <Table dataSource={profesores} columns={columns} rowKey="_id" loading={loading} />

            <Modal
                title="Agregar Profesor"
                visible={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                onOk={() => {
                    form.validateFields().then(async (values) => {
                        try {
                            await axios.post(`${ENV.API_URL}/${ENV.ENDPOINTS.PROFESORES}`, values);
                            message.success('Profesor agregado exitosamente');
                            fetchProfesores();
                            setModalVisible(false);
                            form.resetFields();
                        } catch (error) {
                            console.error('Error adding profesor:', error);
                            message.error('Error al agregar profesor');
                        }
                    });
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="apellidos" label="Apellidos" rules={[{ required: true, message: 'Por favor ingresa los apellidos' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="numeroEmpleado" label="Número de Empleado" rules={[{ required: true, message: 'Por favor ingresa el número de empleado' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="correo" label="Correo" rules={[{ required: true, message: 'Por favor ingresa el correo' }, { type: 'email', message: 'Formato de correo inválido' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="fechaNacimiento" label="Fecha de Nacimiento" rules={[{ required: true, message: 'Por favor ingresa la fecha de nacimiento' }]}>
                        <Input type="date" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProfesoresTable;
