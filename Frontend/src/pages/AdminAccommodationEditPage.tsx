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
  gender?: string;
  uniqueCode?: string;
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
    uniqueCode: '',
    gender: '',
    features: [],
    nearestCollege: '',
    distanceFromCollege: undefined,
    nearestMetro: '',
    distanceFromMetro: undefined
  });

  // Image link states
  const [imageLinks, setImageLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');
  
  

  // Remove image helper
  const handleAddLink = () => {
    if (!newLink.trim()) return;
    if (imageLinks.length >= 6) { setError('Maximum 6 images allowed'); return; }
    setImageLinks(prev => [...prev, newLink.trim()]);
    setNewLink('');
  };

  const handleRemoveLink = (idx: number) => {
    setImageLinks(prev => prev.filter((_, i) => i !== idx));
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
        const fetched = response.data.data;
        setAccommodation({
          ...fetched,
          features: fetched.features ?? fetched.amenities ?? [],
          images: fetched.images ?? []
        });
    setImageLinks(response.data.data.images || []);
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
    // generic field handler
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
    if (!accommodation.name || !accommodation.name.trim()) { setError('Name is required'); return; }

    // incorporate any link that has been typed but not yet "Added"
    const cleanedLinks = [
      ...imageLinks,
      ...(newLink.trim()
        ? newLink
            .split(/[,\n]/)
            .map(s => s.trim())
            .filter(Boolean)
        : [])
    ]
      .map(l => l.trim())
      .filter((l, idx, arr) => l && arr.indexOf(l) === idx); // remove empties & duplicates

    setSubmitting(true);
    setError('');
    const payload = { ...accommodation, images: cleanedLinks };
    try {
      const token = localStorage.getItem('token');
      if (id) {
        await api.put(`/accommodations/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await api.post('/accommodations', payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      navigate('/admin/accommodations');
    } catch (err: any) {
      console.error('Error saving accommodation:', err);
      setError(err.response?.data?.message || 'Failed to save accommodation');
    } finally {
      setSubmitting(false);
    }
  };
  
  // Helpers for combined location + distance fields
  const combinedMetroValue = `${accommodation.nearestMetro || ''}${accommodation.distanceFromMetro != null ? ', ' + accommodation.distanceFromMetro : ''}`;
  const combinedCollegeValue = `${accommodation.nearestCollege || ''}${accommodation.distanceFromCollege != null ? ', ' + accommodation.distanceFromCollege : ''}`;

  const handleMetroCombined = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [namePart, distPart] = e.target.value.split(',').map(s => s.trim());
    setAccommodation(prev => ({
      ...prev,
      nearestMetro: namePart || '',
      distanceFromMetro: distPart ? Number(distPart) : undefined
    }));
  };

  const handleCollegeCombined = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [namePart, distPart] = e.target.value.split(',').map(s => s.trim());
    setAccommodation(prev => ({
      ...prev,
      nearestCollege: namePart || '',
      distanceFromCollege: distPart ? Number(distPart) : undefined
    }));
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
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={accommodation.name || ''}
                  onChange={handleChange}
                  
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="uniqueCode" className="block text-sm font-medium text-gray-700">
                  Unique Code (Custom)
                </label>
                <input
                  type="text"
                  name="uniqueCode"
                  id="uniqueCode"
                  value={accommodation.uniqueCode || ''}
                  onChange={handleChange}
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
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Accommodation For
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={accommodation.gender || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                >
                  <option value="">Select</option>
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                  <option value="Co-ed">Co-ed</option>
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
                  placeholder="e.g. ₹5000 - ₹10000"
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
                <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="address.city"
                  id="address.city"
                  value={accommodation.address?.city || ''}
                  onChange={handleChange}
                  
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
                  Image Links (comma separated, max 6)
                </label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="url"
                    value={newLink}
                    onChange={(e)=>setNewLink(e.target.value)}
                    className="flex-1 focus:ring-primary focus:border-primary block w-full text-sm border-gray-300 rounded-md"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button type="button" onClick={handleAddLink} className="px-3 py-1 bg-primary text-white rounded-md disabled:opacity-50" disabled={imageLinks.length>=6}>Add</button>
                </div>
                {imageLinks.length>0 && (
                  <div className="flex flex-wrap gap-4 mt-3">
                    {imageLinks.map((url,idx)=>(
                      <div key={idx} className="relative w-24 h-24">
                        <img src={url} alt={`img-${idx}`} className="w-full h-full object-cover rounded-md" />
                        <button type="button" onClick={()=>handleRemoveLink(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center">&times;</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="nearestMetroCombined" className="block text-sm font-medium text-gray-700">Nearest Metro & Distance (km) — comma separated</label>
                <input
                  type="text"
                  name="nearestMetroCombined"
                  id="nearestMetroCombined"
                  placeholder="Hauz Khas, 0.5"
                  value={combinedMetroValue}
                  onChange={handleMetroCombined}
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="nearestCollegeCombined" className="block text-sm font-medium text-gray-700">Nearest College & Distance (km) — comma separated</label>
                <input
                  type="text"
                  name="nearestCollegeCombined"
                  id="nearestCollegeCombined"
                  placeholder="IIT Delhi, 1.2"
                  value={combinedCollegeValue}
                  onChange={handleCollegeCombined}
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
                    checked={(accommodation.features?.length || 0) === AMENITIES.length}
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
                <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                  id="contact"
                  value={accommodation.contact || ''}
                  onChange={handleChange}
                  
                  className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
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