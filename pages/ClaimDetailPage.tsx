
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Claim } from '../types';
import { mockDb } from '../services/firebase';
import Spinner from '../components/common/Spinner';
import { CLAIM_STATUS_COLORS } from '../constants';
import { useToast } from '../context/ToastContext';

const ClaimDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [claim, setClaim] = useState<Claim | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToast } = useToast();

    const fetchClaim = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const docSnap = await mockDb.getDoc('claims', id);
            if (docSnap.exists()) {
                setClaim({ id: docSnap.id, ...docSnap.data() } as Claim);
            } else {
                addToast("Claim not found.", "error");
            }
        } catch (error) {
            console.error("Error fetching claim:", error);
            addToast("Failed to load claim details.", "error");
        } finally {
            setLoading(false);
        }
    }, [id, addToast]);

    useEffect(() => {
        fetchClaim();
    }, [fetchClaim]);

    if (loading) return <div className="p-8"><Spinner /></div>;
    if (!claim) return <div className="p-8 text-center text-gray-600">Claim details could not be loaded.</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Link to="/dashboard" className="text-primary hover:underline mb-6 inline-block">&larr; Back to Dashboard</Link>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <header className="bg-accent text-white p-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Claim on {claim.policyType}</h1>
                        <span className={`text-sm px-3 py-1 rounded-full font-semibold border-2 ${CLAIM_STATUS_COLORS[claim.status].replace('bg-', 'border-').replace('text-', 'text-white ')}`}>
                            {claim.status}
                        </span>
                    </div>
                    <p className="mt-2 text-accent-light">Claim ID: {claim.id}</p>
                </header>
                <div className="p-6 space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-700">Policy ID</h3>
                            <Link to={`/policy/${claim.policyId}`} className="text-primary hover:underline">{claim.policyId}</Link>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-700">Date of Incident</h3>
                            <p className="text-gray-900">{new Date(claim.dateOfIncident).toLocaleDateString()}</p>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                        <p className="text-gray-800 bg-gray-50 p-4 rounded-md">{claim.description}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Evidence</h3>
                        {claim.evidenceImages.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {claim.evidenceImages.map((image, index) => (
                                    <a href={image.url} key={index} target="_blank" rel="noopener noreferrer" className="block">
                                        <img src={`https://picsum.photos/200?random=${index}`} alt={image.name} className="rounded-md object-cover w-full h-32 hover:opacity-80 transition-opacity" />
                                        <p className="text-xs text-center mt-1 truncate text-gray-600">{image.name}</p>
                                    </a>
                                ))}
                            </div>
                        ) : <p className="text-gray-500 text-sm">No evidence was uploaded with this claim.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaimDetailPage;
