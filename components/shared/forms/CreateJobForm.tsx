'use client';

import { JOB_MESSAGES } from '@/app/(DashboardLayout)/job-management/job-messages';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { JOB_TYPE, JobType, ROLE_ID } from '@/constants/common';
import { useDebounce } from '@/hooks/use-debounce';
import { apiService } from '@/lib/api';
import { cn } from '@/lib/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { showErrorToast } from '../../ui/use-toast';
import { RadioGroupStripe } from '../common/RadioStripe';
import { SelectBoxCard } from '../common/SelectBoxCard';

const selectBoxOptions = [
  {
    id: 'homeowner-info',
    value: 'FIRST',
    title: 'Homeowner Info',
    description:
      'Includes name, email, phone number, and basic contact details.',
    disabled: false,
  },
  {
    id: 'property-details',
    value: 'SECOND',
    title: 'Property Details',
    description:
      'Covers home size, number of BHKs, and type of work (interior, exterior, etc.).',
    disabled: false,
  },
  {
    id: 'project-estimate',
    value: 'THIRD',
    title: 'Project Estimate',
    description:
      'Provides a detailed cost estimate based on selected services and property info.',
    disabled: false,
  },
  {
    id: 'adding-more',
    value: 'FOURTH',
    title: 'Adding more project details',
    description:
      'Includes name, email, phone number, and basic contact details.',
    disabled: true,
  },
  {
    id: 'complete-estimate',
    value: 'FIFTH',
    title: 'Complete line items in estimates to create new estimates.',
    description: 'Covers home size, number of BHKs, and type of work.',
    disabled: true,
  },
];

// Types
export interface CreateJobFormData {
  client_name: string;
  client_email: string;
  client_phone_number: string;
  job_privacy: JobType;
  job_boxes_step: string[];
  client_id?: string;
}

const createJobSchema = yup.object({
  client_name: yup.string().required(JOB_MESSAGES.NAME_REQUIRED),
  client_email: yup
    .string()
    .email(JOB_MESSAGES.EMAIL_REQUIRED)
    .required(JOB_MESSAGES.EMAIL_REQUIRED),
  client_phone_number: yup.string().required(JOB_MESSAGES.PHONE_REQUIRED),
  job_privacy: yup
    .mixed<JobType>()
    .oneOf([JOB_TYPE.PUBLIC, JOB_TYPE.PRIVATE])
    .required(JOB_MESSAGES.JOB_TYPE_LABEL),
  job_boxes_step: yup.array().of(yup.string().required()).default([]),
});

export function CreateJobForm({
  onSubmit: onSubmitProp,
  isSubmitting = false,
  defaultValues,
  onCancel,
  generatedLink,
}: {
  onSubmit?: (data: CreateJobFormData) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<CreateJobFormData & { link?: string }>;
  onCancel?: () => void;
  generatedLink?: string;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
  } = useForm<CreateJobFormData>({
    resolver: yupResolver(createJobSchema),
    defaultValues: {
      client_name: '',
      client_email: '',
      client_phone_number: '',
      job_privacy: JOB_TYPE.PUBLIC,
      job_boxes_step: [],
      client_id: '',
      ...defaultValues,
    },
  });
  console.log('generatedLink', generatedLink);
  // Autocomplete state
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const clientNameValue = watch('client_name');
  const debouncedName = useDebounce(clientNameValue, 400);
  // Track if a user was selected from dropdown
  const [userSelected, setUserSelected] = useState(false);
  const suppressNextSearch = useRef(false);
  const { showSuccessToast } = useToast();

  useEffect(() => {
    if (suppressNextSearch.current) {
      suppressNextSearch.current = false;
      return;
    }
    if (!debouncedName || debouncedName.length < 2) {
      setUserOptions([]);
      setShowDropdown(false);
      return;
    }
    setUserLoading(true);
    (async () => {
      try {
        const response = await apiService.getUsersDropdown({
          name: debouncedName,
          role_id: ROLE_ID.JOB_USER,
          page: 1,
          limit: 10,
        });
        let users: any[] = [];
        if (response && Array.isArray(response.data)) {
          users = response.data;
        } else if (
          response &&
          response.data &&
          Array.isArray(response.data.data)
        ) {
          users = response.data.data;
        }
        setUserOptions(users);
        setShowDropdown(true);
      } catch (err: any) {
        setUserOptions([]);
        setShowDropdown(false);
        showErrorToast(err?.message || 'Failed to fetch users');
      } finally {
        setUserLoading(false);
      }
    })();
  }, [debouncedName]);

  // Handle selecting a user from dropdown
  const handleSelectUser = (user: any) => {
    setValue('client_name', user.name || '');
    if (user.email) setValue('client_email', user.email);
    if (user.phone_number) setValue('client_phone_number', user.phone_number);
    if (user.id) setValue('client_id', user.id);
    setShowDropdown(false);
    setUserSelected(true);
    suppressNextSearch.current = true;
    clearErrors(['client_name', 'client_email', 'client_phone_number']);
  };

  // Close dropdown on blur
  const nameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        nameInputRef.current &&
        !nameInputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Card className='w-full max-w-4xl mx-auto bg-transparent shadow-none border-0'>
      <CardContent className='p-0'>
        <form
          onSubmit={handleSubmit(onSubmitProp || (() => {}))}
          className='space-y-6'
        >
          {/* Full Name Input with Autocomplete */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2 col-span-2 relative'>
              <Label htmlFor='client_name' className='fled-label'>
                {JOB_MESSAGES.JOB_NAME_LABEL}
              </Label>
              <Controller
                name='client_name'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='client_name'
                    placeholder={JOB_MESSAGES.ENTER_JOB_NAME}
                    className={cn(
                      'h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                      userLoading ? 'pr-10' : ''
                    )}
                    autoComplete='off'
                    ref={nameInputRef}
                    onChange={e => {
                      field.onChange(e);
                      if (e.target.value !== clientNameValue) {
                        setUserSelected(false);
                        setValue('client_id', '');
                      }
                    }}
                  />
                )}
              />
              {errors.client_name && (
                <span className='text-red-500 text-xs'>
                  {errors.client_name.message}
                </span>
              )}
              {/* Dropdown */}
              {(userOptions.length > 0 || userLoading) && showDropdown && (
                <div className='absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded shadow mt-1 max-h-56 overflow-auto'>
                  {userLoading && (
                    <div className='p-2 text-gray-500 text-sm'>Loading...</div>
                  )}
                  {!userLoading &&
                    userOptions.map((user, idx) => (
                      <div
                        key={user.id || idx}
                        className='p-2 hover:bg-gray-100 cursor-pointer text-sm'
                        onMouseDown={() => handleSelectUser(user)}
                      >
                        {user.name}{' '}
                        {user.email ? (
                          <span className='text-gray-400'>
                            ({`${user.email},${user.phone_number}`})
                          </span>
                        ) : null}
                      </div>
                    ))}
                  {!userLoading && userOptions.length === 0 && (
                    <div className='p-2 text-gray-500 text-sm'>
                      No users found. You can use your input.
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='client_email' className='fled-label'>
                {JOB_MESSAGES.EMAIL_LABEL}
              </Label>
              <Controller
                name='client_email'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='client_email'
                    placeholder={JOB_MESSAGES.ENTER_EMAIL}
                    className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
                    disabled={userSelected}
                  />
                )}
              />
              {errors.client_email && (
                <span className='text-red-500 text-xs'>
                  {errors.client_email.message}
                </span>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='client_phone_number' className='fled-label'>
                {JOB_MESSAGES.PHONE_LABEL}
              </Label>
              <Controller
                name='client_phone_number'
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id='client_phone_number'
                    placeholder={JOB_MESSAGES.ENTER_PHONE}
                    className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
                    disabled={userSelected}
                  />
                )}
              />
              {errors.client_phone_number && (
                <span className='text-red-500 text-xs'>
                  {errors.client_phone_number.message}
                </span>
              )}
            </div>
          </div>

          {/* Job Type Radio Group */}
          <div className='space-y-3'>
            {/* <Label className='fled-label'>{JOB_MESSAGES.JOB_TYPE_LABEL}</Label> */}
            <Controller
              name='job_privacy'
              control={control}
              render={({ field }) => (
                <RadioGroupStripe
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.job_privacy && (
              <span className='text-red-500 text-xs'>
                {errors.job_privacy.message}
              </span>
            )}
          </div>

          {/* Select Boxes Section */}
          <div className='space-y-4'>
            <Label className='fled-label'>Select Boxes</Label>
            <Controller
              name='job_boxes_step'
              control={control}
              render={({ field }) => {
                const value: string[] = Array.isArray(field.value)
                  ? field.value.filter(
                      (v): v is string => typeof v === 'string'
                    )
                  : [];
                // Helper to determine if a value is selected
                const isSelected = (v: string) => value.includes(v);
                return (
                  <div className='grid gap-4 grid-cols-3 md:grid-cols-3'>
                    {selectBoxOptions.map(
                      ({
                        id,
                        value: optionValue,
                        title,
                        description,
                        disabled,
                      }) => {
                        // Dependency logic
                        let isDisabled = disabled;
                        if (
                          optionValue === 'FIRST' &&
                          (isSelected('SECOND') || isSelected('THIRD'))
                        ) {
                          isDisabled = true;
                        }
                        if (optionValue === 'SECOND' && isSelected('THIRD')) {
                          isDisabled = true;
                        }
                        return (
                          <SelectBoxCard
                            key={id}
                            id={id}
                            name={field.name}
                            value={optionValue}
                            title={title}
                            description={description}
                            checked={isSelected(optionValue)}
                            disabled={isDisabled}
                            onChange={checked => {
                              let selected = [...value];
                              if (checked) {
                                if (optionValue === 'FIRST') {
                                  selected = Array.from(
                                    new Set([...selected, 'FIRST'])
                                  );
                                } else if (optionValue === 'SECOND') {
                                  selected = Array.from(
                                    new Set([...selected, 'FIRST', 'SECOND'])
                                  );
                                } else if (optionValue === 'THIRD') {
                                  selected = Array.from(
                                    new Set([
                                      ...selected,
                                      'FIRST',
                                      'SECOND',
                                      'THIRD',
                                    ])
                                  );
                                } else {
                                  selected = Array.from(
                                    new Set([...selected, optionValue])
                                  );
                                }
                              } else {
                                if (optionValue === 'FIRST') {
                                  // Only allow unselect if neither SECOND nor THIRD is selected
                                  if (
                                    !isSelected('SECOND') &&
                                    !isSelected('THIRD')
                                  ) {
                                    selected = selected.filter(
                                      v => v !== 'FIRST'
                                    );
                                  }
                                } else if (optionValue === 'SECOND') {
                                  // Only allow unselect if THIRD is not selected
                                  if (!isSelected('THIRD')) {
                                    selected = selected.filter(
                                      v => v !== 'SECOND'
                                    );
                                  }
                                } else if (optionValue === 'THIRD') {
                                  selected = selected.filter(
                                    v => v !== 'THIRD'
                                  );
                                } else {
                                  selected = selected.filter(
                                    v => v !== optionValue
                                  );
                                }
                              }
                              field.onChange(selected);
                            }}
                          />
                        );
                      }
                    )}
                  </div>
                );
              }}
            />
            {errors.job_boxes_step && (
              <span className='text-red-500 text-xs'>
                {errors.job_boxes_step.message as string}
              </span>
            )}
          </div>

          {/* Read-only Link Display (if present) */}
          {defaultValues?.link && (
            <div className='space-y-2'>
              <Label htmlFor='link' className='fled-label'>
                {JOB_MESSAGES.LINK_LABEL}
              </Label>
              <Input
                id='link'
                value={defaultValues.link}
                readOnly
                className='h-12 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] opacity-60 cursor-not-allowed'
              />
            </div>
          )}

          {/* Generated Home Owner Link Display */}
          {generatedLink && (
            <div className='space-y-2'>
              <Label htmlFor='generatedLink' className='fled-label'>
                Link
              </Label>
              <Input
                id='generatedLink'
                value={generatedLink}
                readOnly
                className='h-12 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] opacity-60 cursor-not-allowed'
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className='pt-4 flex items-center gap-3'>
            {generatedLink ? (
              <>
                <Button
                  type='button'
                  className='btn-secondary !h-12'
                  onClick={() => {
                    if (generatedLink) {
                      window.open(generatedLink, '_blank');
                    }
                  }}
                >
                  Continue Estimate
                </Button>
                <Button
                  className='btn-primary !h-12'
                  type='button'
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLink);
                    showSuccessToast('Link copied!');
                  }}
                >
                  Copy Link
                </Button>
              </>
            ) : (
              <>
                <Button
                  type='button'
                  className='btn-secondary !h-12'
                  onClick={onCancel}
                >
                  {JOB_MESSAGES.CANCEL_BUTTON}
                </Button>
                {defaultValues?.link && (
                  <Button className='btn-secondary !h-12' type='button'>
                    Continue Estimate
                  </Button>
                )}
                <Button
                  type='submit'
                  className='btn-primary !h-12'
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? JOB_MESSAGES.CREATING_BUTTON
                    : JOB_MESSAGES.CREATE_BUTTON}
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
