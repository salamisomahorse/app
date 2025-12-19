
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { mockDb } from '../services/firebase';
import { Policy, Claim } from '../types';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';
import PolicyCard from '../components/policies/PolicyCard';
import ClaimCard from '../components/claims/ClaimCard';
import { useToast } from '../context/ToastContext';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [claims, setClaims] = useState<Claim[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [policySnapshot, claimSnapshot] = await Promise.all([
                mockDb.getDocs('policies', 'userId', user.uid),
                mockDb.getDocs('claims', 'userId', user.uid)
            ]);
            
            const userPolicies = policySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Policy));
            const userClaims = claimSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Claim));
            
            setPolicies(userPolicies);
            setClaims(userClaims);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
            addToast("Could not load your data. Please try again later.", "error");
        } finally {
            setLoading(false);
        }
    }, [user, addToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return <div className="p-8"><Spinner /></div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Welcome, {user?.fullName}!</h1>
                <p className="text-gray-600 mt-2">Here's an overview of your insurance portfolio.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Get Covered Today</h2>
                    <p className="text-gray-600 mb-6">Need new insurance? Get a personalized quote in minutes. It's fast, easy, and secure.</p>
                    <Button variant="accent" onClick={() => navigate('/get-quote')}>
                       Get a Quote
                    </Button>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Need to File a Claim?</h2>
                    <p className="text-gray-600 mb-6">Report an incident and submit your claim through our simple and guided process.</p>
                     <Button variant="primary" onClick={() => navigate('/file-claim')}>
                       File a Claim
                    </Button>
                </div>
            </div>

            <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">My Policies ({policies.length})</h2>
                {policies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {policies.map(policy => <PolicyCard key={policy.id} policy={policy} />)}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-white rounded-lg shadow-md">
                        <p className="text-gray-600">You have no active or pending policies.</p>
                        <Link to="/get-quote" className="text-primary hover:underline mt-2 inline-block">Get your first policy now</Link>
                    </div>
                )}
            </section>

            <section className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">My Claims ({claims.length})</h2>
                {claims.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {claims.map(claim => <ClaimCard key={claim.id} claim={claim} />)}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-white rounded-lg shadow-md">
                        <p className="text-gray-600">You have not filed any claims.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default DashboardPage;
