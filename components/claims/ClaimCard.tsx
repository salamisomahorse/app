
import React from 'react';
import { Link } from 'react-router-dom';
import { Claim } from '../../types';
import { CLAIM_STATUS_COLORS } from '../../constants';
import { useAuth } from '../../hooks/useAuth';

interface ClaimCardProps {
  claim: Claim;
}

const ClaimCard: React.FC<ClaimCardProps> = ({ claim }) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const detailUrl = isAdmin ? `/admin/claim/${claim.id}` : `/claim/${claim.id}`;

  return (
    <Link to={detailUrl} className="block bg-white p-5 shadow-md rounded-lg border-l-4 border-accent hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg text-gray-800 max-w-[70%]">Claim on {claim.policyType || 'Policy'}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-semibold border ${CLAIM_STATUS_COLORS[claim.status]}`}>
          {claim.status}
        </span>
      </div>
      <div className="mt-4 space-y-2 text-sm text-gray-600">
        <p><strong>Incident Date:</strong> {new Date(claim.dateOfIncident).toLocaleDateString()}</p>
        <p className="truncate"><strong>Description:</strong> {claim.description}</p>
        {isAdmin && <p><strong>Client:</strong> {claim.userEmail || 'N/A'}</p>}
      </div>
    </Link>
  );
};

export default ClaimCard;
