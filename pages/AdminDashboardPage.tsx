
import React, { useState, useEffect, useCallback } from 'react';
import { Policy, Claim, PolicyStatus, ClaimStatus } from '../types';
import { mockDb } from '../services/firebase';
import Spinner from '../components/common/Spinner';
import PolicyCard from '../components/policies/PolicyCard';
import ClaimCard from '../components/claims/ClaimCard';
import { useToast } from '../context/ToastContext';

type Tab = 'policies' | 'claims';

const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('policies');
  const [allPolicies, setAllPolicies] = useState<Policy[]>([]);
  const [allClaims, setAllClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [policySnapshot, claimSnapshot] = await Promise.all([
        mockDb.getDocs('policies'),
        mockDb.getDocs('claims')
      ]);
      const policiesData = policySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Policy));
      const claimsData = claimSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Claim));
      setAllPolicies(policiesData);
      setAllClaims(claimsData);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      addToast("Could not load admin data.", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const pendingPolicies = allPolicies.filter(p => p.status === PolicyStatus.PENDING);
  const underReviewClaims = allClaims.filter(c => c.status === ClaimStatus.UNDER_REVIEW || c.status === ClaimStatus.SUBMITTED);
  const otherPolicies = allPolicies.filter(p => p.status !== PolicyStatus.PENDING);
  const otherClaims = allClaims.filter(c => c.status !== ClaimStatus.UNDER_REVIEW && c.status !== ClaimStatus.SUBMITTED);

  const tabClass = (tabName: Tab) => `px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === tabName ? 'border-b-2 border-primary text-primary bg-white' : 'text-gray-500 hover:text-gray-700'}`;

  if (loading) {
    return <div className="p-8"><Spinner /></div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button onClick={() => setActiveTab('policies')} className={tabClass('policies')}>
            Policies ({allPolicies.length})
          </button>
          <button onClick={() => setActiveTab('claims')} className={tabClass('claims')}>
            Claims ({allClaims.length})
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'policies' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Pending Policy Requests ({pendingPolicies.length})</h2>
            {pendingPolicies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingPolicies.map(p => <PolicyCard key={p.id} policy={p} />)}
              </div>
            ) : <p className="text-gray-500">No pending policy requests.</p>}

            <hr className="my-8" />

            <h2 className="text-xl font-semibold text-gray-700 mb-4">Other Policies ({otherPolicies.length})</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPolicies.map(p => <PolicyCard key={p.id} policy={p} />)}
            </div>
          </div>
        )}
        {activeTab === 'claims' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Claims Awaiting Review ({underReviewClaims.length})</h2>
            {underReviewClaims.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {underReviewClaims.map(c => <ClaimCard key={c.id} claim={c} />)}
              </div>
            ) : <p className="text-gray-500">No claims awaiting review.</p>}

            <hr className="my-8" />
            
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Other Claims ({otherClaims.length})</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherClaims.map(c => <ClaimCard key={c.id} claim={c} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
