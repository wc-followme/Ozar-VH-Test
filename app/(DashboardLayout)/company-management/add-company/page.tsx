'use client';

import PhotoUploadField from '@/components/shared/common/PhotoUploadField';
import { CompanyInfoForm } from '@/components/shared/forms/CompanyinfoForm';
import { useToast } from '@/components/ui/use-toast';
import { apiService, CreateCompanyRequest } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import { extractApiErrorMessage } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { COMPANY_MESSAGES } from '../company-messages';
import { CompanyCreateFormData } from '../company-types';

export default function AddCompanyPage() {
  const [fileKey, setFileKey] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handlePhotoChange = async (file: File | null) => {
    if (!file) {
      setPhotoFile(null);
      setFileKey('');
      return;
    }
    setPhotoFile(file);
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const timestamp = Date.now();
      const companyUuid = uuidv4();
      const generatedFileName = `company_${companyUuid}_${timestamp}.${ext}`;
      const presigned = await getPresignedUrl({
        fileName: generatedFileName,
        fileType: file.type,
        fileSize: file.size,
        purpose: 'company',
        customPath: ``,
      });
      await uploadFileToPresignedUrl(presigned.data['uploadUrl'], file);
      setFileKey(presigned.data['fileKey'] || '');
    } catch (_err: unknown) {
      showErrorToast(COMPANY_MESSAGES.UPLOAD_ERROR);
      setPhotoFile(null);
      setFileKey('');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateCompany = async (data: CompanyCreateFormData) => {
    setFormLoading(true);
    try {
      const payload: CreateCompanyRequest = {
        name: data.name,
        tagline: data.tagline,
        about: data.about,
        email: data.email,
        phone_number: data.phone_number,
        communication: data.communication,
        website: data.website,
        preferred_communication_method: data.preferred_communication_method,
        city: data.city,
        pincode: data.pincode,
        projects: data.projects,
        is_default: false,
        status: 'ACTIVE',
        image: fileKey,
      };

      // Add expiry_date only if it's provided
      if (data.expiry_date) {
        payload.expiry_date = data.expiry_date;
      }

      await apiService.createCompany(payload);
      showSuccessToast(COMPANY_MESSAGES.CREATE_SUCCESS);
      router.push('/company-management');
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        COMPANY_MESSAGES.CREATE_ERROR
      );
      showErrorToast(message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className=''>
      <div className=''>
        {/* Breadcrumb */}
        <div className='flex items-center text-sm text-gray-500 mb-6 mt-2'>
          <span className='text-[var(--text-dark)] text-[14px] font-normal'>
            {COMPANY_MESSAGES.COMPANY_MANAGEMENT_TITLE}
          </span>
          <ChevronRight className='h-4 w-4 mx-2' />
          <span className='text-[var(--text-dark)] text-[14px] font-normal text-[var(--primary)]'>
            {COMPANY_MESSAGES.ADD_COMPANY_TITLE}
          </span>
        </div>

        {/* Main Content */}
        <div className=''>
          <div className='flex items-start gap-6'>
            {/* Left Column - Upload Photo */}
            <div className='w-[412px] flex-shrink-0 bg-[var(--white-background)] rounded-[20px] border border-[var(--border-dark)] p-[1rem] relative'>
              <PhotoUploadField
                photo={photoFile}
                onPhotoChange={handlePhotoChange}
                label={COMPANY_MESSAGES.UPLOAD_PHOTO_LABEL}
                text={COMPANY_MESSAGES.UPLOAD_PHOTO_TEXT}
              />
              {uploading && (
                <div className='text-xs mt-2'>{COMPANY_MESSAGES.UPLOADING}</div>
              )}
            </div>

            {/* Right Column - Form Fields */}
            <div className='flex-1 bg-[var(--white-background)] rounded-[20px] border border-[var(--border-dark)] p-[28px]'>
              <CompanyInfoForm
                imageUrl={fileKey}
                onSubmit={handleCreateCompany}
                loading={formLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
