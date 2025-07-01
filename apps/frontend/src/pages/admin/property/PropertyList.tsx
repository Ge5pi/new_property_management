import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await fetch('/api/properties');
      const data = await response.json();
      setProperties(data);
    };

    fetchProperties();
  }, []);

  return (
    <div>
      <h1>Properties</h1>
      <Link to="/admin/property/new">Add Property</Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property: any) => (
            <tr key={property.id}>
              <td>{property.name}</td>
              <td>{property.address}</td>
              <td>{property.city}</td>
              <td>{property.state}</td>
              <td>{property.country}</td>
              <td>
                <Link to={`/admin/property/edit/${property.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyList;
