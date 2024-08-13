import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Button, Modal, notification, Input } from 'antd';
import { RiDeleteBin6Line, RiEdit2Line, RiAddLine, RiFileTextLine } from 'react-icons/ri';
import { ENV } from '../../utils/constants';
import MateriasForm from '../Materias/MateriasForm/MateriasForm';
import { AuthContext } from '../context/AuthContext';
import '../Admisiones/ProductsForm/ProductsForm.css'; // Reutilizar estilos
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generatePDF = (title, columns, data, userlogeado) => {
    const doc = new jsPDF();

    // Obtener la fecha actual y formatearla
    const currentDate = new Date();
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    const formattedDate = formatDate(currentDate);

    doc.text(title, 14, 20);

    // Transforma los datos para el PDF
    const rows = data.map(row => columns.map(col => {
        if (col.dataIndex === 'ofertasEducativas') {
            // Convierte array de objetos a una cadena de nombres
            return row[col.dataIndex].map(oferta => oferta.nombre).join(', ');
        }
        return row[col.dataIndex] || '';
    }));

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


const MateriasTable = () => {
    const { token, user } = useContext(AuthContext);
    const [materias, setMaterias] = useState([]);
    const [editingMateria, setEditingMateria] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        fetchMaterias();
    }, [token]);

    const fetchMaterias = async () => {
        try {
            const response = await axios.get(`${ENV.API_URL}/${ENV.ENDPOINTS.MATERIAS}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMaterias(response.data);
        } catch (err) {
            notification.error({
                message: 'Error',
                description: 'No se pudieron cargar las materias.',
            });
        }
    };

    const handleAdd = () => {
        setEditingMateria(null);
        setIsModalVisible(true);
    };

    const handleEdit = (materia) => {
        setEditingMateria(materia);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${ENV.API_URL}/${ENV.ENDPOINTS.MATERIAS}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchMaterias();
            notification.success({
                message: 'Éxito',
                description: 'Materia eliminada correctamente.',
            });
        } catch (err) {
            notification.error({
                message: 'Error',
                description: 'Error al eliminar la materia.',
            });
        }
    };

    const confirmDeleteMateria = (id) => {
        Modal.confirm({
            title: 'Confirmar Eliminación',
            content: '¿Estás seguro de que deseas eliminar esta materia?',
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            className: 'custom-confirm-modal', // Estilo consistente con ProductsTable
            onOk() {
                handleDelete(id);
            },
            onCancel() {
                setEditingMateria(null);
            },
        });
    };

    const handleSave = async () => {
        setIsModalVisible(false);
        await fetchMaterias(); // Espera a que se actualicen las materias
    };

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    };

    const filteredMaterias = materias.filter((materia) =>
        materia.nombre.toLowerCase().includes(searchText.toLowerCase())
    );

    const formatOfertas = (ofertas) => {
        return ofertas.map((oferta) => oferta.nombre).join(', ');
    };

    const handleGenerateReport = () => {
        const columns = [
            { title: 'ID', dataIndex: '_id' },
            { title: 'Nombre', dataIndex: 'nombre' },
            { title: 'Descripción', dataIndex: 'descripcion' },
            { title: 'Ofertas Educativas', dataIndex: 'ofertasEducativas' },
        ];
        generatePDF('Reporte de Materias', columns, materias, user);
    };
    

    return (
        <div className="products-table-page"> {/* Utiliza el mismo contenedor */}
            <div className="buttons-container">
                <Button className="add-button" type="primary" onClick={handleAdd} icon={<RiAddLine />} style={{backgroundColor: '#27ae60'}}>
                    Agregar Materia
                </Button>
                <Button className="report-button" type="default" onClick={handleGenerateReport} icon={<RiFileTextLine />} style={{backgroundColor: '#3498db', color: 'white'}}>
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
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Ofertas Educativas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMaterias.map((materia) => (
                            <tr key={materia._id}>
                                <td>{materia._id}</td>
                                <td>{materia.nombre}</td>
                                <td>{materia.descripcion}</td>
                                <td>{formatOfertas(materia.ofertasEducativas)}</td>
                                <td>
                                    <Button
                                        icon={<RiEdit2Line />}
                                        onClick={() => handleEdit(materia)}
                                        className="action-button ant-btn-success"
                                        style={{backgroundColor: '#0468BF'}}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        icon={<RiDeleteBin6Line />}
                                        onClick={() => confirmDeleteMateria(materia._id)}
                                        className="action-button ant-btn-danger"
                                        style={{backgroundColor: '#ff0000'}}
                                    >
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                title={editingMateria ? 'Editar Materia' : 'Agregar Materia'}
                visible={isModalVisible}
                footer={null}
                onCancel={() => setIsModalVisible(false)}
                className="custom-modal" // Reutiliza estilos de modal
            >
                <MateriasForm currentMateria={editingMateria} onSave={handleSave} />
            </Modal>
        </div>
    );
};

export default MateriasTable;
