import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SharedNavbar from '../components/SharedNavbar';
import { paymentsApi } from '../services/api';
import * as XLSX from 'xlsx';

interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  college?: string;
  courseTitle?: string;
  referralCode?: string;
  converted: boolean;
  createdAt: string;
}

const AdminPrePaymentLeadsPage: React.FC = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Admin auth guard
  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/login'); return; }
    try {
      const u = JSON.parse(stored);
      if (u.role !== 'admin') navigate('/');
    } catch { navigate('/login'); }
  }, [navigate]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await paymentsApi.getAllLeads();
      setLeads(res.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load leads.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    return (
      l.name?.toLowerCase().includes(q) ||
      l.phone?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.city?.toLowerCase().includes(q) ||
      l.college?.toLowerCase().includes(q) ||
      l.courseTitle?.toLowerCase().includes(q)
    );
  });

  const exportExcel = () => {
    const rows = filtered.map(l => ({
      Name: l.name,
      Phone: l.phone,
      Email: l.email || '',
      City: l.city || '',
      College: l.college || '',
      Course: l.courseTitle || '',
      'Referral Code': l.referralCode || '',
      Converted: l.converted ? 'Yes' : 'No',
      Date: l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-IN') : '',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pre-Payment Leads');
    XLSX.writeFile(wb, `pre-payment-leads-${Date.now()}.xlsx`);
  };

  const convertedCount = leads.filter(l => l.converted).length;

  return (
    <>
      <SharedNavbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pre-Payment Leads</h1>
              <p className="text-gray-500 mt-1 text-sm">
                Student details collected before payment — {leads.length} total, {convertedCount} converted
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchLeads}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Refresh
              </button>
              <button
                onClick={exportExcel}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Export Excel
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{leads.length}</div>
              <div className="text-sm text-gray-500 mt-0.5">Total Leads</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{convertedCount}</div>
              <div className="text-sm text-gray-500 mt-0.5">Converted (Paid)</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-amber-500">{leads.length - convertedCount}</div>
              <div className="text-sm text-gray-500 mt-0.5">Not Yet Converted</div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, phone, email, city, college…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No leads found.</div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Name', 'Phone', 'Email', 'City', 'College', 'Course', 'Ref Code', 'Converted', 'Date'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(lead => (
                      <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{lead.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                          <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                          {lead.email
                            ? <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                            : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{lead.city || <span className="text-gray-300">—</span>}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{lead.college || <span className="text-gray-300">—</span>}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{lead.courseTitle || <span className="text-gray-300">—</span>}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{lead.referralCode || <span className="text-gray-300">—</span>}</td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${lead.converted ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-600'}`}>
                            {lead.converted ? 'Paid ✓' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-IN') : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPrePaymentLeadsPage;
