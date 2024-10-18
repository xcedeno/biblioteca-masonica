import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, Modal, Box } from '@mui/material';

const BookCard = ({ book }) => {
    const [hover, setHover] = useState(false);
    const [openModal, setOpenModal] = useState(false); // Estado para abrir/cerrar el modal

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const pdfUrl = `https://drive.google.com/file/d/${book.url}/preview`;

    return (
        <div>
            <Card
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{ 
                    width: '200px', 
                    height: '400px', 
                    position: 'relative', 
                    cursor: 'pointer',
                    marginBottom: '16px'
                }}
            >
                <CardMedia
                    component="img"
                    height="300"
                    image={book.coverUrl}
                    alt={book.name}
                />
                <CardContent>
                    <Typography variant="h6" gutterBottom>{book.name}</Typography>
                    {hover && (
                        <Typography variant="body2" color="textSecondary">
                            {book.synopsis}
                        </Typography>
                    )}
                </CardContent>
                <Button
                    variant="contained"
                    color="primary"
                    style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)' }}
                    onClick={handleOpenModal}  // Abrir el modal al hacer clic
                >
                    Leer Libro
                </Button>
            </Card>

            {/* Modal para mostrar el PDF */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
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
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2">
                        {book.name}
                    </Typography>

                    {/* Contenedor del iframe para mostrar el PDF */}
                    <iframe
                        src={pdfUrl} // URL del PDF desde Google Drive
                        title={book.name}
                        width="100%"
                        height="90%"
                        style={{ border: 'none' }}
                    ></iframe>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleCloseModal}
                        style={{ marginTop: '16px' }}
                    >
                        Cerrar
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default BookCard;
