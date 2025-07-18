'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import PhotoUploadField from '@/components/shared/common/PhotoUploadField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { ACCESS_CONTROL_ACCORDIONS_DATA } from '@/constants/access-control';
import { PAGINATION } from '@/constants/common';
import {
  apiService,
  UpdateUserRequest,
  User,
  UserPermissions,
} from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import { extractApiErrorMessage, extractApiSuccessMessage } from '@/lib/utils';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CompanyManagementAddUser from '../../../../../components/shared/CompanyManagementAddUser';
import { Button } from '../../../../../components/ui/button';
import { Role, RoleApiResponse, UserFormData } from '../../types';
import { USER_MESSAGES } from '../../user-messages';

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

interface EditUserPageProps {
  params: Promise<{
    uuid: string;
  }>;
}

const breadcrumbData: BreadcrumbItem[] = [
  { name: 'User Management', href: '/user-management' },
  { name: 'Edit User' }, // current page
];

export default function EditUserPage({ params }: EditUserPageProps) {
  const resolvedParams = React.use(params);

  // State for all accordions' switches
  const [accordions, setAccordions] = useState(() =>
    ACCESS_CONTROL_ACCORDIONS_DATA.map(acc => ({
      title: acc.title,
      stripes: acc.stripes.map(() => false), // all switches unchecked by default
    }))
  );

  // State for which accordion is open
  const [openAccordionIdx, setOpenAccordionIdx] = useState(0);

  // Function to calculate access level for an accordion
  const calculateAccessLevel = (
    stripes: boolean[]
  ): 'Full Access' | 'Limited Access' | 'Restricted' => {
    if (stripes.length === 0) return 'Restricted';

    const enabledCount = stripes.filter(stripe => stripe).length;
    const totalCount = stripes.length;

    if (enabledCount === 0) return 'Restricted';
    if (enabledCount === totalCount) return 'Full Access';
    return 'Limited Access';
  };

  // Function to get badge color based on access level
  const getBadgeColor = (
    accessLevel: 'Full Access' | 'Limited Access' | 'Restricted'
  ): string => {
    switch (accessLevel) {
      case 'Full Access':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Limited Access':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Restricted':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Function to generate JSON from accordions state
  const generatePermissionsJson = (accordionsData: any[]): UserPermissions => {
    const permissionsMap: UserPermissions = {
      roles: { view: false, edit: false, archive: false },
      users: { view: false, create: false, customize: false, archive: false },
      companies: { view: false, assign_user: false, archive: false },
      categories: { view: false, edit: false, archive: false },
      trades: { view: false, edit: false, archive: false },
      services: { view: false, edit: false, archive: false },
      materials: { view: false, edit: false, archive: false },
      tools: { view: false, edit: false, archive: false, history: false },
      jobs: { edit: false, archive: false },
    };

    // Map accordion indices to permission keys
    const accordionToPermissionMap = [
      'roles', // 0: Roles Access Control Settings
      'users', // 1: Users Access Control Settings
      'companies', // 2: Company Management & Operations Settings
      'categories', // 3: Category Management Settings
      'trades', // 4: Trade Management Settings
      'services', // 5: Service Management Settings
      'materials', // 6: Material Management Settings
      'tools', // 7: Tools Management Settings
      'jobs', // 8: Job Creation & Basic Job Setup Settings
    ];

    // Map stripe indices to permission keys for each accordion
    const stripeToPermissionMap = [
      ['view', 'edit', 'archive'], // roles
      ['view', 'create', 'customize', 'archive'], // users
      ['view', 'assign_user', 'archive'], // companies
      ['view', 'edit', 'archive'], // categories
      ['view', 'edit', 'archive'], // trades
      ['view', 'edit', 'archive'], // services
      ['view', 'edit', 'archive'], // materials
      ['view', 'edit', 'archive', 'history'], // tools
      ['edit', 'archive'], // jobs
    ];

    accordionsData.forEach((accordion, accordionIdx) => {
      const permissionKey = accordionToPermissionMap[accordionIdx];
      if (
        permissionKey &&
        permissionsMap[permissionKey as keyof UserPermissions]
      ) {
        accordion.stripes.forEach((isChecked: boolean, stripeIdx: number) => {
          const permissionName =
            stripeToPermissionMap[accordionIdx]?.[stripeIdx];
          if (
            permissionName &&
            permissionsMap[permissionKey as keyof UserPermissions]
          ) {
            (permissionsMap[permissionKey as keyof UserPermissions] as any)[
              permissionName
            ] = isChecked;
          }
        });
      }
    });

    return permissionsMap;
  };

  // Handler to toggle a switch
  const handleToggle = (accordionIdx: number, stripeIdx: number) => {
    setAccordions(prev => {
      const newAccordions = prev.map((acc, aIdx) =>
        aIdx === accordionIdx
          ? {
              ...acc,
              stripes: acc.stripes.map((checked: boolean, sIdx: number) =>
                sIdx === stripeIdx ? !checked : checked
              ),
            }
          : acc
      );

      // Remove localStorage saving - we'll save via API when user clicks update
      console.log('Toggle updated accordions state');

      return newAccordions;
    });
  };

  const [selectedTab, setSelectedTab] = useState('info');
  const [fileKey, setFileKey] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
  const [formLoading, setFormLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleCancel = () => {
    router.push('/user-management');
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

  // Load permissions from localStorage and initialize
  useEffect(() => {
    // Remove localStorage logic - we'll load from API instead
    console.log('Removed localStorage logic - loading from API');
  }, []); // Run only once on component mount

  // Fetch user details and roles
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user details and roles in parallel
        const [userRes, rolesRes] = await Promise.all([
          apiService.getUserDetails(resolvedParams.uuid),
          apiService.fetchRoles({
            page: 1,
            limit: PAGINATION.ROLES_DROPDOWN_LIMIT,
            status: '', // Fetch both active and inactive roles
          }),
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
          roleList.map(({ id, name, status }) => ({
            id,
            name,
            status: status || 'ACTIVE',
          }))
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
        showErrorToast(message);
        router.push('/user-management');
      } finally {
        setLoading(false);
        setLoadingRoles(false);
      }
    };

    fetchData();
  }, [resolvedParams.uuid, router, showErrorToast, handleAuthError]);

  // Fetch user permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      setPermissionsLoading(true);
      try {
        const response = await apiService.getUserPermissions(
          resolvedParams.uuid
        );
        if (response.statusCode === 200 && response.data) {
          // Extract permissions from the response
          const permissionsData = response.data.permissions || response.data;
          console.log('Fetched permissions data:', permissionsData);

          // Update accordions state based on fetched permissions
          const updatedAccordions = ACCESS_CONTROL_ACCORDIONS_DATA.map(
            (acc, accordionIdx) => {
              const permissionKeys = [
                'roles',
                'users',
                'companies',
                'categories',
                'trades',
                'services',
                'materials',
                'tools',
                'jobs',
              ];
              const permissionKey = permissionKeys[accordionIdx];
              const userPermissions = permissionKey
                ? (permissionsData as any)[permissionKey]
                : undefined;

              console.log(`Processing ${permissionKey}:`, userPermissions);

              if (userPermissions) {
                const updatedStripes = acc.stripes.map((_, stripeIdx) => {
                  const permissionNamesArray = [
                    ['view', 'edit', 'archive'], // roles
                    ['view', 'create', 'customize', 'archive'], // users
                    ['view', 'assign_user', 'archive'], // companies
                    ['view', 'edit', 'archive'], // categories
                    ['view', 'edit', 'archive'], // trades
                    ['view', 'edit', 'archive'], // services
                    ['view', 'edit', 'archive'], // materials
                    ['view', 'edit', 'archive', 'history'], // tools
                    ['edit', 'archive'], // jobs
                  ];
                  const permissionNames = permissionNamesArray[accordionIdx];
                  const permissionName = permissionNames?.[stripeIdx];
                  if (
                    permissionName &&
                    typeof permissionName === 'string' &&
                    userPermissions
                  ) {
                    const permissionValue = (userPermissions as any)[
                      permissionName
                    ];
                    console.log(
                      `Setting ${permissionKey}.${permissionName} to:`,
                      permissionValue
                    );
                    return permissionValue === true;
                  }
                  return false;
                });

                return {
                  title: acc.title,
                  stripes: updatedStripes,
                };
              }

              // If no permissions found for this section, default all to false
              console.log(
                `No permissions found for ${permissionKey}, defaulting to false`
              );
              return {
                title: acc.title,
                stripes: acc.stripes.map(() => false),
              };
            }
          );

          setAccordions(updatedAccordions);
        }
      } catch (err: unknown) {
        // Handle auth errors first (will redirect to login if 401)
        if (handleAuthError(err)) {
          return; // Don't show toast if it's an auth error
        }

        const message = extractApiErrorMessage(
          err,
          USER_MESSAGES.PERMISSIONS_FETCH_ERROR
        );
        showErrorToast(message);
      } finally {
        setPermissionsLoading(false);
      }
    };

    fetchPermissions();
  }, [resolvedParams.uuid, showErrorToast, handleAuthError]);

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
      const generatedFileName = `user_${randomId}_${timestamp}.${ext}`;

      const presigned = await getPresignedUrl({
        fileName: generatedFileName,
        fileType: file.type,
        fileSize: file.size,
        purpose: 'profile-picture',
        customPath: '',
      });
      await uploadFileToPresignedUrl(presigned.data['uploadUrl'], file);
      setFileKey(presigned.data['fileKey'] || '');
    } catch {
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

  const handleUpdateUser = async (data: UserFormData) => {
    setFormLoading(true);
    try {
      const payload: UpdateUserRequest = {
        role_id: data.role_id,
        name: data.name,
        email: data.email,
        country_code: data.country_code,
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

      const response = await apiService.updateUser(
        resolvedParams.uuid,
        payload
      );
      showSuccessToast(
        extractApiSuccessMessage(response, USER_MESSAGES.UPDATE_SUCCESS)
      );
      router.push('/user-management');
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(err, USER_MESSAGES.UPDATE_ERROR);
      showErrorToast(message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdatePermissions = async () => {
    setFormLoading(true);
    try {
      const permissionsData = generatePermissionsJson(accordions);
      console.log('Sending permissions data to API:', permissionsData);

      const response = await apiService.updateUserPermissions(
        resolvedParams.uuid,
        permissionsData
      );

      showSuccessToast(
        extractApiSuccessMessage(
          response,
          USER_MESSAGES.PERMISSIONS_UPDATE_SUCCESS
        )
      );
      // Removed redirect - user stays on the same page
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        USER_MESSAGES.PERMISSIONS_UPDATE_ERROR
      );
      showErrorToast(message);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return <LoadingComponent variant='fullscreen' />;
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
        <Breadcrumb items={breadcrumbData} className='mb-5' />

        {/* Header */}
        {/* <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl font-medium text-[var(--text-dark)]'>
            {USER_MESSAGES.EDIT_USER_TITLE}
          </h1>
        </div> */}

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
                className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                {USER_MESSAGES.INFO_TAB}
              </TabsTrigger>
              <TabsTrigger
                value='permissions'
                className='px-8 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                {USER_MESSAGES.PERMISSIONS_TAB}
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
                    // text={USER_MESSAGES.UPLOAD_PHOTO_TEXT}
                    uploading={uploading}
                    existingImageUrl={
                      fileKey && !photoFile
                        ? (process.env['NEXT_PUBLIC_CDN_URL'] || '') + fileKey
                        : ''
                    }
                    className='h-[250px]'
                  />
                  {uploading && (
                    <div className='text-xs mt-2'>
                      {USER_MESSAGES.UPLOADING}
                    </div>
                  )}
                </div>

                {/* Right Column - Form Fields */}
                <div className='flex-1'>
                  <UserInfoForm
                    key={user?.uuid || 'loading'}
                    roles={roles}
                    loadingRoles={loadingRoles}
                    imageUrl={fileKey}
                    onSubmit={handleUpdateUser}
                    onCancel={handleCancel}
                    loading={formLoading}
                    initialData={user}
                    isEditMode={true}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value='permissions' className='pt-8'>
              {permissionsLoading ? (
                <div className='flex items-center justify-center py-8'>
                  <LoadingComponent variant='inline' />
                  <span className='ml-2'>
                    {USER_MESSAGES.PERMISSIONS_LOADING}
                  </span>
                </div>
              ) : (
                <>
                  <div className='flex flex-col gap-4'>
                    {accordions.map((accordion, idx) => {
                      const { title, stripes } = accordion;
                      const accessLevel = calculateAccessLevel(stripes);
                      return (
                        <CompanyManagementAddUser
                          key={title + idx}
                          title={title}
                          badgeLabel={accessLevel}
                          stripes={
                            Array.isArray(stripes) &&
                            Array.isArray(
                              ACCESS_CONTROL_ACCORDIONS_DATA[idx]?.stripes
                            )
                              ? ACCESS_CONTROL_ACCORDIONS_DATA[
                                  idx
                                ]?.stripes.map((stripe, sIdx) => ({
                                  title: stripe.title,
                                  description: stripe.description,
                                  checked:
                                    typeof stripes?.[sIdx] === 'boolean'
                                      ? stripes[sIdx]
                                      : false,
                                  onToggle: () => handleToggle(idx, sIdx),
                                }))
                              : []
                          }
                          open={openAccordionIdx === idx}
                          onOpenChange={open =>
                            setOpenAccordionIdx(open ? idx : -1)
                          }
                        />
                      );
                    })}
                  </div>
                  <div className='flex justify-end gap-6 mt-8'>
                    <Link
                      href={'/user-management'}
                      className='inline-flex items-center h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)] hover:bg-gray-50 transition-colors'
                    >
                      Cancel
                    </Link>
                    <Button
                      onClick={handleUpdatePermissions}
                      disabled={formLoading}
                      className='h-[48px] px-12 bg-[var(--secondary)] hover:bg-green-600 rounded-full font-semibold text-white'
                    >
                      {formLoading ? 'Updating...' : 'Update'}
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
