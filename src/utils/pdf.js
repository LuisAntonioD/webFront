import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePDF = (users, userlogeado) => {

    const doc = new jsPDF();

    // Obtener la fecha actual y formatearla
    const currentDate = new Date();
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    const formattedDate = formatDate(currentDate);

    doc.text('Reporte de Usuarios', 14, 20);

    const columns = [
        { title: "Nombre de Usuario", dataKey: "username" },
        { title: "Correo Electrónico", dataKey: "email" },
        { title: "Fecha de Creación", dataKey: "createdAt" }
    ];

    const data = users.map(user => ({
        username: user.username,
        email: user.email,
        createdAt: formatDate(user.createdAt)
    }));

    doc.autoTable({
        head: [columns.map(col => col.title)],
        body: data.map(item => columns.map(col => item[col.dataKey])),
        startY: 40,  
    });

    doc.setFontSize(10);
    doc.text(`Generado por: ${userlogeado.username} (${userlogeado.email})`, 14, 30);
    doc.text(`Fecha de Generación: ${formattedDate}`, 14, 35);

    doc.save('reporte_usuarios.pdf');
};
