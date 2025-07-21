'use client';

import { COMPANY_MESSAGES } from '@/app/(DashboardLayout)/company-management/company-messages';
import {
  CompanyCreateFormData,
  CompanyFormErrors,
  CompanyInfoFormProps,
} from '@/app/(DashboardLayout)/company-management/company-types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { COUNTRY_CODES } from '@/constants/common';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as IconsaxCalendar } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import FormErrorMessage from '../common/FormErrorMessage';
import PhotoUploadField from '../common/PhotoUploadField';

export const CompanyInfoForm: React.FC<CompanyInfoFormProps> = React.memo(
  ({
    imageUrl,
    onSubmit,
    loading = false,
    initialData,
    isEditMode = false,
  }) => {
    const router = useRouter();

    // Form states
    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const [about, setAbout] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneCountryCode, setPhoneCountryCode] = useState('+1');
    const [communication, setCommunication] = useState('');
    const [website, setWebsite] = useState('');
    const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
    const [preferredCommunication, setPreferredCommunication] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [projects, setProjects] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);

    // Contractor fields
    const [contractorName, setContractorName] = useState('');
    const [contractorEmail, setContractorEmail] = useState('');
    const [contractorPhone, setContractorPhone] = useState('');
    const [contractorCountryCode, setContractorCountryCode] = useState('+1');
    const countryCodes = [
      { code: '+1', flag: '🇺🇸' },
      { code: '+44', flag: '🇬🇧' },
      { code: '+91', flag: '🇮🇳' },
      // Add more as needed
    ];

    const [errors, setErrors] = useState<CompanyFormErrors>({});

    // Photo upload stubs for contractor
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [uploading] = useState(false);
    const [fileKey, setFileKey] = useState<string | null>(null);
    const handlePhotoChange = (file: File | null) => {
      setPhotoFile(file);
    };
    const handleDeletePhoto = () => {
      setPhotoFile(null);
      setFileKey(null);
    };

    // Initialize form with initial data
    const initializeForm = useCallback(() => {
      if (isEditMode && initialData && !isInitialized) {
        setName(initialData.name || '');
        setTagline(initialData.tagline || '');
        setAbout(initialData.about || '');
        setEmail(initialData.email || '');

        // Handle phone number and country code
        if (initialData.country_code && initialData.phone_number) {
          // Separate fields available
          setPhoneCountryCode(initialData.country_code);
          setPhoneNumber(initialData.phone_number);
        } else if (initialData.phone_number) {
          // Combined phone number - extract country code
          const phoneStr = initialData.phone_number;
          const matchedCountry = COUNTRY_CODES.LIST.find(country =>
            phoneStr.startsWith(country.code)
          );
          if (matchedCountry) {
            setPhoneCountryCode(matchedCountry.code);
            setPhoneNumber(phoneStr.substring(matchedCountry.code.length));
          } else {
            // Default to +1 if no country code found
            setPhoneCountryCode('+1');
            setPhoneNumber(phoneStr);
          }
        }

        setCommunication(initialData.communication || '');
        setWebsite(initialData.website || '');

        // Set preferred communication method
        if (initialData.preferred_communication_method) {
          setPreferredCommunication(initialData.preferred_communication_method);
        }

        setCity(initialData.city || '');
        setPincode(initialData.pincode || '');
        setProjects(initialData.projects || '');

        if (initialData.expiry_date) {
          setExpiryDate(new Date(initialData.expiry_date));
        }

        setIsInitialized(true);
      }
    }, [isEditMode, initialData, isInitialized]);

    // Initialize form when component mounts or when initialData changes
    useEffect(() => {
      initializeForm();
    }, [initializeForm]);

    // Re-initialize form when initialData becomes available
    useEffect(() => {
      if (initialData && !isInitialized) {
        initializeForm();
      }
    }, [initialData, isInitialized, initializeForm]);

    // Fallback initialization - if data is available but form not initialized after 1 second
    useEffect(() => {
      if (isEditMode && initialData && !isInitialized) {
        const timer = setTimeout(() => {
          if (!isInitialized) {
            initializeForm();
          }
        }, 1000);

        return () => clearTimeout(timer);
      }
      return undefined;
    }, [isEditMode, initialData, isInitialized, initializeForm]);

    const validate = useCallback((): boolean => {
      const newErrors: CompanyFormErrors = {};

      if (!name) newErrors.name = COMPANY_MESSAGES.NAME_REQUIRED;
      if (!tagline) newErrors.tagline = COMPANY_MESSAGES.TAGLINE_REQUIRED;
      if (!about) newErrors.about = COMPANY_MESSAGES.ABOUT_REQUIRED;
      if (!email) newErrors.email = COMPANY_MESSAGES.EMAIL_REQUIRED;
      if (!phoneNumber)
        newErrors.phone_number = COMPANY_MESSAGES.PHONE_REQUIRED;
      if (!communication)
        newErrors.communication = COMPANY_MESSAGES.COMMUNICATION_REQUIRED;
      if (!website) newErrors.website = COMPANY_MESSAGES.WEBSITE_REQUIRED;
      if (!expiryDate)
        newErrors.expiry_date = COMPANY_MESSAGES.EXPIRY_DATE_REQUIRED;
      if (!preferredCommunication)
        newErrors.preferred_communication_method =
          COMPANY_MESSAGES.PREFERRED_COMMUNICATION_REQUIRED;
      if (!city) newErrors.city = COMPANY_MESSAGES.CITY_REQUIRED;
      if (!pincode) newErrors.pincode = COMPANY_MESSAGES.PINCODE_REQUIRED;
      if (!projects) newErrors.projects = COMPANY_MESSAGES.PROJECTS_REQUIRED;

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }, [
      name,
      tagline,
      about,
      email,
      phoneNumber,
      communication,
      website,
      expiryDate,
      preferredCommunication,
      city,
      pincode,
      projects,
    ]);

    const handleSubmit = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;

        // After validation, all required fields including expiryDate are guaranteed to be defined
        if (!expiryDate) {
          throw new Error('Expiry date is required but validation passed'); // This should never happen
        }

        const payload: CompanyCreateFormData = {
          name,
          tagline,
          about,
          email,
          country_code: phoneCountryCode,
          phone_number: phoneNumber,
          communication,
          website,
          preferred_communication_method: preferredCommunication,
          city,
          pincode,
          projects,
        };

        // Add optional fields only if they're set
        if (expiryDate) {
          payload.expiry_date = expiryDate.toISOString().split('T')[0];
        }

        if (imageUrl) {
          payload.image = imageUrl;
        }

        onSubmit(payload);
      },
      [
        validate,
        expiryDate,
        name,
        tagline,
        about,
        email,
        phoneCountryCode,
        phoneNumber,
        communication,
        website,
        preferredCommunication,
        city,
        pincode,
        projects,
        imageUrl,
        onSubmit,
      ]
    );

    const handleCancel = useCallback((): void => {
      router.push('/company-management');
    }, [router]);

    // Don't render form until data is loaded in edit mode
    if (isEditMode && !isInitialized && initialData) {
      return (
        <div className='flex items-center justify-center py-8'>
          <div className='text-center text-gray-500'>
            {COMPANY_MESSAGES.LOADING}
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Company Information */}
        <div>
          <h2 className='text-lg font-bold mb-4'>Company Information</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Company Name */}
            <div className='space-y-2'>
              <Label htmlFor='company-name' className='field-label'>
                {COMPANY_MESSAGES.COMPANY_NAME_LABEL}
              </Label>
              <Input
                id='company-name'
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={COMPANY_MESSAGES.ENTER_COMPANY_NAME}
                className='input-field'
              />
              <FormErrorMessage message={errors.name || ''} />
            </div>

            {/* Tagline */}
            <div className='space-y-2'>
              <Label htmlFor='tagline' className='field-label'>
                {COMPANY_MESSAGES.TAGLINE_LABEL}
              </Label>
              <Input
                id='tagline'
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder={COMPANY_MESSAGES.ENTER_TAGLINE}
                className='input-field'
              />
              <FormErrorMessage message={errors.tagline || ''} />
            </div>
            {/* About - Full Width */}
            <div className='space-y-2 col-span-2'>
              <Label htmlFor='about' className='field-label'>
                {COMPANY_MESSAGES.ABOUT_LABEL}
              </Label>
              <Textarea
                id='about'
                value={about}
                onChange={e => setAbout(e.target.value)}
                placeholder={COMPANY_MESSAGES.ENTER_ABOUT}
                rows={3}
                className='border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
              />
              <FormErrorMessage message={errors.about || ''} />
            </div>
            {/* Email */}
            <div className='space-y-2'>
              <Label htmlFor='email' className='field-label'>
                {COMPANY_MESSAGES.EMAIL_LABEL}
              </Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={COMPANY_MESSAGES.ENTER_EMAIL}
                className='input-field'
              />
              <FormErrorMessage message={errors.email || ''} />
            </div>

            {/* Phone Number */}
            <div className='space-y-2'>
              <Label htmlFor='phone' className='field-label'>
                {COMPANY_MESSAGES.PHONE_LABEL}
              </Label>
              <div className='flex'>
                <Select
                  value={phoneCountryCode}
                  onValueChange={value => {
                    setPhoneCountryCode(value);
                  }}
                >
                  <SelectTrigger
                    className={cn(
                      'w-24 h-12 rounded-l-[10px] rounded-r-none border-2 border-r-0 bg-[var(--white-background)]',
                      errors.phone_number
                        ? 'border-[var(--warning)]'
                        : 'border-[var(--border-dark)]'
                    )}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px] max-h-60 overflow-y-auto'>
                    {COUNTRY_CODES.LIST.map(country => (
                      <SelectItem key={country.key} value={country.code}>
                        <div className='flex items-center gap-2'>
                          <span>{country.flag}</span>
                          <span>{country.code}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  id='phone'
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder={COMPANY_MESSAGES.ENTER_PHONE}
                  className={cn(
                    'h-12 flex-1 rounded-r-[10px] rounded-l-none border-2 border-l-0 bg-[var(--white-background)] !placeholder-[var(--text-placeholder)]',
                    errors.phone_number
                      ? 'border-[var(--warning)]'
                      : 'border-[var(--border-dark)]'
                  )}
                />
              </div>
              <FormErrorMessage message={errors.phone_number || ''} />
            </div>
            <div className='space-y-2 col-span-2'>
              <Label htmlFor='email' className='field-label'>
                Address
              </Label>
              <Input
                id='email'
                type='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={COMPANY_MESSAGES.ENTER_EMAIL}
                className='input-field'
              />
              <FormErrorMessage message={errors.email || ''} />
            </div>

            {/* City */}
            <div className='space-y-2'>
              <Label htmlFor='city' className='field-label'>
                {COMPANY_MESSAGES.CITY_LABEL}
              </Label>
              <Input
                id='city'
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder={COMPANY_MESSAGES.ENTER_CITY}
                className='input-field'
              />
              <FormErrorMessage message={errors.city || ''} />
            </div>

            {/* Pin Code */}
            <div className='space-y-2'>
              <Label htmlFor='pincode' className='field-label'>
                {COMPANY_MESSAGES.PINCODE_LABEL}
              </Label>
              <Input
                id='pincode'
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                placeholder={COMPANY_MESSAGES.ENTER_PINCODE}
                className='input-field'
              />
              <FormErrorMessage message={errors.pincode || ''} />
            </div>
            {/* Website */}
            <div className='space-y-2'>
              <Label htmlFor='website' className='field-label'>
                {COMPANY_MESSAGES.WEBSITE_LABEL}
              </Label>
              <Input
                id='website'
                type='url'
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder={COMPANY_MESSAGES.ENTER_WEBSITE}
                className='input-field'
              />
              <FormErrorMessage message={errors.website || ''} />
            </div>

            {/* Expiry Date */}
            <div className='space-y-2'>
              <Label className='field-label'>
                {COMPANY_MESSAGES.EXPIRY_DATE_LABEL}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full h-12 justify-between text-left font-normal border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px]',
                      !expiryDate && 'text-muted-foreground'
                    )}
                  >
                    {' '}
                    {expiryDate ? (
                      format(expiryDate, 'PPP')
                    ) : (
                      <span className='flex-1'>
                        {COMPANY_MESSAGES.SELECT_EXPIRY_DATE}
                      </span>
                    )}
                    <IconsaxCalendar
                      className='ml-2 !h-6 !w-6'
                      color='var(--primary)'
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='w-auto p-0 bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'
                  align='start'
                >
                  <Calendar
                    mode='single'
                    selected={expiryDate}
                    onSelect={setExpiryDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormErrorMessage message={errors.expiry_date || ''} />
            </div>
            {/* Preferred Communication */}
            <div className='space-y-2'>
              <Label className='field-label'>
                {COMPANY_MESSAGES.PREFERRED_COMMUNICATION_LABEL}
              </Label>
              <Select
                value={preferredCommunication}
                onValueChange={value => {
                  setPreferredCommunication(value);
                }}
              >
                <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px]'>
                  <SelectValue
                    placeholder={
                      COMPANY_MESSAGES.SELECT_PREFERRED_COMMUNICATION
                    }
                  />
                </SelectTrigger>
                <SelectContent className='bg-[var(--white-background)] border border-[var(--border-light)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                  <SelectItem value='email'>
                    {COMPANY_MESSAGES.EMAIL_OPTION}
                  </SelectItem>
                  <SelectItem value='phone'>
                    {COMPANY_MESSAGES.PHONE_OPTION}
                  </SelectItem>
                  <SelectItem value='sms'>
                    {COMPANY_MESSAGES.SMS_OPTION}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormErrorMessage
                message={errors.preferred_communication_method || ''}
              />
            </div>
            <div className='col-span-2 pt-6'>
              <h2 className='text-lg font-bold mb-4'>
                Contractor Information{' '}
                <span className='font-medium text-[var(--text-secondary)]'>
                  (Optional)
                </span>
              </h2>
              <div className='flex items-center gap-6'>
                <div className='h-[180px] w-[180px]'>
                  <PhotoUploadField
                    photo={photoFile}
                    onPhotoChange={handlePhotoChange}
                    onDeletePhoto={handleDeletePhoto}
                    label={COMPANY_MESSAGES.UPLOAD_PHOTO_LABEL}
                    uploading={uploading}
                    existingImageUrl={
                      fileKey && !photoFile
                        ? (process.env['NEXT_PUBLIC_CDN_URL'] || '') + fileKey
                        : ''
                    }
                    cardHeight='h-[180px]'
                  />
                  {uploading && (
                    <div className='text-xs mt-2'>
                      {COMPANY_MESSAGES.UPLOADING}
                    </div>
                  )}
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 flex-1'>
                  {/* Contractor Name */}
                  <div className='col-span-2 space-y-2'>
                    <Label htmlFor='contractor-name' className='field-label'>
                      {COMPANY_MESSAGES.CONTRACTOR_NAME_LABEL}
                    </Label>
                    <Input
                      id='contractor-name'
                      value={contractorName}
                      onChange={e => setContractorName(e.target.value)}
                      placeholder={COMPANY_MESSAGES.ENTER_CONTRACTOR_NAME}
                      className='input-field'
                    />
                    <FormErrorMessage message={errors.contractor_name || ''} />
                  </div>

                  {/* Contractor Email */}
                  <div className='space-y-2'>
                    <Label htmlFor='contractor-email' className='field-label'>
                      {COMPANY_MESSAGES.CONTRACTOR_EMAIL_LABEL}
                    </Label>
                    <Input
                      id='contractor-email'
                      type='email'
                      value={contractorEmail}
                      onChange={e => setContractorEmail(e.target.value)}
                      placeholder={COMPANY_MESSAGES.ENTER_CONTRACTOR_EMAIL}
                      className='input-field'
                    />
                    <FormErrorMessage message={errors.contractor_email || ''} />
                  </div>

                  {/* Contractor Phone */}
                  <div className='space-y-2'>
                    <Label htmlFor='contractor-phone' className='field-label'>
                      {COMPANY_MESSAGES.CONTRACTOR_PHONE_LABEL}
                    </Label>
                    <div className='flex'>
                      <Select
                        value={contractorCountryCode}
                        onValueChange={setContractorCountryCode}
                      >
                        <SelectTrigger
                          className={cn(
                            'w-24 h-12 rounded-l-[10px] rounded-r-none border-2 border-r-0 bg-[var(--white-background)]',
                            errors.contractor_phone
                              ? 'border-[var(--warning)]'
                              : 'border-[var(--border-dark)]'
                          )}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px] max-h-60 overflow-y-auto'>
                          {countryCodes.map(country => (
                            <SelectItem key={country.code} value={country.code}>
                              <div className='flex items-center gap-2'>
                                <span>{country.flag}</span>
                                <span>{country.code}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id='contractor-phone'
                        value={contractorPhone}
                        onChange={e => setContractorPhone(e.target.value)}
                        placeholder={COMPANY_MESSAGES.ENTER_CONTRACTOR_PHONE}
                        className={cn(
                          'h-12 flex-1 rounded-r-[10px] rounded-l-none border-2 border-l-0 bg-[var(--white-background)] !placeholder-[var(--text-placeholder)]',
                          errors.contractor_phone
                            ? 'border-[var(--warning)]'
                            : 'border-[var(--border-dark)]'
                        )}
                      />
                    </div>
                    <FormErrorMessage message={errors.contractor_phone || ''} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Communication - Full Width */}
          {/* <div className='mt-4'>
            <Label htmlFor='communication' className='field-label'>
              {COMPANY_MESSAGES.COMMUNICATION_LABEL}
            </Label>
            <Textarea
              id='communication'
              value={communication}
              onChange={e => setCommunication(e.target.value)}
              placeholder={COMPANY_MESSAGES.ENTER_COMMUNICATION}
              rows={3}
              className='border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
            <FormErrorMessage message={errors.communication || ''} />
          </div> */}

          {/* Projects - Full Width */}
          {/* <div className='space-y-2 mt-4'>
            <Label htmlFor='projects' className='field-label'>
              {COMPANY_MESSAGES.PROJECTS_LABEL}
            </Label>
            <Textarea
              id='projects'
              value={projects}
              onChange={e => setProjects(e.target.value)}
              placeholder={COMPANY_MESSAGES.ENTER_PROJECTS}
              rows={3}
              className='border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
            <FormErrorMessage message={errors.projects || ''} />
          </div> */}
        </div>

        {/* Form Actions */}
        <div className='flex items-center justify-end gap-4 pt-6'>
          <Button
            type='button'
            variant='outline'
            onClick={handleCancel}
            disabled={loading}
            className='btn-secondary !px-8 !h-12'
          >
            {COMPANY_MESSAGES.CANCEL_BUTTON}
          </Button>
          <Button
            type='submit'
            disabled={loading}
            className='btn-primary !h-12 !px-12'
          >
            {loading
              ? 'Creating...'
              : isEditMode
                ? COMPANY_MESSAGES.UPDATE_BUTTON
                : COMPANY_MESSAGES.CREATE_BUTTON}
          </Button>
        </div>
      </form>
    );
  }
);

CompanyInfoForm.displayName = 'CompanyInfoForm';
