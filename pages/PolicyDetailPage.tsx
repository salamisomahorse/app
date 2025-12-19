
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Policy } from '../types';
import { mockDb } from '../services/firebase';
import Spinner from '../components/common/Spinner';
import { POLICY_STATUS_COLORS } from '../constants';
import { useToast } from '../context/ToastContext';

const PolicyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [policy, setPolicy] = useState<Policy | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    const fetchPolicy = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const docSnap = await mockDb.getDoc('policies', id);
            if (docSnap.exists()) {
                setPolicy({ id: docSnap.id, ...docSnap.data() } as Policy);
            } else {
                addToast("Policy not found.", "error");
            }
        } catch (error) {
            console.error("Error fetching policy:", error);
            addToast("Failed to load policy details.", "error");
        } finally {
            setLoading(false);
        }
    }, [id, addToast]);

    useEffect(() => {
        fetchPolicy();
    }, [fetchPolicy]);

    if (loading) return <div className="p-8"><Spinner /></div>;
    if (!policy) return <div className="p-8 text-center text-gray-600">Policy details could not be loaded.</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Link to="/dashboard" className="text-primary hover:underline mb-6 inline-block">&larr; Back to Dashboard</Link>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <header className="bg-primary text-white p-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{policy.type}</h1>
                        <span className={`text-sm px-3 py-1 rounded-full font-semibold border-2 ${POLICY_STATUS_COLORS[policy.status].replace('bg-', 'border-').replace('text-', 'text-white ')}`}>
                            {policy.status}
                        </span>
                    </div>
                    <p className="mt-2 text-primary-light">Policy ID: {policy.id}</p>
                </header>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-700">Premium</h3>
                            <p className="text-xl text-gray-900">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(policy.premiumAmount)}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Coverage Period</h3>
                            <p className="text-gray-900">
                                {policy.startDate ? new Date(policy.startDate).toLocaleDateString() : 'N/A'} - {policy.expiryDate ? new Date(policy.expiryDate).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Policy Details</h3>
                        <div className="bg-gray-50 p-4 rounded-md grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(policy.details).map(([key, value]) => (
                                <div key={key}>
                                    <p className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                                    <p className="text-md text-gray-800">{String(value)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Documents</h3>
                        <div className="space-y-2">
                           {policy.documents.certificateUrl ? (
                                <a href={policy.documents.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Download Insurance Certificate</a>
                           ) : <p className="text-gray-500 text-sm">Certificate not yet available.</p>}
                           {policy.documents.kycDocuments && policy.documents.kycDocuments.length > 0 && (
                               <div>
                                   <p className="font-medium text-gray-600 mt-2">Submitted KYC:</p>
                                   <ul className="list-disc list-inside">
                                       {policy.documents.kycDocuments.map(doc => <li key={doc.url}><a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{doc.name}</a></li>)}
                                   </ul>
                               </div>
                           )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PolicyDetailPage;
