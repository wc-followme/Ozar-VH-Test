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
import { Calendar as CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import FormErrorMessage from '../common/FormErrorMessage';

export function CompanyInfoForm({
  imageUrl,
  onSubmit,
  loading = false,
  initialData,
  isEditMode = false,
}: CompanyInfoFormProps) {
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

  const [errors, setErrors] = useState<CompanyFormErrors>({});

  // Set initial data for edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
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
      setPreferredCommunication(
        initialData.preferred_communication_method || ''
      );
      setCity(initialData.city || '');
      setPincode(initialData.pincode || '');
      setProjects(initialData.projects || '');

      if (initialData.expiry_date) {
        setExpiryDate(new Date(initialData.expiry_date));
      }
    }
  }, [isEditMode, initialData]);

  const validate = (): boolean => {
    const newErrors: CompanyFormErrors = {};

    if (!name) newErrors.name = COMPANY_MESSAGES.NAME_REQUIRED;
    if (!tagline) newErrors.tagline = COMPANY_MESSAGES.TAGLINE_REQUIRED;
    if (!about) newErrors.about = COMPANY_MESSAGES.ABOUT_REQUIRED;
    if (!email) newErrors.email = COMPANY_MESSAGES.EMAIL_REQUIRED;
    if (!phoneNumber) newErrors.phone_number = COMPANY_MESSAGES.PHONE_REQUIRED;
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
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
  };

  const handleCancel = (): void => {
    router.push('/company-management');
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Company Information */}
      <div>
        <h2 className='text-lg font-bold mb-4'>Company Information</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Company Name */}
          <div className='space-y-2'>
            <Label
              htmlFor='company-name'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              {COMPANY_MESSAGES.COMPANY_NAME_LABEL}
            </Label>
            <Input
              id='company-name'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={COMPANY_MESSAGES.ENTER_COMPANY_NAME}
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
            <FormErrorMessage message={errors.name || ''} />
          </div>

          {/* Tagline */}
          <div className='space-y-2'>
            <Label
              htmlFor='tagline'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              {COMPANY_MESSAGES.TAGLINE_LABEL}
            </Label>
            <Input
              id='tagline'
              value={tagline}
              onChange={e => setTagline(e.target.value)}
              placeholder={COMPANY_MESSAGES.ENTER_TAGLINE}
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
            <FormErrorMessage message={errors.tagline || ''} />
          </div>

          {/* Email */}
          <div className='space-y-2'>
            <Label
              htmlFor='email'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              {COMPANY_MESSAGES.EMAIL_LABEL}
            </Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={COMPANY_MESSAGES.ENTER_EMAIL}
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
            <FormErrorMessage message={errors.email || ''} />
          </div>

          {/* Phone Number */}
          <div className='space-y-2'>
            <Label
              htmlFor='phone'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              {COMPANY_MESSAGES.PHONE_LABEL}
            </Label>
            <div className='flex gap-2'>
              <Select
                value={phoneCountryCode}
                onValueChange={setPhoneCountryCode}
              >
                <SelectTrigger className='w-[120px] h-12 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                  {COUNTRY_CODES.LIST.map(country => (
                    <SelectItem key={country.key} value={country.code}>
                      {country.flag} {country.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id='phone'
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder={COMPANY_MESSAGES.ENTER_PHONE}
                className='flex-1 h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
              />
            </div>
            <FormErrorMessage message={errors.phone_number || ''} />
          </div>

          {/* Website */}
          <div className='space-y-2'>
            <Label
              htmlFor='website'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              {COMPANY_MESSAGES.WEBSITE_LABEL}
            </Label>
            <Input
              id='website'
              type='url'
              value={website}
              onChange={e => setWebsite(e.target.value)}
              placeholder={COMPANY_MESSAGES.ENTER_WEBSITE}
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
            <FormErrorMessage message={errors.website || ''} />
          </div>

          {/* Expiry Date */}
          <div className='space-y-2'>
            <Label className='text-[14px] font-semibold text-[var(--text-dark)]'>
              {COMPANY_MESSAGES.EXPIRY_DATE_LABEL}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full h-12 justify-start text-left font-normal border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px]',
                    !expiryDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4' />
                  {expiryDate ? (
                    format(expiryDate, 'PPP')
                  ) : (
                    <span>{COMPANY_MESSAGES.SELECT_EXPIRY_DATE}</span>
                  )}
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

          {/* City */}
          <div className='space-y-2'>
            <Label
              htmlFor='city'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              {COMPANY_MESSAGES.CITY_LABEL}
            </Label>
            <Input
              id='city'
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder={COMPANY_MESSAGES.ENTER_CITY}
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
            <FormErrorMessage message={errors.city || ''} />
          </div>

          {/* Pin Code */}
          <div className='space-y-2'>
            <Label
              htmlFor='pincode'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              {COMPANY_MESSAGES.PINCODE_LABEL}
            </Label>
            <Input
              id='pincode'
              value={pincode}
              onChange={e => setPincode(e.target.value)}
              placeholder={COMPANY_MESSAGES.ENTER_PINCODE}
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
            <FormErrorMessage message={errors.pincode || ''} />
          </div>

          {/* Preferred Communication */}
          <div className='space-y-2'>
            <Label className='text-[14px] font-semibold text-[var(--text-dark)]'>
              {COMPANY_MESSAGES.PREFERRED_COMMUNICATION_LABEL}
            </Label>
            <Select
              value={preferredCommunication}
              onValueChange={setPreferredCommunication}
            >
              <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px]'>
                <SelectValue
                  placeholder={COMPANY_MESSAGES.SELECT_PREFERRED_COMMUNICATION}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='email'>
                  {COMPANY_MESSAGES.EMAIL_OPTION}
                </SelectItem>
                <SelectItem value='phone'>
                  {COMPANY_MESSAGES.PHONE_OPTION}
                </SelectItem>
                <SelectItem value='sms'>
                  {COMPANY_MESSAGES.SMS_OPTION}
                </SelectItem>
                <SelectItem value='slack'>
                  {COMPANY_MESSAGES.SLACK_OPTION}
                </SelectItem>
                <SelectItem value='teams'>
                  {COMPANY_MESSAGES.TEAMS_OPTION}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormErrorMessage
              message={errors.preferred_communication_method || ''}
            />
          </div>
        </div>

        {/* About - Full Width */}
        <div className='space-y-2 mt-4'>
          <Label
            htmlFor='about'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
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

        {/* Communication - Full Width */}
        <div className='space-y-2 mt-4'>
          <Label
            htmlFor='communication'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
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
        </div>

        {/* Projects - Full Width */}
        <div className='space-y-2 mt-4'>
          <Label
            htmlFor='projects'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
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
        </div>
      </div>

      {/* Form Actions */}
      <div className='flex items-center justify-end gap-4 pt-6'>
        <Button
          type='button'
          variant='outline'
          onClick={handleCancel}
          disabled={loading}
          className='btn-secondary !h-12 !px-8'
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
