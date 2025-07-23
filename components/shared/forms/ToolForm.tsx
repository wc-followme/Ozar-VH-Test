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
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';

// Validation schema
const toolFormSchema = yup.object({
  name: yup.string().required(TOOL_MESSAGES.NAME_REQUIRED),
  manufacturer: yup.string().required(TOOL_MESSAGES.MANUFACTURER_REQUIRED),
  available_quantity: yup
    .number()
    .min(1, TOOL_MESSAGES.QUANTITY_MIN)
    .required(TOOL_MESSAGES.QUANTITY_REQUIRED),
  services: yup.array().min(1, TOOL_MESSAGES.SERVICES_REQUIRED),
});

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
  existingImageUrl?: string | undefined;
  existingToolAssets?: string;
  initialValues?: {
    name?: string;
    available_quantity?: number;
    manufacturer?: string;
    services?: (string | number)[];
  };
  isEdit?: boolean;
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
  existingImageUrl,
  existingToolAssets,
  initialValues,
  isEdit = false,
}) => {
  // Service dropdown states
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(toolFormSchema),
    defaultValues: {
      name: initialValues?.name || '',
      manufacturer: initialValues?.manufacturer || '',
      available_quantity: initialValues?.available_quantity || 1,
      services:
        initialValues?.services?.map(s => s.toString()).filter(Boolean) || [],
    },
  });

  // Update form state if initialValues change (for edit mode)
  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name || '',
        manufacturer: initialValues.manufacturer || '',
        available_quantity: initialValues.available_quantity || 1,
        services:
          initialValues.services?.map(s => s.toString()).filter(Boolean) || [],
      });
    }
  }, [initialValues, reset]);

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
      // setErrors(prev => ({
      //   ...prev,
      //   general: TOOL_MESSAGES.UPLOAD_ERROR,
      // }));
    } finally {
      setUploading?.(false);
    }
  };

  // Load services for dropdown
  useEffect(() => {
    const loadServices = async () => {
      setLoadingServices(true);
      try {
        const response = await apiService.fetchServices({
          page: 1,
          limit: 50,
        });

        if (response.statusCode === 200) {
          // Handle the actual API response structure: { statusCode, message, data: Service[], limit, page, total, totalPages }
          let servicesData = response.data || [];

          // If data is an object with a 'data' property (nested structure), use that
          if (
            response.data &&
            typeof response.data === 'object' &&
            !Array.isArray(response.data) &&
            response.data.data
          ) {
            servicesData = response.data.data;
          }

          const finalServices = Array.isArray(servicesData) ? servicesData : [];
          setServices(finalServices);
        }
      } catch (error) {
        console.error('Error loading services:', error);
        // setErrors(prev => ({
        //   ...prev,
        //   general: TOOL_MESSAGES.LOADING_SERVICES,
        // }));
      } finally {
        setLoadingServices(false);
      }
    };

    loadServices();
  }, []);

  // Clear general error when form fields change
  const clearGeneralError = () => {
    // React Hook Form handles error clearing automatically
  };

  const handleSubmitForm = (data: {
    services?: any[] | undefined;
    name: string;
    manufacturer: string;
    available_quantity: number;
  }) => {
    onSubmit({
      name: data.name.trim(),
      available_quantity: data.available_quantity,
      manufacturer: data.manufacturer.trim(),
      tool_assets: existingToolAssets || '', // Preserve existing tool assets if no new file is uploaded
      service_ids: (data.services || []).join(','), // Convert array to comma-separated string
    });
  };

  // Convert services to dropdown options
  const serviceOptions = Array.isArray(services)
    ? services
        .filter(service => service.id && service.name) // Filter out invalid services
        .map(service => ({
          value: service.id.toString(),
          label: service.name,
        }))
    : [];

  return (
    <div className='p-0 w-full'>
      <form className='space-y-6' onSubmit={handleSubmit(handleSubmitForm)}>
        {/* General Error */}
        {/* {errors.general && (
          <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
            <p className='text-sm text-red-600'>{errors.general}</p>
          </div>
        )} */}

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
          existingImageUrl={existingImageUrl}
        />

        {/* Services Select */}
        <Controller
          name='services'
          control={control}
          render={({ field }) => (
            <MultiSelect
              key={`services-${isEdit ? 'edit' : 'create'}-${serviceOptions.length}`}
              label={TOOL_MESSAGES.SERVICES_LABEL}
              value={Array.isArray(field.value) ? field.value : []}
              onChange={field.onChange}
              options={serviceOptions}
              placeholder={
                loadingServices
                  ? TOOL_MESSAGES.LOADING_SERVICES
                  : TOOL_MESSAGES.SELECT_SERVICES
              }
              error={errors.services?.message || ''}
            />
          )}
        />

        {/* Tool Name */}
        <div className='space-y-2'>
          <Label htmlFor='tool-name' className='field-label'>
            {TOOL_MESSAGES.TOOL_NAME_LABEL}
          </Label>
          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input
                id='tool-name'
                placeholder={TOOL_MESSAGES.ENTER_TOOL_NAME}
                {...field}
                className={cn(
                  'input-field',
                  errors.name
                    ? 'border-[var(--warning)]'
                    : 'border-[var(--border-dark)]'
                )}
              />
            )}
          />
          <FormErrorMessage message={errors.name?.message || ''} />
        </div>

        {/* Manufacturer */}
        <div className='space-y-2'>
          <Label htmlFor='manufacturer' className='field-label'>
            {TOOL_MESSAGES.MANUFACTURER_LABEL}
          </Label>
          <Controller
            name='manufacturer'
            control={control}
            render={({ field }) => (
              <Input
                id='manufacturer'
                placeholder={TOOL_MESSAGES.ENTER_MANUFACTURER}
                {...field}
                className={cn(
                  'input-field',
                  errors.manufacturer
                    ? 'border-[var(--warning)]'
                    : 'border-[var(--border-dark)]'
                )}
              />
            )}
          />
          <FormErrorMessage message={errors.manufacturer?.message || ''} />
        </div>

        {/* Quantity */}
        <div className='space-y-2'>
          <Label htmlFor='quantity' className='field-label'>
            {TOOL_MESSAGES.QUANTITY_LABEL}
          </Label>
          <Controller
            name='available_quantity'
            control={control}
            render={({ field }) => (
              <Input
                id='quantity'
                type='number'
                min='1'
                placeholder={TOOL_MESSAGES.ENTER_QUANTITY}
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                className={cn(
                  'input-field',
                  errors.available_quantity
                    ? 'border-[var(--warning)]'
                    : 'border-[var(--border-dark)]'
                )}
              />
            )}
          />
          <FormErrorMessage
            message={errors.available_quantity?.message || ''}
          />
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
              ? isEdit
                ? TOOL_MESSAGES.UPDATING_BUTTON
                : TOOL_MESSAGES.CREATING_BUTTON
              : isEdit
                ? TOOL_MESSAGES.UPDATE_BUTTON
                : TOOL_MESSAGES.CREATE_BUTTON}
          </Button>
        </div>
      </form>
    </div>
  );
};

export { ToolForm };
