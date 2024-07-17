import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Modal, Form, Input, Button, Switch, Select, notification } from 'antd';
import ofertaEducativaService from '../../../services/OfertaEducativaService';
import usersService from '../../../services/profesorService';  // Servicio para obtener profesores

const { Option } = Select;

const NewOfertaForm = forwardRef(({ visible, onCreate, onEdit, onCancel, editing, oferta, existingNames }, ref) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [profesores, setProfesores] = useState([]);

    useImperativeHandle(ref, () => ({
        resetFormFields: () => form.resetFields()
    }));

    useEffect(() => {
        fetchProfesores();
        if (editing && oferta) {
            form.setFieldsValue({
                nombre: oferta.nombre,
                activo: oferta.activo,
                profesores: oferta.profesores,
            });
        }
    }, [editing, oferta]);

    const fetchProfesores = async () => {
        try {
            const response = await usersService.getProfesores();
            setProfesores(response);
        } catch (error) {
            console.error('Error al obtener los profesores:', error);
            notification.error({ message: 'Error al obtener los profesores' });
        }
    };

    const handleFormSubmit = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const values = await form.validateFields();
            const newOferta = {
                nombre: values.nombre,
                activo: values.activo,
                profesores: values.profesores, 
            };

            if (existingNames.includes(newOferta.nombre) && (!editing || (editing && newOferta.nombre !== oferta.nombre))) {
                notification.error({ message: 'El nombre ya existe' });
                setLoading(false);
                return;
            }

            if (editing) {
                await ofertaEducativaService.updateOfertaEducativa(oferta._id, newOferta, token);
                onEdit();
            } else {
                await ofertaEducativaService.addOfertaEducativa(token, newOferta);
                notification.success({
                    message: 'Oferta Educativa Agregada',
                    description: 'Oferta Educativa agregada correctamente.',
                });
                onCreate();
            }

            form.resetFields();
            onCancel();
        } catch (error) {
            console.error('Error al manejar la oferta educativa:', error);
            notification.error({ message: 'Error al manejar la oferta educativa' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields(); 
        onCancel();
    };

    return (
        <Modal
            title={editing ? "Editar Oferta Educativa" : "Agregar Nueva Oferta Educativa"}
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
                    name="activo"
                    label="Estado"
                    valuePropName="checked"
                    initialValue={true}
                >
                    <Switch checkedChildren="Encendido" unCheckedChildren="Apagado" />
                </Form.Item>
                <Form.Item
                    name="profesores"
                    label="Profesores"
                    rules={[{ required: true, message: 'Por favor selecciona al menos un profesor' }]}
                >
                    <Select
                        mode="multiple"
                        placeholder="Selecciona profesores"
                        allowClear
                    >
                        {profesores.map(profesor => (
                            <Option key={profesor._id} value={profesor._id}>
                                {profesor.nombre}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }}>
                    <Button type="primary" htmlType="submit" loading={loading} style={{ width: '140px', marginRight: '16px' }}>
                        {editing ? 'Guardar Cambios' : 'Crear Oferta'}
                    </Button>
                    <Button onClick={handleCancel} style={{ width: '140px' }}>
                        Cancelar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
});

export default NewOfertaForm;
