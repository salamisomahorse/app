
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { mockDb, mockStorage } from '../services/firebase';
import { InsuranceType, PolicyStatus } from '../types';
import { INSURANCE_TYPES_OPTIONS } from '../constants';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import { useToast } from '../context/ToastContext';

const GetQuotePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [insuranceType, setInsuranceType] = useState<InsuranceType>(InsuranceType.MOTOR_COMPREHENSIVE);
  const [formDetails, setFormDetails] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const premium = useMemo(() => {
    if (insuranceType === InsuranceType.MOTOR_COMPREHENSIVE && formDetails.vehicleValue) {
      return Number(formDetails.vehicleValue) * 0.05; // 5% of vehicle value
    }
    if (insuranceType === InsuranceType.MOTOR_THIRD_PARTY) return 15000; // Flat rate for third party
    if (insuranceType === InsuranceType.HEALTH_INDIVIDUAL && formDetails.age) {
        return 50000 + (Number(formDetails.age) * 100);
    }
    return 0;
  }, [insuranceType, formDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || premium <= 0) {
      addToast('Please complete the form and ensure a premium is calculated.', 'error');
      return;
    }
    setIsLoading(true);

    try {
      const kycDocuments: {name: string, url: string}[] = [];
      if (files) {
          for (let i = 0; i < files.length; i++) {
              const file = files[i];
              const filePath = `kyc/${user.uid}/${Date.now()}_${file.name}`;
              await mockStorage.uploadBytes(filePath, file);
              const downloadURL = await mockStorage.getDownloadURL(filePath);
              kycDocuments.push({ name: file.name, url: downloadURL });
          }
      }

      const policyData = {
        userId: user.uid,
        userEmail: user.email,
        type: insuranceType,
        details: formDetails,
        status: PolicyStatus.PENDING,
        premiumAmount: premium,
        currency: 'NGN',
        documents: { kycDocuments },
      };

      await mockDb.addDoc('policies', policyData);
      addToast('Your quote request has been submitted!', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error("Error submitting quote:", error);
      addToast('Failed to submit request. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormFields = () => {
    switch (insuranceType) {
      case InsuranceType.MOTOR_COMPREHENSIVE:
      case InsuranceType.MOTOR_THIRD_PARTY:
        return (
          <>
            <Input label="Vehicle Make" name="vehicleMake" onChange={handleDetailChange} required />
            <Input label="Vehicle Model" name="vehicleModel" onChange={handleDetailChange} required />
            <Input label="Vehicle Year" name="vehicleYear" type="number" onChange={handleDetailChange} required />
            <Input label="Registration Number" name="regNumber" onChange={handleDetailChange} required />
            <Input label="Chassis Number" name="chassisNumber" onChange={handleDetailChange} required />
            {insuranceType === InsuranceType.MOTOR_COMPREHENSIVE && 
                <Input label="Vehicle Value (NGN)" name="vehicleValue" type="number" onChange={handleDetailChange} required />
            }
          </>
        );
      case InsuranceType.HEALTH_INDIVIDUAL:
      case InsuranceType.HEALTH_FAMILY:
        return (
          <>
            <Input label="Age" name="age" type="number" onChange={handleDetailChange} required />
            <Input label="Genotype" name="genotype" onChange={handleDetailChange} />
            <Input label="Pre-existing Conditions" name="preExistingConditions" onChange={handleDetailChange} />
             {insuranceType === InsuranceType.HEALTH_FAMILY &&
                <Input label="Number of Dependents" name="dependents" type="number" onChange={handleDetailChange} required />
             }
          </>
        );
      default:
        return <p className="text-gray-500">Form fields for this insurance type are not yet available.</p>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Get an Insurance Quote</h1>
      <p className="text-gray-600 mb-8">Fill in the details below to get an instant premium estimate.</p>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
        <div>
          <Select 
            label="Select Insurance Type" 
            id="insuranceType"
            options={INSURANCE_TYPES_OPTIONS}
            value={insuranceType}
            onChange={(e) => setInsuranceType(e.target.value as InsuranceType)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderFormFields()}
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700">
                Upload Supporting Documents (e.g., Vehicle License)
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


        {premium > 0 && (
          <div className="p-4 bg-primary-light bg-opacity-10 rounded-lg text-center">
            <p className="text-lg text-gray-700">Estimated Premium:</p>
            <p className="text-3xl font-bold text-primary">{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(premium)}</p>
          </div>
        )}

        <div>
          <Button type="submit" isLoading={isLoading} variant="accent" disabled={premium <= 0}>
            Submit Request
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GetQuotePage;
