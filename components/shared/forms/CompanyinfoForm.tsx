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
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import FormErrorMessage from '../common/FormErrorMessage';

// Country codes for phone number dropdown (reusing from user module pattern)
const countryCodes = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
];

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
  const [contractorName, setContractorName] = useState('');
  const [contractorEmail, setContractorEmail] = useState('');
  const [contractorPhone, setContractorPhone] = useState('');
  const [contractorCountryCode, setContractorCountryCode] = useState('+1');
  const [errors, setErrors] = useState<CompanyFormErrors>({});

  // Set initial data for edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setName(initialData.name || '');
      setTagline(initialData.tagline || '');
      setAbout(initialData.about || '');
      setEmail(initialData.email || '');
      setPhoneNumber(initialData.phone_number || '');
      setCommunication(initialData.communication || '');
      setWebsite(initialData.website || '');
      setPreferredCommunication(
        initialData.preferred_communication_method || ''
      );
      setCity(initialData.city || '');
      setPincode(initialData.pincode || '');
      setProjects(initialData.projects || '');
      setContractorName(initialData.contractor_name || '');
      setContractorEmail(initialData.contractor_email || '');
      setContractorPhone(initialData.contractor_phone || '');
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
    if (!contractorName)
      newErrors.contractor_name = COMPANY_MESSAGES.CONTRACTOR_NAME_REQUIRED;
    if (!contractorEmail)
      newErrors.contractor_email = COMPANY_MESSAGES.CONTRACTOR_EMAIL_REQUIRED;
    if (!contractorPhone)
      newErrors.contractor_phone = COMPANY_MESSAGES.CONTRACTOR_PHONE_REQUIRED;

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
      phone_number: phoneCountryCode + phoneNumber,
      communication,
      website,
      expiry_date: (expiryDate as Date).toISOString().split('T')[0],
      preferred_communication_method: preferredCommunication,
      city,
      pincode,
      projects,
      contractor_name: contractorName,
      contractor_email: contractorEmail,
      contractor_phone: contractorCountryCode + contractorPhone,
      image: imageUrl,
    };

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
            <FormErrorMessage error={errors.name} />
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
            <FormErrorMessage error={errors.tagline} />
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
            <FormErrorMessage error={errors.email} />
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
                <SelectContent>
                  {countryCodes.map(country => (
                    <SelectItem key={country.code} value={country.code}>
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
            <FormErrorMessage error={errors.phone_number} />
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
            <FormErrorMessage error={errors.website} />
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
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormErrorMessage error={errors.expiry_date} />
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
            <FormErrorMessage error={errors.city} />
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
            <FormErrorMessage error={errors.pincode} />
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
            <FormErrorMessage error={errors.preferred_communication_method} />
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
          <FormErrorMessage error={errors.about} />
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
          <FormErrorMessage error={errors.communication} />
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
          <FormErrorMessage error={errors.projects} />
        </div>
      </div>

      {/* Contractor Information */}
      <div>
        <h2 className='text-lg font-bold mb-4'>Contractor Information</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Contractor Name */}
          <div className='space-y-2'>
            <Label
              htmlFor='contractor-name'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              {COMPANY_MESSAGES.CONTRACTOR_NAME_LABEL}
            </Label>
            <Input
              id='contractor-name'
              value={contractorName}
              onChange={e => setContractorName(e.target.value)}
              placeholder={COMPANY_MESSAGES.ENTER_CONTRACTOR_NAME}
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
            <FormErrorMessage error={errors.contractor_name} />
          </div>

          {/* Contractor Email */}
          <div className='space-y-2'>
            <Label
              htmlFor='contractor-email'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              {COMPANY_MESSAGES.CONTRACTOR_EMAIL_LABEL}
            </Label>
            <Input
              id='contractor-email'
              type='email'
              value={contractorEmail}
              onChange={e => setContractorEmail(e.target.value)}
              placeholder={COMPANY_MESSAGES.ENTER_CONTRACTOR_EMAIL}
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
            <FormErrorMessage error={errors.contractor_email} />
          </div>

          {/* Contractor Phone */}
          <div className='space-y-2'>
            <Label
              htmlFor='contractor-phone'
              className='text-[14px] font-semibold text-[var(--text-dark)]'
            >
              {COMPANY_MESSAGES.CONTRACTOR_PHONE_LABEL}
            </Label>
            <div className='flex gap-2'>
              <Select
                value={contractorCountryCode}
                onValueChange={setContractorCountryCode}
              >
                <SelectTrigger className='w-[120px] h-12 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id='contractor-phone'
                value={contractorPhone}
                onChange={e => setContractorPhone(e.target.value)}
                placeholder={COMPANY_MESSAGES.ENTER_CONTRACTOR_PHONE}
                className='flex-1 h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
              />
            </div>
            <FormErrorMessage error={errors.contractor_phone} />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className='flex items-center gap-4 pt-6'>
        <Button
          type='submit'
          disabled={loading}
          className='px-8 py-3 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] text-white rounded-[10px] font-semibold'
        >
          {loading
            ? 'Creating...'
            : isEditMode
              ? COMPANY_MESSAGES.UPDATE_BUTTON
              : COMPANY_MESSAGES.CREATE_BUTTON}
        </Button>
        <Button
          type='button'
          variant='outline'
          onClick={handleCancel}
          disabled={loading}
          className='px-8 py-3 border-2 border-[var(--border-dark)] bg-[var(--white-background)] text-[var(--text-dark)] rounded-[10px] font-semibold hover:bg-gray-50'
        >
          {COMPANY_MESSAGES.CANCEL_BUTTON}
        </Button>
      </div>
    </form>
  );
}
