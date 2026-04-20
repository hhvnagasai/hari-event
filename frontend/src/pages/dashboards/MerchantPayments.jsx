import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import useAuth from "../../context/useAuth";
import { API_BASE, authHeaders } from "../../lib/http";
import MerchantLayout from "../../components/merchant/MerchantLayout";
import { FaCreditCard, FaRupeeSign } from "react-icons/fa";
import toast from "react-hot-toast";

const MerchantPayments = () => {
  const { token } = useAuth();
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({ total: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  const loadPayments = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/merchant/payments`, { headers: authHeaders(token) });
      setPayments(data.payments || []);
      setStats(data.stats || { total: 0, count: 0 });
    } catch (error) {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  return (
    <MerchantLayout>
      <section className="mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold">Payments</h2>
        <p className="text-gray-600 mt-1">View your payment history and earnings</p>
      </section>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }} className="mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm ring-1 ring-gray-200 relative overflow-hidden">
          <div className="stat-icon-box absolute top-3 right-3 h-8 w-8 bg-green-600 text-white flex items-center justify-center rounded-lg">
            <FaRupeeSign style={{ fontSize: 12 }} />
          </div>
          <p className="text-xs text-gray-500 mb-1">Total Earnings</p>
          <p className="font-bold text-gray-900 pr-10" style={{ fontSize: 'clamp(12px, 3vw, 18px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {formatCurrency(stats.total)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm ring-1 ring-gray-200 relative">
          <div className="stat-icon-box absolute top-3 right-3 h-8 w-8 bg-blue-600 text-white flex items-center justify-center rounded-lg">
            <FaCreditCard style={{ fontSize: 12 }} />
          </div>
          <p className="text-xs text-gray-500 mb-1">Total Transactions</p>
          <p className="text-xl font-bold text-gray-900">{stats.count}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <FaCreditCard className="mx-auto text-4xl text-gray-400 mb-4 responsive-icon" />
          <p className="text-gray-500 text-lg">No payments found</p>
          <p className="text-gray-400 mt-2">Payments will appear here when customers book</p>
        </div>
      ) : (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                <tr>
                  <th className="text-left px-6 py-3">Event</th>
                  <th className="text-left px-6 py-3">Customer</th>
                  <th className="text-left px-6 py-3">Amount</th>
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {payment.eventName || payment.event?.title || payment.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{payment.customerName || "-"}</div>
                      {payment.customerEmail && (
                        <div className="text-xs text-gray-500">{payment.customerEmail}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{formatCurrency(payment.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(payment.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        payment.status === 'success' ? 'bg-green-100 text-green-700' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {payment.status === 'success' ? 'Completed' : payment.status || 'Completed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile card list */}
          <div className="md:hidden divide-y divide-gray-100">
            {payments.map((payment) => (
              <div key={payment._id} className="p-4 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <p className="font-semibold text-gray-900 text-sm flex-1 min-w-0 truncate">
                    {payment.eventName || payment.event?.title || payment.description || "N/A"}
                  </p>
                  <span className={`flex-shrink-0 px-2 py-0.5 rounded text-xs font-medium ${
                    payment.status === 'success' ? 'bg-green-100 text-green-700' :
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {payment.status === 'success' ? 'Done' : payment.status || 'Done'}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{payment.customerName || "-"}</span>
                  <span>{formatDate(payment.createdAt)}</span>
                </div>
                <p className="text-sm font-bold text-green-700">{formatCurrency(payment.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Responsive Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767px) {
          .responsive-icon { 
            font-size: 14px !important; 
          }
          .stat-icon-box {
            height: 36px !important;
            width: 36px !important;
            border-radius: 8px !important;
          }
        }
      ` }} />
    </MerchantLayout>
  );
};

export default MerchantPayments;
