import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

interface Address {
  street?: string;
  area?: string;
  city?: string;
  pincode?: string;
}

interface Accommodation {
  _id: string;
  name?: string;
  title?: string;
  description: string;
  address: Address;
  priceRange: string;
  type: string;
  contact: string;
  images: string[];
  features: string[];
}

const AdminAccommodationEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [accommodation, setAccommodation] = useState<Accommodation>({
    _id: '',
    name: '',
    title: '',
    description: '',
    address: {
      street: '',
      area: '',
      city: '',
      pincode: ''
    },
    priceRange: '',
    type: '',
    contact: '',
    images: [],
    features: []
  });

  useEffect(() => {
    // Check if admin is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
        navigate('/');
        return;
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
      return;
    }

    // Fetch accommodation details if in edit mode
    const fetchAccommodation = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/accommodations/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Accommodation data:', response.data.data);
        setAccommodation(response.data.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching accommodation:', err);
        setError(err.response?.data?.message || 'Failed to fetch accommodation details');
        setLoading(false);
      }
    };

    if (id) {
      fetchAccommodation();
    } else {
      setLoading(false);
    }
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setAccommodation({
        ...accommodation,
        address: {
          ...accommodation.address,
          [addressField]: value
        }
      });
    } else {
      setAccommodation({
        ...accommodation,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (id) {
        // Update existing accommodation
        await axios.put(`http://localhost:5000/api/accommodations/${id}`, accommodation, {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Create new accommodation
        await axios.post('http://localhost:5000/api/accommodations', accommodation, {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
      }

      navigate('/admin/accommodations');
    } catch (err: any) {
      console.error('Error saving accommodation:', err);
      setError(err.response?.data?.message || 'Failed to save accommodation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? 'Edit Accommodation' : 'Add New Accommodation'}
          </h1>
          <Link
            to="/admin/accommodations"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to List
          </Link>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={accommodation.name || ''}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={accommodation.title || ''}
                  onChange={handleChange}
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  value={accommodation.description || ''}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  id="type"
                  value={accommodation.type || ''}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Select Type</option>
                  <option value="PG">PG</option>
                  <option value="Hostel">Hostel</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Flat">Flat</option>
                </select>
              </div>

              <div>
                <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700">
                  Price Range
                </label>
                <input
                  type="text"
                  name="priceRange"
                  id="priceRange"
                  value={accommodation.priceRange || ''}
                  onChange={handleChange}
                  required
                  placeholder="e.g. ₹5000 - ₹10000"
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                  Street
                </label>
                <input
                  type="text"
                  name="address.street"
                  id="address.street"
                  value={accommodation.address?.street || ''}
                  onChange={handleChange}
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="address.area" className="block text-sm font-medium text-gray-700">
                  Area
                </label>
                <input
                  type="text"
                  name="address.area"
                  id="address.area"
                  value={accommodation.address?.area || ''}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="address.city"
                  id="address.city"
                  value={accommodation.address?.city || ''}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="address.pincode" className="block text-sm font-medium text-gray-700">
                  Pincode
                </label>
                <input
                  type="text"
                  name="address.pincode"
                  id="address.pincode"
                  value={accommodation.address?.pincode || ''}
                  onChange={handleChange}
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                  id="contact"
                  value={accommodation.contact || ''}
                  onChange={handleChange}
                  required
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="col-span-2 mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Accommodation'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAccommodationEditPage; 