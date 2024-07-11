import React, { useState } from 'react';
import { Modal, Form, Input, Button, DatePicker, notification } from 'antd';
import profesoresService from '../../../../services/profesorService';  // Asegúrate de importar el servicio adecuadamente

const NewProfesorForm = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token'); // Asumiendo que el token se guarda en localStorage o que se obtiene de AuthContext

            const values = await form.validateFields();
            const profesor = {
                nombre: values.nombre,
                apellidos: values.apellidos,
                numeroEmpleado: values.numeroEmpleado,
                correo: values.correo,
                fechaNacimiento: values.fechaNacimiento ? values.fechaNacimiento.format('DD/MM/YYYY') : null,
            };

            // Verificar si el número de empleado ya está registrado
            const existingProfesores = await profesoresService.getProfesores();
            const numeroEmpleadoExists = existingProfesores.some(prof => prof.numeroEmpleado === profesor.numeroEmpleado);
            if (numeroEmpleadoExists) {
                notification.error({ message: 'Error al crear profesor', description: 'El número de empleado ya está registrado.', placement: 'bottomRight' });
                return;
            }

            await profesoresService.addProfesor(token, profesor);
            notification.success({ message: 'Profesor creado con éxito', placement: 'bottomRight' });

            form.resetFields(); // Restablecer los campos del formulario después de la creación exitosa
            onCreate(); // No pasamos datos específicos porque el fetchData debería actualizar automáticamente la lista
            onCancel();
        } catch (error) {
            console.error('Error al crear profesor:', error);
            notification.error({ message: 'Error al crear profesor', placement: 'bottomRight' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields(); // Restablecer los campos del formulario cuando se cancela
        onCancel();
    };

    return (
        <Modal
            title="Agregar Nuevo Profesor"
            visible={visible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                onFinish={handleFormSubmit}
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
            >
                <Form.Item
                    name="nombre"
                    label="Nombre"
                    rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="apellidos"
                    label="Apellidos"
                    rules={[{ required: true, message: 'Por favor ingresa los apellidos' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="numeroEmpleado"
                    label="No. Empleado"
                    rules={[{ required: true, message: 'Por favor ingresa el número de empleado' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="correo"
                    label="Correo Electrónico"
                    rules={[
                        { required: true, message: 'Por favor ingresa el correo electrónico' },
                        { type: 'email', message: 'Por favor ingresa un correo electrónico válido' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="fechaNacimiento"
                    label="Fecha de Nacimiento"
                    rules={[{ required: true, message: 'Por favor selecciona la fecha de nacimiento' }]}
                >
                    <DatePicker format="DD/MM/YYYY" placeholder="DD/MM/YYYY" style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }}>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: '140px', marginRight: '16px' }}>
                        Crear Profesor
                    </Button>
                    <Button onClick={handleCancel} style={{ width: '140px' }}>
                        Cancelar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NewProfesorForm;
