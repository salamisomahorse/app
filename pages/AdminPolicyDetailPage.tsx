
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Policy, PolicyStatus } from '../types';
import { mockDb, mockStorage } from '../services/firebase';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import { POLICY_STATUS_COLORS } from '../constants';
import { useToast } from '../context/ToastContext';

const AdminPolicyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [policy, setPolicy] = useState<Policy | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
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

    const handleStatusChange = async (newStatus: PolicyStatus) => {
        if (!id) return;
        setIsUpdating(true);
        try {
            await mockDb.updateDoc('policies', id, { status: newStatus });
            addToast(`Policy status updated to ${newStatus}`, 'success');
            fetchPolicy(); // Refresh data
        } catch (error) {
            addToast('Failed to update status', 'error');
        } finally {
            setIsUpdating(false);
        }
    };
    
    const handleCertificateUpload = async () => {
        if (!id || !certificateFile || !policy) return;
        setIsUpdating(true);
        try {
            const filePath = `certificates/${policy.userId}/${id}_${certificateFile.name}`;
            await mockStorage.uploadBytes(filePath, certificateFile);
            const certificateUrl = await mockStorage.getDownloadURL(filePath);
            await mockDb.updateDoc('policies', id, { 'documents.certificateUrl': certificateUrl });
            addToast('Certificate uploaded successfully!', 'success');
            setCertificateFile(null);
            fetchPolicy();
        } catch (error) {
            addToast('Failed to upload certificate', 'error');
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return <div className="p-8"><Spinner /></div>;
    if (!policy) return <div className="p-8 text-center text-gray-600">Policy details could not be loaded.</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Link to="/admin" className="text-primary hover:underline mb-6 inline-block">&larr; Back to Admin Dashboard</Link>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <header className="bg-gray-800 text-white p-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold">{policy.type}</h1>
                        <span className={`text-sm px-3 py-1 rounded-full font-semibold border-2 ${POLICY_STATUS_COLORS[policy.status].replace('bg-', 'border-').replace('text-', 'text-white ')}`}>
                            {policy.status}
                        </span>
                    </div>
                    <p className="mt-2 text-gray-300">Client: {policy.userEmail}</p>
                </header>
                <div className="p-6 space-y-6">
                    {/* Policy details render here, similar to client view */}
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
                         {policy.documents.kycDocuments && policy.documents.kycDocuments.length > 0 ? (
                               <div>
                                   <p className="font-medium text-gray-600 mt-2">Submitted KYC:</p>
                                   <ul className="list-disc list-inside">
                                       {policy.documents.kycDocuments.map(doc => <li key={doc.url}><a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{doc.name}</a></li>)}
                                   </ul>
                               </div>
                           ): <p className="text-gray-500 text-sm">No KYC documents submitted.</p>}
                           <p className="mt-2 text-gray-600">
                            <strong>Certificate: </strong>
                            {policy.documents.certificateUrl ? <a href={policy.documents.certificateUrl} className="text-primary hover:underline" target="_blank" rel="noreferrer">View Certificate</a> : 'Not uploaded.'}
                           </p>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-4">Admin Actions</h3>
                        <div className="space-y-4">
                             {policy.status === PolicyStatus.PENDING && (
                                <div className="flex gap-4">
                                    <Button onClick={() => handleStatusChange(PolicyStatus.ACTIVE)} isLoading={isUpdating} variant="primary">Approve Policy</Button>
                                    <Button onClick={() => handleStatusChange(PolicyStatus.REJECTED)} isLoading={isUpdating} variant="secondary">Reject Policy</Button>
                                </div>
                             )}

                             {policy.status === PolicyStatus.ACTIVE && (
                                <div className="space-y-2">
                                     <label htmlFor="cert-upload" className="block text-sm font-medium text-gray-700">Upload Certificate PDF</label>
                                     <input id="cert-upload" type="file" accept=".pdf" onChange={(e) => setCertificateFile(e.target.files ? e.target.files[0] : null)} className="text-sm" />
                                     {certificateFile && <Button onClick={handleCertificateUpload} isLoading={isUpdating} variant="accent" className="mt-2">Upload</Button>}
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPolicyDetailPage;
