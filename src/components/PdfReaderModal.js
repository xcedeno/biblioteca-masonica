import React, { useState } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';

// Configurar el worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfReaderModal = ({ bookUrl, open, handleClose }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    return (
        <Modal open={open} onClose={handleClose}>
        <Box
            sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: '80%',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            overflowY: 'scroll', // Habilitar scroll si es necesario
            }}
        >
            <Typography variant="h6" component="h2" gutterBottom>
            Lector de PDF
            </Typography>

            <Document file={bookUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
            </Document>

            <Typography variant="body2" gutterBottom>
            Página {pageNumber} de {numPages}
            </Typography>

            <Button
            onClick={() => setPageNumber(Math.max(pageNumber - 1, 1))}
            disabled={pageNumber === 1}
            >
            Anterior
            </Button>
            <Button
            onClick={() => setPageNumber(Math.min(pageNumber + 1, numPages))}
            disabled={pageNumber === numPages}
            >
            Siguiente
            </Button>

            <Button onClick={handleClose} variant="contained" color="secondary" sx={{ mt: 2 }}>
            Cerrar
            </Button>
        </Box>
        </Modal>
    );
};

export default PdfReaderModal;
