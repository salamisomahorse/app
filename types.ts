
export interface User {
  uid: string;
  email: string | null;
  fullName: string;
  phone: string;
  role: 'client' | 'admin';
  createdAt: Date;
}

export enum InsuranceType {
  MOTOR_THIRD_PARTY = "Motor - Third Party",
  MOTOR_COMPREHENSIVE = "Motor - Comprehensive",
  HEALTH_INDIVIDUAL = "Health - Individual",
  HEALTH_FAMILY = "Health - Family",
  LIFE_TERM = "Life - Term Life",
  TRAVEL_SCHENGEN = "Travel - Schengen",
  GENERAL_FIRE = "General - Fire & Special Perils",
}

export enum PolicyStatus {
  PENDING = "Pending",
  ACTIVE = "Active",
  EXPIRED = "Expired",
  REJECTED = "Rejected",
}

export enum ClaimStatus {
  SUBMITTED = "Submitted",
  UNDER_REVIEW = "Under Review",
  APPROVED = "Approved",
  PAID = "Paid",
  REJECTED = "Rejected",
}

export interface Policy {
  id: string;
  userId: string;
  type: InsuranceType;
  status: PolicyStatus;
  premiumAmount: number;
  currency: "NGN";
  startDate?: Date;
  expiryDate?: Date;
  requestDate: Date;
  details: Record<string, any>;
  documents: {
    certificateUrl?: string;
    inspectionReportUrl?: string;
    kycDocuments?: { name: string; url: string }[];
  };
  userEmail?: string;
}

export interface Claim {
  id: string;
  policyId: string;
  userId: string;
  description: string;
  dateOfIncident: Date;
  status: ClaimStatus;
  evidenceImages: { name: string; url:string }[];
  userEmail?: string;
  policyType?: InsuranceType;
}
