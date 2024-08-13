import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, Select, notification } from 'antd';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { ENV } from '../../../utils/constants';

const { Option } = Select;

const MateriasForm = ({ currentMateria, onSave, onCancel }) => {
    const { token } = useContext(AuthContext);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [ofertas, setOfertas] = useState([]);
    const [existingMaterias, setExistingMaterias] = useState([]);

    useEffect(() => {
        const fetchOfertas = async () => {
            try {
                const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.OFERTAEDUCATIVA}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOfertas(response.data);
            } catch (err) {
                notification.error({
                    message: 'Error',
                    description: 'No se pudieron cargar las ofertas educativas.',
                });
            }
        };

        const fetchExistingMaterias = async () => {
            try {
                const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.MATERIAS}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setExistingMaterias(response.data);
            } catch (err) {
                notification.error({
                    message: 'Error',
                    description: 'No se pudieron cargar las materias existentes.',
                });
            }
        };

        fetchOfertas();
        fetchExistingMaterias();

        if (currentMateria) {
            form.setFieldsValue({
                nombre: currentMateria.nombre,
                descripcion: currentMateria.descripcion,
                ofertasEducativas: currentMateria.ofertasEducativas.map(o => o._id),
            });
        } else {
            form.resetFields();
        }
    }, [currentMateria, form, token]);

    const handleSubmit = async (values) => {
        const { nombre, descripcion, ofertasEducativas } = values;

        // Validar nombre
        if (nombre.length > 10) {
            notification.error({
                message: 'Error',
                description: 'El nombre no puede tener más de 10 caracteres.',
            });
            return;
        }

        const regex = /^[a-zA-Z0-9\s]+$/;
        if (!regex.test(nombre)) {
            notification.error({
                message: 'Error',
                description: 'El nombre solo puede contener caracteres alfanuméricos.',
            });
            return;
        }

        // Verificar duplicados
        const isDuplicate = existingMaterias.some(materia => 
            materia.nombre.toLowerCase() === nombre.toLowerCase() && 
            (!currentMateria || materia._id !== currentMateria._id)
        );

        if (isDuplicate) {
            notification.error({
                message: 'Error',
                description: 'Ya existe una materia con el mismo nombre.',
            });
            return;
        }

        setLoading(true);

        try {
            const endpoint = currentMateria
                ? `${ENV.API_URL}/${ENV.ENDPOINTS.MATERIAS}/${currentMateria._id}`
                : `${ENV.API_URL}/${ENV.ENDPOINTS.MATERIAS}`;
            const method = currentMateria ? 'put' : 'post';

            await axios({
                method,
                url: endpoint,
                headers: { Authorization: `Bearer ${token}` },
                data: {
                    nombre,
                    descripcion,
                    ofertasEducativas,
                },
            });

            notification.success({
                message: 'Éxito',
                description: `Materia ${currentMateria ? 'actualizada' : 'agregada'} correctamente.`,
            });

            form.resetFields();
            if (onSave) onSave();
        } catch (err) {
            notification.error({
                message: 'Error',
                description: 'Error al guardar la materia.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
                label="Nombre"
                name="nombre"
                rules={[{ required: true, message: 'El nombre es requerido' }]}
            >
                <Input 
                    placeholder="Nombre de la materia" 
                    maxLength={10} 
                />
            </Form.Item>

            <Form.Item
                label="Descripción"
                name="descripcion"
                rules={[{ required: true, message: 'La descripción es requerida' }]}
            >
                <Input.TextArea placeholder="Descripción de la materia" />
            </Form.Item>

            <Form.Item
                label="Ofertas Educativas"
                name="ofertasEducativas"
                rules={[{ required: true, message: 'Selecciona al menos una oferta educativa' }]}
            >
                <Select
                    mode="multiple"
                    placeholder="Selecciona las ofertas educativas"
                    allowClear
                >
                    {ofertas.map((oferta) => (
                        <Option key={oferta._id} value={oferta._id}>
                            {oferta.nombre}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {loading ? 'Guardando...' : (currentMateria ? 'Actualizar' : 'Agregar')}
                </Button>
                <Button
                    style={{ marginLeft: '8px' }}
                    onClick={() => {
                        form.resetFields();
                        if (onCancel) onCancel();
                    }}
                >
                    Cancelar
                </Button>
            </Form.Item>
        </Form>
    );
};

export default MateriasForm;
