'use client';

import { UserInfoForm } from '@/components/shared/forms/UserinfoForm';
import { PhotoUpload } from '@/components/shared/PhotoUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { apiService, UpdateUserRequest, User } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import { extractApiErrorMessage } from '@/lib/utils';
import { ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Role, RoleApiResponse, UserFormData } from '../../types';
import { USER_MESSAGES } from '../../user-messages';

interface EditUserPageProps {
  params: Promise<{
    uuid: string;
  }>;
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const resolvedParams = React.use(params);
  const [selectedTab, setSelectedTab] = useState('info');
  const [fileKey, setFileKey] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
  const [formLoading, setFormLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const { handleAuthError } = useAuth();

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

  // Fetch user details and roles
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user details and roles in parallel
        const [userRes, rolesRes] = await Promise.all([
          apiService.getUserDetails(resolvedParams.uuid),
          apiService.fetchRoles({ page: 1, limit: 50 }),
        ]);

        // Set user data
        if (userRes.statusCode === 200 && userRes.data) {
          setUser(userRes.data);
          // Set existing image if available
          if (userRes.data.profile_picture_url) {
            setFileKey(userRes.data.profile_picture_url);
          }
        }

        // Set roles data
        const roleList = isRoleApiResponse(rolesRes) ? rolesRes.data.data : [];
        setRoles(
          roleList.map((role: Role) => ({ id: role.id, name: role.name }))
        );
      } catch (err: unknown) {
        // Handle auth errors first (will redirect to login if 401)
        if (handleAuthError(err)) {
          return; // Don't show toast or redirect if it's an auth error
        }

        const message = extractApiErrorMessage(
          err,
          USER_MESSAGES.FETCH_DETAILS_ERROR
        );
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
          duration: 4000,
        });
        router.push('/user-management');
      } finally {
        setLoading(false);
        setLoadingRoles(false);
      }
    };

    fetchData();
  }, [resolvedParams.uuid, router, toast, handleAuthError]);

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      // Generate a unique file name: user_<uuid>_<timestamp>.<ext>
      const ext = file.name.split('.').pop() || 'png';
      const timestamp = Date.now();
      const userUuid = uuidv4();
      const generatedFileName = `user_${userUuid}_${timestamp}.${ext}`;
      const presigned = await getPresignedUrl({
        fileName: generatedFileName,
        fileType: file.type,
        fileSize: file.size,
        purpose: 'profile-picture',
        customPath: ``,
      });
      await uploadFileToPresignedUrl(presigned.data['uploadUrl'], file);
      setFileKey(presigned.data['fileKey'] || '');
    } catch {
      alert(USER_MESSAGES.UPLOAD_ERROR);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateUser = async (data: UserFormData) => {
    setFormLoading(true);
    try {
      const payload: UpdateUserRequest = {
        role_id: data.role_id,
        name: data.name,
        email: data.email,
        phone_number: data.phone_number,
        designation: data.designation,
        preferred_communication_method: data.preferred_communication_method,
        address: data.address,
        city: data.city,
        pincode: data.pincode,
        profile_picture_url: fileKey,
      };

      // Only include password if provided
      if (data.password) {
        payload.password = data.password;
      }

      // Only include date if provided
      if (data.date_of_joining) {
        payload.date_of_joining = data.date_of_joining;
      }

      await apiService.updateUser(resolvedParams.uuid, payload);
      toast({
        title: 'Success',
        description: USER_MESSAGES.UPDATE_SUCCESS,
        variant: 'default',
        duration: 4000,
      });
      router.push('/user-management');
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(err, USER_MESSAGES.UPDATE_ERROR);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
        duration: 4000,
      });
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>{USER_MESSAGES.LOADING}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center text-red-500'>
          {USER_MESSAGES.USER_NOT_FOUND}
        </div>
      </div>
    );
  }

  return (
    <div className=''>
      <div className=''>
        {/* Breadcrumb */}
        <div className='flex items-center text-sm text-gray-500 mb-6 mt-2'>
          <span className='text-[var(--text-dark)] text-[14px] font-normal'>
            {USER_MESSAGES.USER_MANAGEMENT_BREADCRUMB}
          </span>
          <ChevronRight className='h-4 w-4 mx-2' />
          <span className='text-[var(--text-dark)] text-[14px] font-normal text-[var(--primary)]'>
            {USER_MESSAGES.EDIT_USER_BREADCRUMB}
          </span>
        </div>

        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl font-medium text-[var(--text-dark)]'>
            {USER_MESSAGES.EDIT_USER_TITLE}
          </h1>
        </div>

        {/* Main Content */}
        <div className='bg-[var(--white-background)] rounded-[20px] border border-[var(--border-dark)] p-[28px]'>
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className='w-full'
          >
            <TabsList className='grid w-full max-w-[328px] grid-cols-2 bg-[var(--background)] p-1 rounded-[30px] h-auto font-normal'>
              <TabsTrigger
                value='info'
                className='rounded-md px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                {USER_MESSAGES.INFO_TAB}
              </TabsTrigger>
              <TabsTrigger
                value='permissions'
                className='rounded-md px-8 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                {USER_MESSAGES.PERMISSIONS_TAB}
              </TabsTrigger>
            </TabsList>

            <TabsContent value='info' className='pt-8'>
              <div className='flex items-start gap-6'>
                {/* Left Column - Upload Photo */}
                <div className='w-[250px] flex-shrink-0 relative'>
                  {fileKey ? (
                    <div className='relative'>
                      <Image
                        src={
                          (process.env['NEXT_PUBLIC_CDN_URL'] || '') + fileKey
                        }
                        alt='Uploaded'
                        className='rounded-lg w-full h-auto'
                        width={250}
                        height={250}
                      />
                      <button
                        type='button'
                        className='absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-opacity-100 transition'
                        onClick={() => {
                          setFileKey('');
                        }}
                        aria-label={USER_MESSAGES.REMOVE_PHOTO_ARIA}
                      >
                        <X className='w-5 h-5 text-gray-700' />
                      </button>
                    </div>
                  ) : (
                    <PhotoUpload onFileUpload={handlePhotoUpload} />
                  )}
                  {uploading && (
                    <div className='text-xs mt-2'>
                      {USER_MESSAGES.UPLOADING}
                    </div>
                  )}
                </div>

                {/* Right Column - Form Fields */}
                <div className='flex-1'>
                  <UserInfoForm
                    roles={roles}
                    loadingRoles={loadingRoles}
                    imageUrl={fileKey}
                    onSubmit={handleUpdateUser}
                    loading={formLoading}
                    initialData={user}
                    isEditMode={true}
                  />
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
