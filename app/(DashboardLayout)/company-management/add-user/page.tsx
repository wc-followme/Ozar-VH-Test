'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import PhotoUploadField from '@/components/shared/common/PhotoUploadField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { PAGINATION } from '@/constants/common';
import { apiService, CreateUserRequest } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import { extractApiErrorMessage } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Role,
  RoleApiResponse,
  UserFormData,
} from '../../user-management/types';
import { USER_MESSAGES } from '../../user-management/user-messages';

// Dynamic import for better performance
const UserInfoForm = dynamic(
  () =>
    import('@/components/shared/forms/UserinfoForm').then(mod => ({
      default: mod.UserInfoForm,
    })),
  {
    loading: () => <LoadingComponent variant='inline' />,
    ssr: false,
  }
);

const breadcrumbData: BreadcrumbItem[] = [
  { name: 'Company Management', href: '/company-management' },
  { name: 'Add User' }, // current page
];

export default function AddCompanyUserPage() {
  const [selectedTab, setSelectedTab] = useState('info');
  const [fileKey, setFileKey] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
  const [formLoading, setFormLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [companyNumericId, setCompanyNumericId] = useState<number | null>(null);
  const [loadingCompany, setLoadingCompany] = useState<boolean>(true);

  // Get company UUID from URL params or use default
  const companyUuid =
    searchParams.get('company_id') || '7aef8cc2-91ad-46ea-ba05-514d605eeff2';

  const handleCancel = () => {
    // Redirect back to the company details page
    router.push(
      `/company-management/company-details/${companyUuid}?tab=usermanagement`
    );
  };

  const isRoleApiResponse = (obj: unknown): obj is RoleApiResponse => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'data' in obj &&
      typeof (obj as RoleApiResponse).data === 'object' &&
      (obj as RoleApiResponse).data !== null &&
      'data' in (obj as RoleApiResponse).data &&
      Array.isArray((obj as RoleApiResponse).data.data)
    );
  };

  // Fetch company details to get numeric ID
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      setLoadingCompany(true);
      try {
        const companyRes = await apiService.getCompanyDetails(companyUuid);
        const rawId = companyRes.data.id;
        console.log('Company response data:', companyRes.data);
        console.log('Raw ID from API:', rawId, 'Type:', typeof rawId);

        // Convert string ID to number
        const numericId =
          typeof rawId === 'string' ? parseInt(rawId, 10) : rawId;
        console.log(
          'Converted to numeric ID:',
          numericId,
          'Type:',
          typeof numericId
        );

        if (isNaN(numericId) || typeof numericId !== 'number') {
          console.error('Could not convert ID to number:', rawId);
          showErrorToast('Invalid company ID received from server');
          return;
        }

        setCompanyNumericId(numericId);
      } catch (err: unknown) {
        if (handleAuthError(err)) {
          return; // Don't show toast if it's an auth error
        }
        showErrorToast('Failed to load company details');
      } finally {
        setLoadingCompany(false);
      }
    };
    fetchCompanyDetails();
  }, [companyUuid, handleAuthError, showErrorToast]);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const rolesRes = await apiService.fetchRoles({
          page: 1,
          limit: PAGINATION.ROLES_DROPDOWN_LIMIT,
        });
        const roleList = isRoleApiResponse(rolesRes) ? rolesRes.data.data : [];
        setRoles(
          roleList.map((role: Role) => ({ id: role.id, name: role.name }))
        );
      } catch (err: unknown) {
        if (handleAuthError(err)) {
          return; // Don't show toast if it's an auth error
        }
        // Error fetching roles - proceed with empty array
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, [handleAuthError]);

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
      const randomId = Math.random().toString(36).substring(2, 15);
      const generatedFileName = `user_${randomId}_${timestamp}.${ext}`;
      const presigned = await getPresignedUrl({
        fileName: generatedFileName,
        fileType: file.type,
        fileSize: file.size,
        purpose: 'profile-picture',
        customPath: ``,
      });
      await uploadFileToPresignedUrl(presigned.data['uploadUrl'], file);
      setFileKey(presigned.data['fileKey'] || '');
    } catch (err: unknown) {
      showErrorToast(USER_MESSAGES.UPLOAD_ERROR);
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

  const handleCreateUser = async (data: UserFormData) => {
    // Prevent submission if company details are not loaded yet
    if (loadingCompany || !companyNumericId) {
      showErrorToast('Company details are still loading. Please wait.');
      return;
    }

    setFormLoading(true);
    try {
      // Ensure all required fields are provided for create operation
      if (!data.date_of_joining) {
        throw new Error('Date of joining is required for user creation');
      }

      const payload: CreateUserRequest = {
        role_id: data.role_id,
        name: data.name,
        email: data.email,
        // Password will be generated on the backend
        country_code: data.country_code,
        phone_number: data.phone_number,
        date_of_joining: data.date_of_joining,
        designation: data.designation,
        preferred_communication_method: data.preferred_communication_method,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        profile_picture_url: fileKey,
        company_id: companyNumericId!, // Pass the numeric company_id to associate user with specific company
      };

      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log(
        'companyNumericId value:',
        companyNumericId,
        'Type:',
        typeof companyNumericId
      );
      console.log(
        'companyUuid value:',
        companyUuid,
        'Type:',
        typeof companyUuid
      );
      console.log(
        'Final payload.company_id:',
        payload.company_id,
        'Type:',
        typeof payload.company_id
      );
      console.log('Full payload:', payload);
      console.log('=== END DEBUG ===');

      await apiService.createUser(payload);
      showSuccessToast(USER_MESSAGES.CREATE_SUCCESS);

      // Redirect to company details page with user management tab
      router.push(
        `/company-management/company-details/${companyUuid}?tab=usermanagement`
      );
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(err, USER_MESSAGES.CREATE_ERROR);
      showErrorToast(message);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className=''>
      <div className=''>
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbData} className='mb-6 mt-2' />

        {/* Main Content */}
        <div className='bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-[28px]'>
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className='w-full'
          >
            <TabsList className='grid w-full max-w-[328px] grid-cols-2 bg-[var(--background)] p-1 rounded-[30px] h-auto font-normal'>
              <TabsTrigger
                value='info'
                className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Info
              </TabsTrigger>
              <TabsTrigger
                value='permissions'
                className='px-8 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value='info' className='pt-8'>
              <div className='flex items-start gap-6'>
                {/* Left Column - Upload Photo */}
                <div className='w-[250px] flex-shrink-0 relative'>
                  <PhotoUploadField
                    photo={photoFile}
                    onPhotoChange={handlePhotoChange}
                    onDeletePhoto={handleDeletePhoto}
                    label={USER_MESSAGES.UPLOAD_PHOTO_LABEL}
                    text={USER_MESSAGES.UPLOAD_PHOTO_TEXT}
                  />
                  {uploading && (
                    <div className='text-xs mt-2'>
                      {USER_MESSAGES.UPLOADING}
                    </div>
                  )}
                </div>

                {/* Right Column - Form Fields */}
                <div className='flex-1'>
                  {loadingCompany ? (
                    <LoadingComponent variant='inline' />
                  ) : (
                    <UserInfoForm
                      roles={roles}
                      loadingRoles={loadingRoles}
                      imageUrl={fileKey}
                      onSubmit={handleCreateUser}
                      onCancel={handleCancel}
                      loading={formLoading}
                    />
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value='permissions' className='pt-8'>
              <div className='text-center py-10 text-gray-500'>
                Permissions management coming soon...
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
