import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddActivity.css';

const API_URL = 'http://localhost:8000';

function AddActivity() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'transport',
    category: 'road_freight',
    description: '',
    quantity: 1,
    unit: 'trip',
    distance_km: '',
    fuel_type: 'diesel',
    date: new Date().toISOString().split('T')[0]
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activityTypes = {
    transport: {
      categories: ['road_freight', 'air_freight', 'sea_freight', 'rail_freight', 'passenger_car'],
      fuelTypes: ['diesel', 'petrol', 'electric', 'jet_fuel'],
      units: ['trip', 'km']
    },
    energy: {
      categories: ['electricity_grid', 'natural_gas', 'coal', 'solar', 'wind'],
      fuelTypes: [],
      units: ['kWh', 'MWh']
    },
    materials: {
      categories: ['steel', 'aluminum', 'concrete', 'plastic', 'paper', 'glass'],
      fuelTypes: [],
      units: ['kg', 'tonnes']
    },
    waste: {
      categories: ['landfill', 'incineration', 'recycling', 'composting'],
      fuelTypes: [],
      units: ['kg', 'tonnes']
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset category when type changes
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        category: activityTypes[value].categories[0],
        unit: activityTypes[value].units[0]
      }));
    }
  };

  const handlePredict = async () => {
    try {
      const params = new URLSearchParams({
        activity_type: formData.type,
        category: formData.category,
        quantity: formData.quantity
      });

      if (formData.distance_km) {
        params.append('distance_km', formData.distance_km);
      }
      if (formData.fuel_type && formData.type === 'transport') {
        params.append('fuel_type', formData.fuel_type);
      }

      const response = await axios.get(`${API_URL}/api/predictions/estimate?${params}`);
      setPrediction(response.data);
    } catch (err) {
      console.error('Prediction error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const submitData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        distance_km: formData.distance_km ? parseFloat(formData.distance_km) : null
      };

      await axios.post(`${API_URL}/api/activities`, submitData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/activities');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to add activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-activity-container">
      <div className="add-activity-header">
        <h1>Add New Activity</h1>
        <p>Track your carbon footprint by adding activities</p>
      </div>

      <form onSubmit={handleSubmit} className="activity-form">
        <div className="form-row">
          <div className="form-group">
            <label>Activity Type *</label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="transport">Transport</option>
              <option value="energy">Energy</option>
              <option value="materials">Materials</option>
              <option value="waste">Waste</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              {activityTypes[formData.type].categories.map(cat => (
                <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the activity"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label>Unit *</label>
            <select name="unit" value={formData.unit} onChange={handleChange} required>
              {activityTypes[formData.type].units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {formData.type === 'transport' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Distance (km)</label>
                <input
                  type="number"
                  name="distance_km"
                  value={formData.distance_km}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  placeholder="Distance traveled"
                />
              </div>

              <div className="form-group">
                <label>Fuel Type</label>
                <select name="fuel_type" value={formData.fuel_type} onChange={handleChange}>
                  {activityTypes.transport.fuelTypes.map(fuel => (
                    <option key={fuel} value={fuel}>{fuel}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="form-actions">
          <button 
            type="button" 
            onClick={handlePredict}
            className="btn-secondary"
          >
            Estimate Emissions
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Adding...' : 'Add Activity'}
          </button>
        </div>
      </form>

      {prediction && (
        <div className="prediction-card">
          <h3>Estimated Emissions</h3>
          <div className="prediction-details">
            <div className="prediction-item">
              <span className="label">CO₂ Emissions:</span>
              <span className="value">{prediction.co2_kg} kg</span>
            </div>
            <div className="prediction-item">
              <span className="label">Tonnes:</span>
              <span className="value">{prediction.co2_tonnes} t</span>
            </div>
            <div className="prediction-item">
              <span className="label">Confidence:</span>
              <span className="value">{(prediction.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="prediction-item">
              <span className="label">Methodology:</span>
              <span className="value">{prediction.methodology}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddActivity;
