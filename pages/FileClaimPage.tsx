
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { mockDb, mockStorage } from '../services/firebase';
import { Policy, PolicyStatus, ClaimStatus } from '../types';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { useToast } from '../context/ToastContext';
import Spinner from '../components/common/Spinner';

const FileClaimPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [activePolicies, setActivePolicies] = useState<Policy[]>([]);
    const [selectedPolicyId, setSelectedPolicyId] = useState('');
    const [dateOfIncident, setDateOfIncident] = useState('');
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchActivePolicies = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const policiesSnapshot = await mockDb.getDocs('policies', 'userId', user.uid);
            const userPolicies = policiesSnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as Policy))
                .filter(p => p.status === PolicyStatus.ACTIVE);
            setActivePolicies(userPolicies);
            if (userPolicies.length > 0) {
                setSelectedPolicyId(userPolicies[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch active policies:", error);
            addToast("Could not load your policies. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    }, [user, addToast]);
    
    useEffect(() => {
        fetchActivePolicies();
    }, [fetchActivePolicies]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedPolicyId || !dateOfIncident || !description) {
            addToast('Please fill all required fields.', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            const evidenceImages: {name: string, url: string}[] = [];
            if (files) {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const filePath = `claims/${user.uid}/${selectedPolicyId}/${Date.now()}_${file.name}`;
                    await mockStorage.uploadBytes(filePath, file);
                    const downloadURL = await mockStorage.getDownloadURL(filePath);
                    evidenceImages.push({ name: file.name, url: downloadURL });
                }
            }

            const claimData = {
                userId: user.uid,
                userEmail: user.email,
                policyId: selectedPolicyId,
                dateOfIncident,
                description,
                status: ClaimStatus.SUBMITTED,
                evidenceImages,
            };

            await mockDb.addDoc('claims', claimData);
            addToast('Your claim has been submitted successfully!', 'success');
            navigate('/dashboard');
        } catch (error) {
            console.error("Error submitting claim:", error);
            addToast('Failed to submit claim. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-8"><Spinner /></div>;
    
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">File a New Claim</h1>
            <p className="text-gray-600 mb-8">Please provide the details of the incident below.</p>
            
            {activePolicies.length === 0 ? (
                <div className="text-center bg-white p-8 rounded-lg shadow-lg">
                    <p className="text-gray-600">You do not have any active policies to file a claim against.</p>
                    <p className="text-sm text-gray-500 mt-2">A policy must be 'Active' to be eligible for a claim.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                    <Select
                        label="Select Policy to Claim Against"
                        id="policy"
                        value={selectedPolicyId}
                        onChange={e => setSelectedPolicyId(e.target.value)}
                        options={activePolicies.map(p => ({ value: p.id, label: `${p.type} - ID: ${p.id.substring(0,8)}...` }))}
                        required
                    />
                    
                    <Input
                        label="Date of Incident"
                        id="dateOfIncident"
                        type="date"
                        value={dateOfIncident}
                        onChange={e => setDateOfIncident(e.target.value)}
                        required
                    />

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description of Incident</label>
                        <textarea
                            id="description"
                            rows={4}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Upload Evidence (Photos, Reports, etc.)
                        </label>
                         <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <div className="flex text-sm text-gray-600"><label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"><span>Upload files</span><input id="file-upload" name="files" type="file" className="sr-only" multiple onChange={handleFileChange} /></label><p className="pl-1">or drag and drop</p></div>
                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                            </div>
                        </div>
                        {files && <div className="mt-2 text-sm text-gray-500">{files.length} file(s) selected.</div>}
                    </div>

                    <Button type="submit" isLoading={isSubmitting} variant="primary">
                        Submit Claim
                    </Button>
                </form>
            )}
        </div>
    );
};

export default FileClaimPage;
