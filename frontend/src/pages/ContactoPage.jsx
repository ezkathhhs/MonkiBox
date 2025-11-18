import React from 'react';
import TiendaLayout from '../components/4_templates/TiendaLayout';
import ContactForm from '../components/3_organisms/ContactForm';
import './ContactoPage.css';

const ContactoPage = () => {
  return (
    <TiendaLayout>
      <div className="contact-page-container">
        <div className="contact-header">
          <h1>Ponte en Contacto</h1>
          <p>¿Tienes preguntas o comentarios? Nos encantaría escucharte. Completa el formulario a continuación.</p>
        </div>
        
        <ContactForm />
      </div>
    </TiendaLayout>
  );
};

export default ContactoPage;