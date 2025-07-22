'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { ToolForm } from '@/components/shared/forms/ToolForm';
import { useToast } from '@/components/ui/use-toast';
import { apiService, CreateToolRequest } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import { extractApiErrorMessage, extractApiSuccessMessage } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TOOL_MESSAGES } from '../tool-messages';
import { ToolCreateFormData } from '../tool-types';

const breadcrumbData: BreadcrumbItem[] = [
  { name: 'Tools Management', href: '/tools-management' },
  { name: 'Create Tool' }, // current page
];

export default function CreateToolPage() {
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
      const toolUuid = uuidv4();
      const generatedFileName = `tool_${toolUuid}_${timestamp}.${ext}`;
      const presigned = await getPresignedUrl({
        fileName: generatedFileName,
        fileType: file.type,
        fileSize: file.size,
        purpose: 'tool', // Using 'tool' as purpose for tool images
        customPath: ``,
      });
      await uploadFileToPresignedUrl(presigned.data['uploadUrl'], file);
      setFileKey(presigned.data['fileKey'] || '');
    } catch (_err: unknown) {
      showErrorToast(TOOL_MESSAGES.CREATE_ERROR);
      setPhotoFile(null);
      setFileKey('');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateTool = async (data: ToolCreateFormData) => {
    console.log('Received form data in handleCreateTool:', data);
    setFormLoading(true);
    try {
      const payload: CreateToolRequest = {
        name: data.name,
        total_quantity: data.total_quantity,
        manufacturer: data.manufacturer,
        tool_assets: fileKey,
        service_ids: data.service_ids,
      };

      console.log('Sending payload to API:', payload);

      const response = await apiService.createTool(payload);

      if (response.statusCode === 200 || response.statusCode === 201) {
        showSuccessToast(
          extractApiSuccessMessage(response.message) ||
            TOOL_MESSAGES.CREATE_SUCCESS
        );
        router.push('/tools-management');
      } else {
        showErrorToast(
          extractApiErrorMessage(response.message) || TOOL_MESSAGES.CREATE_ERROR
        );
      }
    } catch (error: any) {
      console.error('Error creating tool:', error);
      if (error.status === 401) {
        handleAuthError(error);
      } else {
        showErrorToast(
          extractApiErrorMessage(error.message) || TOOL_MESSAGES.CREATE_ERROR
        );
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletePhoto = () => {
    setPhotoFile(null);
    setFileKey('');
  };

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <h2 className='page-title'>{TOOL_MESSAGES.ADD_TOOL_TITLE}</h2>
      </div>

      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbData} />

      {/* Form */}
      <div className='mt-8'>
        <ToolForm
          photo={photoFile}
          setPhoto={handlePhotoChange}
          handleDeletePhoto={handleDeletePhoto}
          uploading={uploading}
          onSubmit={handleCreateTool}
          loading={formLoading}
          onCancel={() => router.push('/tools-management')}
        />
      </div>
    </div>
  );
}
