'use client';

import ToolCard from '@/components/shared/cards/ToolCard';
import NoDataFound from '@/components/shared/common/NoDataFound';
import SideSheet from '@/components/shared/common/SideSheet';
import { ToolForm } from '@/components/shared/forms/ToolForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { apiService, CreateToolRequest } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  extractApiSuccessMessage,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { useState } from 'react';
import { TOOL_MESSAGES } from './tool-messages';

const dummyTools = [
  {
    id: 1,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Hammer',
    brand: 'DeWalt',
    quantity: 5,
    videoCount: 2,
  },
  {
    id: 2,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Drill',
    brand: 'Makita',
    quantity: 3,
    videoCount: 1,
  },
  {
    id: 3,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Saw',
    brand: 'Bosch',
    quantity: 2,
    videoCount: 3,
  },
  {
    id: 4,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Wrench',
    brand: 'Snap-on',
    quantity: 8,
    videoCount: 0,
  },
  {
    id: 5,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Screwdriver',
    brand: 'Stanley',
    quantity: 12,
    videoCount: 1,
  },
  {
    id: 6,
    image: '/images/tools-management/tools-img-1.png',
    name: 'Pliers',
    brand: 'Klein Tools',
    quantity: 6,
    videoCount: 2,
  },
];

export default function ToolsManagement() {
  const [tools, setTools] = useState(dummyTools);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Get user permissions for tools
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.tools?.edit;

  const handleDelete = (id: number) => {
    setTools(tools.filter(tool => tool.id !== id));
  };

  const handleDeletePhoto = () => {
    setPhoto(null);
    setFileKey('');
  };

  const handleCreateTool = async (data: {
    name: string;
    available_quantity: number;
    manufacturer: string;
    tool_assets: string;
    service_ids: string;
  }) => {
    setFormLoading(true);
    try {
      const payload: CreateToolRequest = {
        name: data.name,
        available_quantity: data.available_quantity,
        manufacturer: data.manufacturer,
        tool_assets: fileKey,
        service_ids: data.service_ids,
      };

      const response = await apiService.createTool(payload);

      if (response.statusCode === 200 || response.statusCode === 201) {
        showSuccessToast(response.message || TOOL_MESSAGES.CREATE_SUCCESS);
        setSideSheetOpen(false);
        setPhoto(null);
        setFileKey('');
        // Refresh tools list or add new tool to state
      } else {
        showErrorToast(
          extractApiErrorMessage(response.message) || TOOL_MESSAGES.CREATE_ERROR
        );
      }
    } catch (error: any) {
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

  return (
    <div className='w-full'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <h2 className='page-title'>Tools Management</h2>
        {canEdit && (
          <Button
            onClick={() => setSideSheetOpen(true)}
            className='btn-primary'
          >
            Create Tool
          </Button>
        )}
      </div>

      {/* Tools Grid */}
      {tools.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {tools.map(tool => (
            <ToolCard
              key={tool.id}
              image={tool.image}
              name={tool.name}
              brand={tool.brand}
              quantity={tool.quantity}
              videoCount={tool.videoCount}
              onDelete={() => handleDelete(tool.id)}
            />
          ))}
        </div>
      ) : (
        <NoDataFound
          title='No Tools Found'
          description="You haven't created any tools yet. Start by adding your first one to organize your tools."
          buttonText='Create Tool'
          onButtonClick={() => setSideSheetOpen(true)}
          showButton={canEdit ?? false}
        />
      )}

      {/* Side Sheet for Create Tool */}
      <SideSheet
        title={TOOL_MESSAGES.ADD_TOOL_TITLE}
        open={sideSheetOpen}
        onOpenChange={setSideSheetOpen}
        size='600px'
      >
        <ToolForm
          photo={photo}
          setPhoto={setPhoto}
          handleDeletePhoto={handleDeletePhoto}
          uploading={uploading}
          onSubmit={handleCreateTool}
          loading={formLoading}
          onCancel={() => {
            setSideSheetOpen(false);
            setPhoto(null);
            setFileKey('');
          }}
          setUploading={setUploading}
          setFileKey={setFileKey}
        />
      </SideSheet>
    </div>
  );
}
