
import { PolicyStatus, ClaimStatus } from './types';

export const POLICY_STATUS_COLORS: Record<PolicyStatus, string> = {
  [PolicyStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  [PolicyStatus.ACTIVE]: 'bg-green-100 text-green-800 border-green-400',
  [PolicyStatus.EXPIRED]: 'bg-gray-100 text-gray-800 border-gray-400',
  [PolicyStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-400',
};

export const CLAIM_STATUS_COLORS: Record<ClaimStatus, string> = {
  [ClaimStatus.SUBMITTED]: 'bg-blue-100 text-blue-800 border-blue-400',
  [ClaimStatus.UNDER_REVIEW]: 'bg-yellow-100 text-yellow-800 border-yellow-400',
  [ClaimStatus.APPROVED]: 'bg-teal-100 text-teal-800 border-teal-400',
  [ClaimStatus.PAID]: 'bg-green-100 text-green-800 border-green-400',
  [ClaimStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-400',
};

export const INSURANCE_TYPES_OPTIONS = [
    { value: "Motor - Comprehensive", label: "Motor - Comprehensive" },
    { value: "Motor - Third Party", label: "Motor - Third Party" },
    { value: "Health - Individual", label: "Health - Individual" },
    { value: "Health - Family", label: "Health - Family" },
    { value: "Life - Term Life", label: "Life - Term Life" },
    { value: "Travel - Schengen", label: "Travel - Schengen" },
    { value: "General - Fire & Special Perils", label: "General - Fire & Special Perils" },
];
