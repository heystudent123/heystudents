import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  createdAt: string;
  distance?: string;
}

const AdminAccommodationsPage: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

    // Fetch accommodations
    const fetchAccommodations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/accommodations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Accommodation data:', response.data.data[0]);
        setAccommodations(response.data.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching accommodations:', err);
        setError(err.response?.data?.message || 'Failed to fetch accommodations');
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, [navigate]);

  const deleteAccommodation = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this accommodation?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/accommodations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from state
      setAccommodations(accommodations.filter(acc => acc._id !== id));
    } catch (err: any) {
      console.error('Error deleting accommodation:', err);
      alert(err.response?.data?.message || 'Failed to delete accommodation');
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Accommodation Management</h1>
          <div className="flex space-x-4">
            <Link
              to="/admin"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Dashboard
            </Link>
            <Link
              to="/admin/accommodations/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
            >
              Add New Accommodation
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Accommodations</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              View and manage accommodation listings.
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name/Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price Range
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accommodations.length > 0 ? (
                  accommodations.map((accommodation) => (
                    <tr key={accommodation._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {accommodation.name || accommodation.title || "Unnamed Accommodation"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{accommodation.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{accommodation.priceRange}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {typeof accommodation.address === 'object' 
                            ? `${accommodation.address.street ? accommodation.address.street + ', ' : ''}${accommodation.address.area || ''}, ${accommodation.address.city || ''}`
                            : accommodation.address}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-4">
                          <a
                            href={`/accommodation/${accommodation._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/accommodation/${accommodation._id}`);
                            }}
                          >
                            View
                          </a>
                          <Link
                            to={`/admin/accommodations/edit/${accommodation._id}`}
                            className="text-primary hover:text-primary/80"
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(`/admin/accommodations/edit/${accommodation._id}`);
                            }}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteAccommodation(accommodation._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      No accommodations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAccommodationsPage; 