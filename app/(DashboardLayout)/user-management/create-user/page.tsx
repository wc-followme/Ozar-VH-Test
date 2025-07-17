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
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Link from 'next/link';
import CompanyManagementAddUser from '../../../../components/shared/CompanyManagementAddUser';
import { Button } from '../../../../components/ui/button';
import { Role, RoleApiResponse, UserFormData } from '../types';
import { USER_MESSAGES } from '../user-messages';

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

// Dummy data for access control accordions
const ACCESS_CONTROL_ACCORDIONS_DATA = [
  {
    title: 'Roles Access Control',
    badgeLabel: 'Full Access',
    stripes: [
      {
        title: 'Browse Roles',
        description:
          'View the complete list of available roles and their basic information including role names, descriptions, and user counts.',
      },
      {
        title: 'Configure & Modify Roles',
        description:
          "Modify or set up new roles with custom names, descriptions, and permission assignments tailored to your organization's needs.",
      },
      {
        title: 'Archive & Restore Roles',
        description:
          'Remove roles that are no longer needed. System prevents deletion of roles with active users for data safety.',
      },
    ],
  },
  {
    title: 'Users Access Control',
    badgeLabel: 'Limited Access',
    stripes: [
      {
        title: 'Browse Roles',
        description:
          'View the complete list of available roles and their basic information including role names, descriptions, and user counts.',
      },
      {
        title: 'Configure & Modify Roles',
        description:
          "Modify or set up new roles with custom names, descriptions, and permission assignments tailored to your organization's needs.",
      },
      {
        title: 'Archive & Restore Roles',
        description:
          'Remove roles that are no longer needed. System prevents deletion of roles with active users for data safety.',
      },
    ],
  },
  {
    title: 'Company Management & Operations',
    badgeLabel: 'Restricted',
    stripes: [
      {
        title: 'Browse Roles',
        description:
          'View the complete list of available roles and their basic information including role names, descriptions, and user counts.',
      },
      {
        title: 'Configure & Modify Roles',
        description:
          "Modify or set up new roles with custom names, descriptions, and permission assignments tailored to your organization's needs.",
      },
      {
        title: 'Archive & Restore Roles',
        description:
          'Remove roles that are no longer needed. System prevents deletion of roles with active users for data safety.',
      },
    ],
  },
  {
    title: 'Category Management & Service',
    badgeLabel: 'Restricted',
    stripes: [
      {
        title: 'Browse Roles',
        description:
          'View the complete list of available roles and their basic information including role names, descriptions, and user counts.',
      },
      {
        title: 'Configure & Modify Roles',
        description:
          "Modify or set up new roles with custom names, descriptions, and permission assignments tailored to your organization's needs.",
      },
      {
        title: 'Archive & Restore Roles',
        description:
          'Remove roles that are no longer needed. System prevents deletion of roles with active users for data safety.',
      },
    ],
  },
];

export default function AddUserPage() {
  // State for all accordions' switches
  const [accordions, setAccordions] = useState(() =>
    ACCESS_CONTROL_ACCORDIONS_DATA.map(acc => ({
      ...acc,
      stripes: acc.stripes.map(() => true), // all switches checked by default
    }))
  );

  // State for which accordion is open
  const [openAccordionIdx, setOpenAccordionIdx] = useState(0);

  // Handler to toggle a switch
  const handleToggle = (accordionIdx: number, stripeIdx: number) => {
    setAccordions(prev =>
      prev.map((acc, aIdx) =>
        aIdx === accordionIdx
          ? {
              ...acc,
              stripes: acc.stripes.map((checked: boolean, sIdx: number) =>
                sIdx === stripeIdx ? !checked : checked
              ),
            }
          : acc
      )
    );
  };

  const [selectedTab, setSelectedTab] = useState('info');
  const [fileKey, setFileKey] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(true);
  const [formLoading, setFormLoading] = useState(false);
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
          roleList.map((role: Role) => ({
            id: role.id,
            name: role.name,
            status: role.status || 'ACTIVE',
          }))
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
      };
      await apiService.createUser(payload);
      showSuccessToast(USER_MESSAGES.CREATE_SUCCESS);
      router.push('/user-management');
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

  const breadcrumbData: BreadcrumbItem[] = [
    {
      name: USER_MESSAGES.USER_MANAGEMENT_BREADCRUMB,
      href: '/user-management',
    },
    { name: USER_MESSAGES.ADD_USER_BREADCRUMB },
  ];
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
                {USER_MESSAGES.INFO_TAB}
              </TabsTrigger>
              <TabsTrigger
                value='permissions'
                className='px-8 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                {USER_MESSAGES.SETTINGS_TAB}
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
                  <UserInfoForm
                    roles={roles}
                    loadingRoles={loadingRoles}
                    imageUrl={fileKey}
                    onSubmit={handleCreateUser}
                    onCancel={handleCancel}
                    loading={formLoading}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value='permissions' className='pt-8'>
              <div className='flex flex-col gap-4'>
                {accordions.map((accordion, idx) => {
                  const { title, badgeLabel, stripes } = accordion;
                  return (
                    <CompanyManagementAddUser
                      key={title + idx}
                      title={title}
                      badgeLabel={badgeLabel}
                      stripes={
                        Array.isArray(stripes) &&
                        Array.isArray(
                          ACCESS_CONTROL_ACCORDIONS_DATA[idx]?.stripes
                        )
                          ? ACCESS_CONTROL_ACCORDIONS_DATA[idx]?.stripes.map(
                              (stripe, sIdx) => ({
                                title: stripe.title,
                                description: stripe.description,
                                checked:
                                  typeof stripes?.[sIdx] === 'boolean'
                                    ? stripes[sIdx]
                                    : false,
                                onToggle: () => handleToggle(idx, sIdx),
                              })
                            )
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
                  href={''}
                  className='inline-flex items-center h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)] hover:bg-gray-50 transition-colors'
                >
                  Cancel
                </Link>
                <Button className='h-[48px] px-12 bg-[var(--secondary)] hover:bg-green-600 rounded-full font-semibold text-white'>
                  Create
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
