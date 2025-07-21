'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import PhotoUploadField from '@/components/shared/common/PhotoUploadField';
import { useToast } from '@/components/ui/use-toast';
import {
  apiService,
  GetCompanyResponse,
  UpdateCompanyRequest,
} from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import { extractApiErrorMessage, extractApiSuccessMessage } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { COMPANY_MESSAGES } from '../../company-messages';
import { CompanyCreateFormData, CompanyInitialData } from '../../company-types';

// Dynamic import for better performance
const CompanyInfoForm = dynamic(
  () =>
    import('@/components/shared/forms/CompanyinfoForm').then(mod => ({
      default: mod.CompanyInfoForm,
    })),
  {
    loading: () => <LoadingComponent variant='inline' />,
    ssr: false,
  }
);

const breadcrumbData: BreadcrumbItem[] = [
  { name: 'Company Management', href: '/company-management' },
  { name: 'Edit Company' }, // current page
];

interface EditCompanyPageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export default function EditCompanyPage({ params }: EditCompanyPageProps) {
  const resolvedParams = React.use(params);

  const [fileKey, setFileKey] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState(false);
  const [company, setCompany] = useState<GetCompanyResponse['data'] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const isCompanyApiResponse = (obj: unknown): obj is GetCompanyResponse => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'statusCode' in obj &&
      'data' in obj &&
      typeof (obj as GetCompanyResponse).data === 'object'
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCompanyDetails(
          resolvedParams.uuid
        );

        if (isCompanyApiResponse(response)) {
          setCompany(response.data);
          // Set existing image if available
          if (response.data.image) {
            setFileKey(response.data.image);
          }
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err: unknown) {
        if (handleAuthError(err)) {
          return;
        }
        const errorMessage = extractApiErrorMessage(
          err,
          COMPANY_MESSAGES.FETCH_ERROR
        );
        showErrorToast(errorMessage);
        router.push('/company-management');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.uuid, router, showErrorToast, handleAuthError]);

  const handlePhotoChange = async (file: File | null) => {
    if (!file) {
      setPhotoFile(null);
      setFileKey('');
      return;
    }

    try {
      setUploading(true);
      setPhotoFile(file);

      const ext = file.name.split('.').pop() || 'png';
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const generatedFileName = `company_${randomId}_${timestamp}.${ext}`;

      const presigned = await getPresignedUrl({
        fileName: generatedFileName,
        fileType: file.type,
        fileSize: file.size,
        purpose: 'company',
        customPath: '',
      });
      await uploadFileToPresignedUrl(presigned.data['uploadUrl'], file);
      setFileKey(presigned.data['fileKey'] || '');
    } catch (err: unknown) {
      showErrorToast(COMPANY_MESSAGES.UPLOAD_ERROR);
      setPhotoFile(null);
      setFileKey('');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = () => {
    setPhotoFile(null);
    setFileKey('');
  };

  const handleUpdateCompany = async (data: CompanyCreateFormData) => {
    setFormLoading(true);
    try {
      const updatePayload: UpdateCompanyRequest = {
        name: data.name,
        tagline: data.tagline,
        about: data.about,
        email: data.email,
        country_code: data.country_code,
        phone_number: data.phone_number,
        communication: data.communication,
        website: data.website,
        preferred_communication_method: data.preferred_communication_method,
        city: data.city,
        pincode: data.pincode,
        projects: data.projects,
      };

      // Add expiry_date only if it's provided
      if (data.expiry_date) {
        updatePayload.expiry_date = data.expiry_date;
      }

      // Add image if file was uploaded
      if (fileKey) {
        updatePayload.image = fileKey;
      }

      const response = await apiService.updateCompany(
        resolvedParams.uuid,
        updatePayload
      );

      if (response.statusCode === 200) {
        showSuccessToast(
          extractApiSuccessMessage(response, COMPANY_MESSAGES.UPDATE_SUCCESS)
        );
        router.push('/company-management');
      } else {
        throw new Error(response.message || COMPANY_MESSAGES.UPDATE_ERROR);
      }
    } catch (err: unknown) {
      if (handleAuthError(err)) {
        return;
      }
      const errorMessage = extractApiErrorMessage(
        err,
        COMPANY_MESSAGES.UPDATE_ERROR
      );
      showErrorToast(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // Convert company data to form initial data
  const getInitialData = (): CompanyInitialData | undefined => {
    if (!company) return undefined;

    return {
      name: company.name,
      tagline: company.tagline,
      about: company.about,
      email: company.email,
      country_code: company.country_code, // Now properly typed
      phone_number: company.phone_number,
      communication: company.communication,
      website: company.website,
      expiry_date: company.expiry_date,
      preferred_communication_method: company.preferred_communication_method,
      city: company.city,
      pincode: company.pincode,
      projects: company.projects,
      image: company.image,
    };
  };

  if (loading) {
    return <LoadingComponent variant='page' />;
  }

  if (!company) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <p className='text-gray-600'>{COMPANY_MESSAGES.COMPANY_NOT_FOUND}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <Breadcrumb items={breadcrumbData} className='mb-2' />
        </div>
      </div>

      {/* Main Content */}
      <div className=''>
        <div className='flex flex-col xl:flex-row items-start gap-6'>
          {/* Left Column - Upload Photo */}
          <div className='w-[412px] flex-shrink-0 bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-[1rem] relative'>
            <h2 className='text-lg font-bold mb-4'>Upload Logo</h2>
            <PhotoUploadField
              photo={photoFile}
              onPhotoChange={handlePhotoChange}
              onDeletePhoto={handleDeletePhoto}
              label={COMPANY_MESSAGES.UPLOAD_PHOTO_LABEL}
              text={COMPANY_MESSAGES.UPLOAD_PHOTO_TEXT}
              uploading={uploading}
              existingImageUrl={
                fileKey && !photoFile
                  ? (process.env['NEXT_PUBLIC_CDN_URL'] || '') + fileKey
                  : ''
              }
              cardHeight='h-[265px]'
            />
            {uploading && (
              <div className='text-xs mt-2'>{COMPANY_MESSAGES.UPLOADING}</div>
            )}
          </div>

          {/* Right Column - Form Fields */}
          <div className='flex-1 bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-[28px]'>
            {getInitialData() && (
              <CompanyInfoForm
                key={company?.uuid || 'loading'}
                imageUrl={fileKey}
                onSubmit={handleUpdateCompany}
                loading={formLoading}
                initialData={getInitialData()!}
                isEditMode={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
