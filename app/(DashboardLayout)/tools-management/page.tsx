'use client';

import ToolCard from '@/components/shared/cards/ToolCard';
import NoDataFound from '@/components/shared/common/NoDataFound';
import SideSheet from '@/components/shared/common/SideSheet';
import { ToolForm } from '@/components/shared/forms/ToolForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { apiService, CreateToolRequest, Tool } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  extractApiErrorMessage,
  getUserPermissionsFromStorage,
} from '@/lib/utils';
import { useEffect, useState } from 'react';
import { TOOL_MESSAGES } from './tool-messages';

export default function ToolsManagement() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [sideSheetOpen, setSideSheetOpen] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editToolUuid, setEditToolUuid] = useState<string | null>(null);
  const [editToolData, setEditToolData] = useState<Tool | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError, user } = useAuth();

  // Get user permissions for tools
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.tools?.edit;

  const cdnPrefix = process.env['NEXT_PUBLIC_CDN_URL'] || '';

  // Load tools from API
  useEffect(() => {
    const loadTools = async () => {
      console.log('loadTools called, user:', user);
      console.log('user?.company_id:', user?.company_id);

      if (!user) {
        console.log('User not available yet, waiting...');
        return; // Don't set loading to false, wait for user to load
      }

      setLoading(true);
      try {
        console.log('Making API call WITHOUT company_id');
        const response = await apiService.fetchTools({
          page: 1,
          limit: 50,
        });

        console.log('API response:', response);
        if (response.statusCode === 200) {
          // Handle both possible response structures
          let toolsData = response.data;
          if (
            response.data &&
            typeof response.data === 'object' &&
            !Array.isArray(response.data) &&
            'data' in response.data
          ) {
            toolsData = (response.data as any).data;
          }
          console.log('Tools data to set:', toolsData);
          setTools(Array.isArray(toolsData) ? toolsData : []);
        } else {
          showErrorToast(
            extractApiErrorMessage(response.message) || 'Failed to load tools'
          );
        }
      } catch (error: any) {
        console.error('Error loading tools:', error);
        if (error.status === 401) {
          handleAuthError(error);
        } else {
          showErrorToast(
            extractApiErrorMessage(error.message) || 'Failed to load tools'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, [user, showErrorToast, handleAuthError]);

  const handleDelete = async (uuid: string) => {
    try {
      const response = await apiService.deleteTool(uuid);
      if (response.statusCode === 200) {
        showSuccessToast(response.message || TOOL_MESSAGES.DELETE_SUCCESS);
        setTools(tools.filter(tool => tool.uuid !== uuid));
      } else {
        showErrorToast(
          extractApiErrorMessage(response.message) || TOOL_MESSAGES.DELETE_ERROR
        );
      }
    } catch (error: any) {
      console.error('Delete tool error:', error);
      if (error.status === 401) {
        handleAuthError(error);
      } else {
        showErrorToast(
          extractApiErrorMessage(error.message) || TOOL_MESSAGES.DELETE_ERROR
        );
      }
    }
  };

  const handleDeletePhoto = () => {
    setPhoto(null);
    setFileKey('');
  };

  const handleEdit = async (uuid: string) => {
    setEditToolUuid(uuid);
    setEditLoading(true);
    setSideSheetOpen(true);
    try {
      const response = await apiService.getToolDetails(uuid);
      if (response.statusCode === 200 && response.data) {
        setEditToolData(response.data);
      } else {
        showErrorToast(
          extractApiErrorMessage(response.message) ||
            TOOL_MESSAGES.FETCH_DETAILS_ERROR
        );
        setEditToolData(null);
        setSideSheetOpen(false);
      }
    } catch (error: any) {
      showErrorToast(
        extractApiErrorMessage(error.message) ||
          TOOL_MESSAGES.FETCH_DETAILS_ERROR
      );
      setEditToolData(null);
      setSideSheetOpen(false);
    } finally {
      setEditLoading(false);
    }
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
        // Refresh tools list - use the same API call as initial load
        const refreshResponse = await apiService.fetchTools({
          page: 1,
          limit: 50,
        });
        if (refreshResponse.statusCode === 200) {
          // Handle both possible response structures
          let toolsData = refreshResponse.data;
          if (
            refreshResponse.data &&
            typeof refreshResponse.data === 'object' &&
            !Array.isArray(refreshResponse.data) &&
            'data' in refreshResponse.data
          ) {
            toolsData = (refreshResponse.data as any).data;
          }
          setTools(Array.isArray(toolsData) ? toolsData : []);
        }
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

  const handleUpdateTool = async (data: {
    name: string;
    available_quantity: number;
    manufacturer: string;
    tool_assets: string;
    service_ids: string;
  }) => {
    setFormLoading(true);
    try {
      // Use new fileKey if uploaded, otherwise use the tool_assets from form data (which preserves existing assets)
      const toolAssets = fileKey || data.tool_assets || '';

      const payload: CreateToolRequest = {
        name: data.name,
        available_quantity: data.available_quantity,
        manufacturer: data.manufacturer,
        tool_assets: toolAssets,
        service_ids: data.service_ids,
      };

      console.log('Update tool payload:', payload); // Debug log
      console.log('Update tool UUID:', editToolUuid); // Debug log

      const response = await apiService.updateTool(editToolUuid!, payload);

      console.log('Update tool response:', response); // Debug log

      if (response.statusCode === 200 || response.statusCode === 201) {
        showSuccessToast(response.message || TOOL_MESSAGES.UPDATE_SUCCESS);
        setSideSheetOpen(false);
        setPhoto(null);
        setFileKey('');
        setEditToolUuid(null);
        setEditToolData(null);
        // Refresh tools list
        const refreshResponse = await apiService.fetchTools({
          page: 1,
          limit: 50,
        });
        if (refreshResponse.statusCode === 200) {
          // Handle both possible response structures
          let toolsData = refreshResponse.data;
          if (
            refreshResponse.data &&
            typeof refreshResponse.data === 'object' &&
            !Array.isArray(refreshResponse.data) &&
            'data' in refreshResponse.data
          ) {
            toolsData = (refreshResponse.data as any).data;
          }
          setTools(Array.isArray(toolsData) ? toolsData : []);
        }
      } else {
        showErrorToast(
          extractApiErrorMessage(response.message) || TOOL_MESSAGES.UPDATE_ERROR
        );
      }
    } catch (error: any) {
      console.error('Update tool error:', error); // Debug log
      if (error.status === 401) {
        handleAuthError(error);
      } else {
        showErrorToast(
          extractApiErrorMessage(error.message) || TOOL_MESSAGES.UPDATE_ERROR
        );
      }
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='w-full'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='page-title'>Tools Management</h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className='bg-[var(--card-background)] rounded-2xl p-2.5 flex flex-col border border-[var(--border-dark)] min-h-[6.25rem] animate-pulse'
            >
              <div className='flex gap-3'>
                <div className='w-[60px] h-[60px] rounded-[12px] bg-gray-300'></div>
                <div className='flex-1'>
                  <div className='h-4 bg-gray-300 rounded mb-2'></div>
                  <div className='h-3 bg-gray-300 rounded mb-2'></div>
                  <div className='flex gap-2'>
                    <div className='h-6 bg-gray-300 rounded w-16'></div>
                    <div className='h-6 bg-gray-300 rounded w-20'></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
          {tools.map((tool, index) => {
            const imageUrl =
              tool.assets && tool.assets[0]?.media_url
                ? cdnPrefix + tool.assets[0].media_url
                : '/images/tools-management/tools-img-1.png';
            return (
              <ToolCard
                key={tool.id ?? `${tool.name}-${tool.manufacturer}-${index}`}
                image={imageUrl}
                name={tool.name}
                brand={tool.manufacturer}
                quantity={tool.available_quantity}
                videoCount={0} // Static 0 for now as requested
                onDelete={() => handleDelete(tool.uuid)}
                onEdit={() => handleEdit(tool.uuid)}
              />
            );
          })}
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
        title={
          editToolUuid
            ? TOOL_MESSAGES.EDIT_TOOL_TITLE
            : TOOL_MESSAGES.ADD_TOOL_TITLE
        }
        open={sideSheetOpen}
        onOpenChange={setSideSheetOpen}
        size='600px'
      >
        {editLoading ? (
          <div className='p-6 text-center'>Loading...</div>
        ) : (
          <ToolForm
            photo={photo}
            setPhoto={setPhoto}
            handleDeletePhoto={handleDeletePhoto}
            uploading={uploading}
            onSubmit={editToolUuid ? handleUpdateTool : handleCreateTool}
            loading={formLoading}
            onCancel={() => {
              setSideSheetOpen(false);
              setPhoto(null);
              setFileKey('');
              setEditToolUuid(null);
              setEditToolData(null);
            }}
            setUploading={setUploading}
            setFileKey={setFileKey}
            existingImageUrl={
              editToolData &&
              editToolData.assets &&
              editToolData.assets[0]?.media_url
                ? cdnPrefix + editToolData.assets[0].media_url
                : undefined
            }
            existingToolAssets={editToolData?.tool_assets || ''}
            initialValues={
              editToolData
                ? {
                    name: editToolData.name,
                    available_quantity: editToolData.available_quantity,
                    manufacturer: editToolData.manufacturer,
                    services: editToolData.services?.map(s => s.id) || [],
                  }
                : undefined
            }
            isEdit={!!editToolUuid}
          />
        )}
      </SideSheet>
    </div>
  );
}
