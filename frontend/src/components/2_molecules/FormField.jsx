import React from 'react';
import Input from '../1_atoms/Input';
import './FormField.css';

const FormField = ({ label, type, placeholder, value, onChange, name }) => {
  return (
    <div className="form-field">
      <label className="form-field-label">{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
      />
    </div>
  );
};

export default FormField;