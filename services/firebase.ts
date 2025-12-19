
// This is a mock Firebase service. Replace with actual Firebase SDK calls.
// NOTE: You would get these from your Firebase project config.
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-app",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "...",
    appId: "..."
};

// In a real app:
// import { initializeApp } from "firebase/app";
// import { getAuth, ... } from "firebase/auth";
// import { getFirestore, ... } from "firebase/firestore";
// import { getStorage, ... } from "firebase/storage";
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);
// export const storage = getStorage(app);

import { User, Policy, Claim, InsuranceType, PolicyStatus, ClaimStatus } from '../types';

// MOCK DATA
let mockUsers: User[] = [
    { uid: 'admin001', email: 'admin@insurenaija.com', fullName: 'Admin Broker', phone: '+2348000000000', role: 'admin', createdAt: new Date() },
    { uid: 'client001', email: 'client@insurenaija.com', fullName: 'Emeka Adebayo', phone: '+2348012345678', role: 'client', createdAt: new Date() },
];

let mockPolicies: Policy[] = [
    { id: 'policy001', userId: 'client001', type: InsuranceType.MOTOR_COMPREHENSIVE, status: PolicyStatus.ACTIVE, premiumAmount: 50000, currency: 'NGN', startDate: new Date('2023-10-01'), expiryDate: new Date('2024-10-01'), requestDate: new Date('2023-09-28'), details: { vehicleMake: 'Toyota', vehicleModel: 'Camry', regNumber: 'LND-123-AB' }, documents: { certificateUrl: '#' }, userEmail: 'client@insurenaija.com' },
    { id: 'policy002', userId: 'client001', type: InsuranceType.HEALTH_INDIVIDUAL, status: PolicyStatus.PENDING, premiumAmount: 75000, currency: 'NGN', requestDate: new Date(), details: { age: 34, genotype: 'AA', preExistingConditions: 'None' }, documents: {}, userEmail: 'client@insurenaija.com' },
];

let mockClaims: Claim[] = [
    { id: 'claim001', policyId: 'policy001', userId: 'client001', description: 'Minor fender bender.', dateOfIncident: new Date('2023-11-15'), status: ClaimStatus.UNDER_REVIEW, evidenceImages: [], userEmail: 'client@insurenaija.com', policyType: InsuranceType.MOTOR_COMPREHENSIVE },
];

// --- MOCK AUTH ---
export interface MockUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    role?: 'client' | 'admin';
}

let currentUser: MockUser | null = null;
const authListeners: ((user: MockUser | null) => void)[] = [];

export const onAuthStateChanged = (callback: (user: MockUser | null) => void) => {
    authListeners.push(callback);
    // Immediately notify with current user state
    callback(currentUser);
    // Return an unsubscribe function
    return () => {
        const index = authListeners.indexOf(callback);
        if (index > -1) {
            authListeners.splice(index, 1);
        }
    };
};

const notifyAuthListeners = () => {
    authListeners.forEach(listener => listener(currentUser));
};

export const mockAuth = {
    async signInWithEmailAndPassword(email: string, pass: string) {
        if ((email === 'admin@insurenaija.com' && pass === 'password123') || (email === 'client@insurenaija.com' && pass === 'password123')) {
            const role = email === 'admin@insurenaija.com' ? 'admin' : 'client';
            currentUser = { uid: role === 'admin' ? 'admin001' : 'client001', email, displayName: role === 'admin' ? 'Admin Broker' : 'Emeka Adebayo', role };
            notifyAuthListeners();
            return { user: currentUser };
        }
        throw new Error("Invalid credentials");
    },
    async createUserWithEmailAndPassword(email: string, pass: string) {
        const uid = `newUser${Math.random()}`;
        currentUser = { uid, email, displayName: 'New User', role: 'client' };
        mockUsers.push({ uid, email, fullName: 'New User', phone: '', role: 'client', createdAt: new Date() });
        notifyAuthListeners();
        return { user: currentUser };
    },
    async signOut() {
        currentUser = null;
        notifyAuthListeners();
    },
    get currentUser() {
        return currentUser;
    }
};

// --- MOCK FIRESTORE ---
export const mockDb = {
    async getDocs(collectionName: string, queryField?: string, queryValue?: any) {
        await new Promise(res => setTimeout(res, 500)); // Simulate network delay
        if (collectionName === 'policies') {
            return {
                docs: (queryField ? mockPolicies.filter(p => p[queryField as keyof Policy] === queryValue) : mockPolicies)
                    .map(doc => ({ id: doc.id, data: () => doc }))
            };
        }
        if (collectionName === 'claims') {
            return {
                docs: (queryField ? mockClaims.filter(c => c[queryField as keyof Claim] === queryValue) : mockClaims)
                    .map(doc => ({ id: doc.id, data: () => doc }))
            };
        }
        return { docs: [] };
    },
    async getDoc(collectionName: string, docId: string) {
        await new Promise(res => setTimeout(res, 500));
        let doc;
        if (collectionName === 'policies') doc = mockPolicies.find(p => p.id === docId);
        if (collectionName === 'claims') doc = mockClaims.find(c => c.id === docId);
        if (collectionName === 'users') doc = mockUsers.find(u => u.uid === docId);
        
        if (doc) {
            return { exists: () => true, id: (doc as any).id || (doc as any).uid, data: () => doc };
        }
        return { exists: () => false };
    },
    async addDoc(collectionName: string, data: any) {
        await new Promise(res => setTimeout(res, 500));
        const newId = `${collectionName.slice(0, -1)}${Math.random()}`;
        if (collectionName === 'policies') {
            mockPolicies.unshift({ ...data, id: newId, requestDate: new Date() });
        }
        if (collectionName === 'claims') {
            const policy = mockPolicies.find(p => p.id === data.policyId);
            mockClaims.unshift({ ...data, id: newId, dateOfIncident: new Date(data.dateOfIncident), policyType: policy?.type });
        }
        return { id: newId };
    },
    async updateDoc(collectionName: string, docId: string, data: any) {
        await new Promise(res => setTimeout(res, 500));
        if (collectionName === 'policies') {
            const index = mockPolicies.findIndex(p => p.id === docId);
            if (index > -1) {
                mockPolicies[index] = { ...mockPolicies[index], ...data };
                 if(data.status === PolicyStatus.ACTIVE) {
                    mockPolicies[index].startDate = new Date();
                    const expiry = new Date();
                    expiry.setFullYear(expiry.getFullYear() + 1);
                    mockPolicies[index].expiryDate = expiry;
                }
            }
        }
        if (collectionName === 'claims') {
            const index = mockClaims.findIndex(c => c.id === docId);
            if (index > -1) {
                mockClaims[index] = { ...mockClaims[index], ...data };
            }
        }
    }
};

// --- MOCK STORAGE ---
export const mockStorage = {
    async uploadBytes(path: string, file: File) {
        await new Promise(res => setTimeout(res, 1000));
        console.log(`Uploaded ${file.name} to ${path}`);
        return {
            ref: {
                path: path
            }
        };
    },
    async getDownloadURL(path: string) {
        await new Promise(res => setTimeout(res, 200));
        return `https://firebasestorage.mock/path/to/${path.split('/').pop()}`;
    }
};
