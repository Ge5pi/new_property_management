import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        const response = await fetch(`/api/properties/${id}`);
        const data = await response.json();
        setProperty(data);
      };
      fetchProperty();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProperty((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/properties/${id}` : '/api/properties';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(property),
    });

    navigate('/admin/property');
  };

  return (
    <div>
      <h1>{id ? 'Edit Property' : 'Add Property'}</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={property.name} onChange={handleChange} />
        </label>
        <label>
          Address:
          <input type="text" name="address" value={property.address} onChange={handleChange} />
        </label>
        <label>
          City:
          <input type="text" name="city" value={property.city} onChange={handleChange} />
        </label>
        <label>
          State:
          <input type="text" name="state" value={property.state} onChange={handleChange} />
        </label>
        <label>
          Zip Code:
          <input type="text" name="zipCode" value={property.zipCode} onChange={handleChange} />
        </label>
        <label>
          Country:
          <input type="text" name="country" value={property.country} onChange={handleChange} />
        </label>
        <button type="submit">{id ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default PropertyForm;
