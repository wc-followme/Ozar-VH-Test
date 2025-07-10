'use client';

import { UserInfoForm } from '@/components/shared/forms/UserinfoForm';
import { PhotoUpload } from '@/components/shared/PhotoUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiService } from '@/lib/api';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function AddUserPage() {
  const [selectedTab, setSelectedTab] = useState('info');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [loadingRoles, setLoadingRoles] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const rolesRes = await apiService.fetchRoles({ page: 1, limit: 50 });
        function isRoleApiResponse(
          obj: unknown
        ): obj is { data: { data: any[] } } {
          return (
            typeof obj === 'object' &&
            obj !== null &&
            'data' in obj &&
            typeof (obj as any).data === 'object' &&
            (obj as any).data !== null &&
            'data' in (obj as any).data &&
            Array.isArray((obj as any).data.data)
          );
        }
        const roleList = isRoleApiResponse(rolesRes) ? rolesRes.data.data : [];
        setRoles(
          roleList.map((role: any) => ({ id: role.id, name: role.name }))
        );
      } catch {
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      // Generate a unique file name: user_<uuid>_<timestamp>.<ext>
      const ext = file.name.split('.').pop() || 'png';
      const timestamp = Date.now();
      // If you have a user UUID, use it. Otherwise, generate a temp one for the upload.
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
      setImageUrl(presigned.data['publicUrl']);
    } catch (err) {
      console.log('err', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className=''>
      <div className=''>
        {/* Breadcrumb */}
        <div className='flex items-center text-sm text-gray-500 mb-6 mt-2'>
          <span className='text-[var(--text-dark)] text-[14px] font-normal'>
            User Management
          </span>
          <ChevronRight className='h-4 w-4 mx-2' />
          <span className='text-[var(--text-dark)] text-[14px] font-normal text-[var(--primary)]'>
            Add User
          </span>
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
                Info
              </TabsTrigger>
              <TabsTrigger
                value='permissions'
                className='rounded-md px-8 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Permissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value='info' className='pt-8'>
              <div className='flex items-start gap-6'>
                {/* Left Column - Upload Photo */}
                <div className='w-[250px] flex-shrink-0'>
                  <PhotoUpload onFileUpload={handlePhotoUpload} />
                  {uploading && (
                    <div className='text-xs mt-2'>Uploading...</div>
                  )}
                  {}
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt='Uploaded'
                      className='mt-2 rounded-lg w-full h-auto'
                      width={250}
                      height={250}
                    />
                  )}
                </div>

                {/* Right Column - Form Fields */}
                <div className='flex-1'>
                  <UserInfoForm roles={roles} loadingRoles={loadingRoles} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value='permissions' className='p-8'>
              <div className='text-center py-16'>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Permissions Settings
                </h3>
                <p className='text-gray-500'>
                  Configure user permissions and access levels here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
