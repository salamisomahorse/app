
import React from 'react';
import { Link } from 'react-router-dom';
import { Policy } from '../../types';
import { POLICY_STATUS_COLORS } from '../../constants';
import { useAuth } from '../../hooks/useAuth';

interface PolicyCardProps {
  policy: Policy;
}

const PolicyCard: React.FC<PolicyCardProps> = ({ policy }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const detailUrl = isAdmin ? `/admin/policy/${policy.id}` : `/policy/${policy.id}`;

  return (
    <Link to={detailUrl} className="block bg-white p-5 shadow-md rounded-lg border-l-4 border-primary hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg text-gray-800">{policy.type}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${POLICY_STATUS_COLORS[policy.status]}`}>
          {policy.status}
        </span>
      </div>
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <p><strong>Premium:</strong> {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(policy.premiumAmount)}</p>
        <p><strong>Request Date:</strong> {new Date(policy.requestDate).toLocaleDateString()}</p>
        {isAdmin && <p><strong>Client:</strong> {policy.userEmail || 'N/A'}</p>}
        {policy.expiryDate && (
           <p><strong>Expires On:</strong> {new Date(policy.expiryDate).toLocaleDateString()}</p>
        )}
      </div>
    </Link>
  );
};

export default PolicyCard;
