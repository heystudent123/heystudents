import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';

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
  nearestCollege?: string;
  distanceFromCollege?: number;
  nearestMetro?: string;
  distanceFromMetro?: number;
}

const AMENITIES = [
  'Fully furnished AC room',
  'Unlimited laundry',
  'High speed wifi up to 100mbps',
  'R-O water',
  'Dining area',
  'Hygienic meal',
  'Medical Facility',
  'Daily cleaning',
  'Attached Bathroom',
  'Fridge in Dinning Area',
  'CCTV Surveillance'
];

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
    features: [],
    nearestCollege: '',
    distanceFromCollege: undefined,
    nearestMetro: '',
    distanceFromMetro: undefined
  });

  // New state to track selected image files
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

  // Remove image helper
  const handleRemoveImage = (idx: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== idx));
  }

  
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

  // Amenity helpers
const toggleAmenity = (amenity: string) => {
  setAccommodation(prev => {
    const exists = prev.features.includes(amenity);
    const newFeatures = exists ? prev.features.filter(f => f !== amenity) : [...prev.features, amenity];
    return { ...prev, features: newFeatures };
  });
};

const handleSelectAllAmenities = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.checked) {
    setAccommodation(prev => ({ ...prev, features: AMENITIES }));
  } else {
    setAccommodation(prev => ({ ...prev, features: [] }));
  }
};

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
  if (selectedImages.some(f => f.size > 256 * 1024)) {
    setError('One or more selected images exceed the 250KB limit.');
    return;
  }
    e.preventDefault();
    setSubmitting(true);
    setError('');
    const formData = new FormData();

    // Append primitives
    formData.append('name', accommodation.name || '');
    formData.append('type', accommodation.type || 'PG');
    formData.append('description', accommodation.description || '');
    formData.append('priceRange', accommodation.priceRange || '');
    formData.append('contact', accommodation.contact || '');

    // Address fields (Mongoose supports dot notation)
    Object.entries(accommodation.address).forEach(([k, v]) => formData.append(`address.${k}`, v || ''));

    // Features
    accommodation.features.forEach(f => formData.append('features', f));

    // Metro & College
    formData.append('nearestMetro', accommodation.nearestMetro || '');
    formData.append('distanceFromMetro', String(accommodation.distanceFromMetro ?? ''));
    formData.append('nearestCollege', accommodation.nearestCollege || '');
    formData.append('distanceFromCollege', String(accommodation.distanceFromCollege ?? ''));

    // Images
    selectedImages.forEach(file => formData.append('images', file));

  // Initialize progress
  setUploadProgress(selectedImages.map(() => 0));

    try {
      const token = localStorage.getItem('token');
      
      if (id) {
        // Update existing accommodation
        await api.put(`/accommodations/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          onUploadProgress: (pe) => {
            if (!pe.total) return;
            setUploadProgress([Math.round((pe.loaded / pe.total) * 100)]);
          }
        });
      } else {
        // Create new accommodation
        await api.post('/accommodations', formData, {
        headers: { 
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          if (!total) return;
          // Distribute progress per file proportionally by size
          let bytes = loaded;
          const newProg = selectedImages.map(f => {
            if (bytes <= 0) return 0;
            const pct = Math.min(1, bytes / f.size);
            bytes -= f.size;
            return Math.round(pct * 100);
          });
          setUploadProgress(newProg);
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
                <label className="block text-sm font-medium text-gray-700">
                  Amenities (facilities)
                </label>
                {/* Select All */}
                <div className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    id="amenities_all"
                    checked={accommodation.features.length === AMENITIES.length}
                    onChange={handleSelectAllAmenities}
                    className="h-4 w-4 text-primary border-gray-300 rounded"
                  />
                  <label htmlFor="amenities_all" className="ml-2 text-sm text-gray-700">
                    Select All
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {AMENITIES.map((amenity) => (
                    <label key={amenity} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary border-gray-300 rounded"
                        checked={accommodation.features.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                      />
                      <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="nearestMetro" className="block text-sm font-medium text-gray-700">Nearest Metro</label>
                <input
                  type="text"
                  name="nearestMetro"
                  id="nearestMetro"
                  value={accommodation.nearestMetro || ''}
                  onChange={handleChange}
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="distanceFromMetro" className="block text-sm font-medium text-gray-700">Distance from Metro (km)</label>
                <input
                  type="number"
                  name="distanceFromMetro"
                  id="distanceFromMetro"
                  value={accommodation.distanceFromMetro ?? ''}
                  onChange={handleChange}
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="nearestCollege" className="block text-sm font-medium text-gray-700">Nearest College</label>
                <input
                  type="text"
                  name="nearestCollege"
                  id="nearestCollege"
                  value={accommodation.nearestCollege || ''}
                  onChange={handleChange}
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label htmlFor="distanceFromCollege" className="block text-sm font-medium text-gray-700">Distance from College (km)</label>
                <input
                  type="number"
                  name="distanceFromCollege"
                  id="distanceFromCollege"
                  value={accommodation.distanceFromCollege ?? ''}
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
              
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Images (max 6)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (!files.length) return;
                    // Filter files >250KB
                    const filtered = files.filter(f => {
                      if (f.size > 256 * 1024) {
                        setError(prev => prev || `${f.name} exceeds 250KB and was skipped`);
                        return false;
                      }
                      return true;
                    });
                    setSelectedImages(prev => {
                      const combined = [...prev, ...filtered];
                      return combined.slice(0, 6); // limit 6
                    });
                  }}
                  className="mt-1 focus:ring-primary focus:border-primary block w-full text-sm text-gray-700"
                />
              {/* Preview thumbnails */}
              {selectedImages.length > 0 && (
                <>
                <div className="col-span-2">
                  <div className="flex flex-wrap gap-4 mt-2">
                    {selectedImages.map((file, idx) => (
                      <div key={idx} className="relative w-24 h-24">
                        {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Selected image ${idx + 1}`}
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          aria-label="Remove image"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Progress bars */}
                {uploadProgress.length === selectedImages.length && uploadProgress.some(p => p < 100) && (
                  <div className="flex flex-col gap-2 w-full mt-4">
                    {uploadProgress.map((p, idx) => (
                      <div key={`prog-${idx}`} className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${p}%` }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </>)}
              </div>
              <div className="col-span-2">
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