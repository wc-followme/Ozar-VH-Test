'use client';

import { TOOL_MESSAGES } from '@/app/(DashboardLayout)/tools-management/tool-messages';
import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import MultiSelect from '@/components/shared/common/MultiSelect';
import PhotoUploadField from '@/components/shared/common/PhotoUploadField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiService, Service } from '@/lib/api';
import { getPresignedUrl, uploadFileToPresignedUrl } from '@/lib/upload';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface ToolFormProps {
  photo: File | null;
  setPhoto: (file: File | null) => void;
  handleDeletePhoto: () => void;
  uploading?: boolean;
  onSubmit: (data: {
    name: string;
    available_quantity: number;
    manufacturer: string;
    tool_assets: string;
    service_ids: string;
  }) => void;
  loading?: boolean;
  onCancel?: () => void;
  setUploading?: (uploading: boolean) => void;
  setFileKey?: (fileKey: string) => void;
}

const ToolForm: React.FC<ToolFormProps> = ({
  photo,
  setPhoto,
  handleDeletePhoto,
  uploading = false,
  onSubmit,
  loading = false,
  onCancel,
  setUploading,
  setFileKey,
}) => {
  // Form states
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [totalQuantity, setTotalQuantity] = useState<number>(1);
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    name?: string;
    manufacturer?: string;
    totalQuantity?: string;
    serviceIds?: string;
    general?: string;
  }>({});

  // Service dropdown states
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Handle photo change with upload
  const handlePhotoChange = async (file: File | null) => {
    if (!file) {
      setPhoto(null);
      setFileKey?.('');
      return;
    }

    setPhoto(file);
    setUploading?.(true);

    try {
      const ext = file.name.split('.').pop() || 'png';
      const timestamp = Date.now();
      const toolUuid = uuidv4();
      const generatedFileName = `tool_${toolUuid}_${timestamp}.${ext}`;

      const presigned = await getPresignedUrl({
        fileName: generatedFileName,
        fileType: file.type,
        fileSize: file.size,
        purpose: 'tool',
        customPath: '',
      });

      await uploadFileToPresignedUrl(presigned.data['uploadUrl'], file);
      setFileKey?.(presigned.data['fileKey'] || '');
    } catch (error) {
      console.error('Error uploading photo:', error);
      setErrors(prev => ({
        ...prev,
        general: TOOL_MESSAGES.UPLOAD_ERROR,
      }));
    } finally {
      setUploading?.(false);
    }
  };

  // Load services for dropdown
  useEffect(() => {
    const loadServices = async () => {
      setLoadingServices(true);
      try {
        const response = await apiService.fetchServicesForTools({
          page: 1,
          limit: 50,
          is_active: true,
        });

        if (response.statusCode === 200) {
          // Handle the correct response structure: { statusCode, message, data: { data: Service[], total, page, etc } }
          const servicesData = response.data?.data || response.data || [];
          setServices(Array.isArray(servicesData) ? servicesData : []);
        }
      } catch (error) {
        console.error('Error loading services:', error);
        setErrors(prev => ({
          ...prev,
          general: TOOL_MESSAGES.LOADING_SERVICES,
        }));
      } finally {
        setLoadingServices(false);
      }
    };

    loadServices();
  }, []);

  // Clear general error when form fields change
  const clearGeneralError = () => {
    if (errors.general) {
      setErrors(prev => {
        const { general, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    if (errors.name) {
      setErrors(prev => {
        const { name, ...rest } = prev;
        return rest;
      });
    }
    clearGeneralError();
  };

  const handleManufacturerChange = (value: string) => {
    setManufacturer(value);
    if (errors.manufacturer) {
      setErrors(prev => {
        const { manufacturer, ...rest } = prev;
        return rest;
      });
    }
    clearGeneralError();
  };

  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setTotalQuantity(numValue);
    if (errors.totalQuantity) {
      setErrors(prev => {
        const { totalQuantity, ...rest } = prev;
        return rest;
      });
    }
    clearGeneralError();
  };

  const handleServiceChange = (value: string[]) => {
    setServiceIds(value);
    if (errors.serviceIds) {
      setErrors(prev => {
        const { serviceIds, ...rest } = prev;
        return rest;
      });
    }
    clearGeneralError();
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = TOOL_MESSAGES.NAME_REQUIRED;
    }

    if (!manufacturer.trim()) {
      newErrors.manufacturer = TOOL_MESSAGES.MANUFACTURER_REQUIRED;
    }

    if (totalQuantity <= 0) {
      newErrors.totalQuantity = TOOL_MESSAGES.QUANTITY_MIN;
    }

    if (serviceIds.length === 0) {
      newErrors.serviceIds = TOOL_MESSAGES.SERVICES_REQUIRED;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    onSubmit({
      name: name.trim(),
      available_quantity: totalQuantity,
      manufacturer: manufacturer.trim(),
      tool_assets: '', // This will be set by the parent component
      service_ids: serviceIds.join(','), // Convert array to comma-separated string
    });
  };

  // Convert services to dropdown options
  const serviceOptions = Array.isArray(services)
    ? services.map(service => ({
        value: service.uuid,
        label: service.name,
      }))
    : [];

  return (
    <div className='p-0 w-full'>
      <form className='space-y-6' onSubmit={handleSubmit}>
        {/* General Error */}
        {errors.general && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-sm text-red-600'>{errors.general}</p>
          </div>
        )}

        {/* Photo Upload */}
        <PhotoUploadField
          photo={photo}
          onPhotoChange={handlePhotoChange}
          onDeletePhoto={handleDeletePhoto}
          uploading={uploading}
          label={TOOL_MESSAGES.TOOL_IMAGE_LABEL}
          text={
            <>
              1600 x 1200 (4:3) recommended. <br /> PNG and JPG files are
              allowed
            </>
          }
        />

        {/* Services Select */}
        <MultiSelect
          label={TOOL_MESSAGES.SERVICES_LABEL}
          value={serviceIds}
          onChange={handleServiceChange}
          options={serviceOptions}
          placeholder={
            loadingServices
              ? TOOL_MESSAGES.LOADING_SERVICES
              : TOOL_MESSAGES.SELECT_SERVICES
          }
          error={errors.serviceIds || ''}
        />

        {/* Tool Name */}
        <div className='space-y-2'>
          <Label htmlFor='tool-name' className='field-label'>
            {TOOL_MESSAGES.TOOL_NAME_LABEL}
          </Label>
          <Input
            id='tool-name'
            placeholder={TOOL_MESSAGES.ENTER_TOOL_NAME}
            value={name}
            onChange={e => handleNameChange(e.target.value)}
            className={cn(
              'input-field',
              errors.name
                ? 'border-[var(--warning)]'
                : 'border-[var(--border-dark)]'
            )}
          />
          <FormErrorMessage message={errors.name || ''} />
        </div>

        {/* Manufacturer */}
        <div className='space-y-2'>
          <Label htmlFor='manufacturer' className='field-label'>
            {TOOL_MESSAGES.MANUFACTURER_LABEL}
          </Label>
          <Input
            id='manufacturer'
            placeholder={TOOL_MESSAGES.ENTER_MANUFACTURER}
            value={manufacturer}
            onChange={e => handleManufacturerChange(e.target.value)}
            className={cn(
              'input-field',
              errors.manufacturer
                ? 'border-[var(--warning)]'
                : 'border-[var(--border-dark)]'
            )}
          />
          <FormErrorMessage message={errors.manufacturer || ''} />
        </div>

        {/* Total Quantity */}
        <div className='space-y-2'>
          <Label htmlFor='quantity' className='field-label'>
            {TOOL_MESSAGES.QUANTITY_LABEL}
          </Label>
          <Input
            id='quantity'
            type='number'
            min='1'
            placeholder={TOOL_MESSAGES.ENTER_QUANTITY}
            value={totalQuantity}
            onChange={e => handleQuantityChange(e.target.value)}
            className={cn(
              'input-field',
              errors.totalQuantity
                ? 'border-[var(--warning)]'
                : 'border-[var(--border-dark)]'
            )}
          />
          <FormErrorMessage message={errors.totalQuantity || ''} />
        </div>

        {/* Form Actions */}
        <div className='flex items-center justify-end space-x-3 pt-6'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={loading}
            className='btn-secondary'
          >
            {TOOL_MESSAGES.CANCEL_BUTTON}
          </Button>
          <Button
            type='submit'
            disabled={loading || uploading}
            className='btn-primary'
          >
            {loading
              ? TOOL_MESSAGES.CREATING_BUTTON
              : TOOL_MESSAGES.CREATE_BUTTON}
          </Button>
        </div>
      </form>
    </div>
  );
};

export { ToolForm };
