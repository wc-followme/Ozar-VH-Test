'use client';

import { USER_MESSAGES } from '@/app/(DashboardLayout)/user-management/user-messages';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
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
import { CreateUserRequest } from '@/lib/api';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar1 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import FormErrorMessage from '../common/FormErrorMessage';

interface UserInfoFormProps {
  roles: { id: number; name: string }[];
  loadingRoles?: boolean;
  imageUrl?: string;
  onSubmit: (
    data: Omit<CreateUserRequest, 'profile_picture_url'> & {
      profile_picture_url?: string;
    }
  ) => void;
  loading?: boolean;
  error?: string | undefined;
  initialData?: any; // User data for edit mode
  isEditMode?: boolean;
}

export function UserInfoForm({
  roles,
  loadingRoles,
  imageUrl,
  onSubmit,
  loading,
  error,
  initialData,
  isEditMode,
}: UserInfoFormProps) {
  const [date, setDate] = useState<Date>();
  const [roleId, setRoleId] = useState('');
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('us');
  const [communication, setCommunication] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  // Prefill form with initial data in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      setRoleId(String(initialData.role_id || ''));
      setFullName(initialData.name || '');
      setDesignation(initialData.designation || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone_number || '');
      setCommunication(initialData.preferred_communication_method || '');
      setAddress(initialData.address || '');
      setCity(initialData.city || '');
      setPinCode(initialData.pincode || '');
      if (initialData.date_of_joining) {
        setDate(new Date(initialData.date_of_joining));
      }
    }
  }, [isEditMode, initialData]);

  const validate = () => {
    const newErrors: any = {};
    if (!roleId) newErrors.roleCategory = USER_MESSAGES.ROLE_REQUIRED;
    if (!fullName) newErrors.fullName = USER_MESSAGES.FULL_NAME_REQUIRED;
    if (!designation)
      newErrors.designation = USER_MESSAGES.DESIGNATION_REQUIRED;
    if (!date) newErrors.date = USER_MESSAGES.DATE_REQUIRED;
    if (!email) newErrors.email = USER_MESSAGES.EMAIL_REQUIRED;
    if (!phone) newErrors.phone = USER_MESSAGES.PHONE_REQUIRED;
    // Password is only required for create mode
    if (!isEditMode && !password)
      newErrors.password = USER_MESSAGES.PASSWORD_REQUIRED;
    if (!communication)
      newErrors.communication = USER_MESSAGES.COMMUNICATION_REQUIRED;
    if (!address) newErrors.address = USER_MESSAGES.ADDRESS_REQUIRED;
    if (!city) newErrors.city = USER_MESSAGES.CITY_REQUIRED;
    if (!pinCode) newErrors.pinCode = USER_MESSAGES.PIN_CODE_REQUIRED;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const payload: any = {
        role_id: Number(roleId),
        name: fullName,
        email,
        phone_number: phone,
        profile_picture_url: imageUrl,
        date_of_joining: date ? date.toISOString().split('T')[0] : '',
        designation,
        preferred_communication_method: communication,
        address,
        city,
        pincode: pinCode,
      };

      // Only include password if provided (for edit mode) or always (for create mode)
      if (!isEditMode || password) {
        payload.password = password || 'password123'; // Default for create mode
      }

      onSubmit(payload);
    }
  };

  const handleCancel = () => {
    // TODO: Implement cancel logic, e.g., close modal or reset form
    // For now, just reset all fields
    setRoleId('');
    setFullName('');
    setDesignation('');
    setDate(undefined);
    setEmail('');
    setPhone('');
    setCountry('us');
    setCommunication('');
    setAddress('');
    setCity('');
    setPinCode('');
    setPassword('');
    setErrors({});
  };

  return (
    <form className='space-y-6' onSubmit={handleSubmit} noValidate>
      {/* Role Dropdown */}
      <div className='space-y-2'>
        <Label
          htmlFor='role'
          className='text-[14px] font-semibold text-[var(--text-dark)]'
        >
          {USER_MESSAGES.ROLE_LABEL}
        </Label>
        <Select
          value={roleId}
          onValueChange={setRoleId}
          disabled={loadingRoles}
        >
          <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'>
            <SelectValue
              placeholder={
                loadingRoles
                  ? USER_MESSAGES.LOADING_ROLES
                  : USER_MESSAGES.SELECT_ROLE
              }
            />
          </SelectTrigger>
          <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
            {roles.map(role => (
              <SelectItem key={role.id} value={String(role.id)}>
                {role.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormErrorMessage message={errors.roleCategory} />
      </div>
      {/* First Row - Full Name, Designation, Date of Joining */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        <div className='space-y-2'>
          <Label
            htmlFor='full-name'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
            {USER_MESSAGES.FULL_NAME_LABEL}
          </Label>
          <Input
            id='full-name'
            placeholder={USER_MESSAGES.ENTER_FULL_NAME}
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
          />
          <FormErrorMessage message={errors.fullName} />
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='designation'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
            {USER_MESSAGES.DESIGNATION_LABEL}
          </Label>
          <Input
            id='designation'
            placeholder={USER_MESSAGES.ENTER_JOB_TITLE}
            value={designation}
            onChange={e => setDesignation(e.target.value)}
            className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
          />
          <FormErrorMessage message={errors.designation} />
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='date'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
            {USER_MESSAGES.DATE_OF_JOINING_LABEL}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'h-12 w-full pl-3 text-left font-normal border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                  !date && 'text-muted-foreground'
                )}
              >
                {date ? (
                  format(date, 'PPP')
                ) : (
                  <span>{USER_MESSAGES.SELECT_DATE}</span>
                )}
                <Calendar1 className='ml-auto h-4 w-4 opacity-50' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <CalendarComponent
                mode='single'
                selected={date}
                onSelect={setDate}
                disabled={(date: Date) =>
                  date > new Date() || date < new Date('1900-01-01')
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormErrorMessage message={errors.date} />
        </div>
      </div>
      {/* Second Row - Email, Password, Phone, Communication */}
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        <div className='space-y-2'>
          <Label
            htmlFor='email'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
            {USER_MESSAGES.EMAIL_LABEL}
          </Label>
          <Input
            id='email'
            type='email'
            placeholder={USER_MESSAGES.ENTER_EMAIL}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
          />
          <FormErrorMessage message={errors.email} />
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='password'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
            {USER_MESSAGES.PASSWORD_LABEL}{' '}
            {isEditMode && (
              <span className='text-sm text-gray-500'>
                {USER_MESSAGES.PASSWORD_OPTIONAL_HINT}
              </span>
            )}
          </Label>
          <Input
            id='password'
            type='password'
            placeholder={
              isEditMode
                ? USER_MESSAGES.ENTER_PASSWORD_OPTIONAL
                : USER_MESSAGES.ENTER_PASSWORD
            }
            value={password}
            onChange={e => setPassword(e.target.value)}
            className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
          />
          <FormErrorMessage message={errors.password} />
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='phone'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
            {USER_MESSAGES.PHONE_LABEL}
          </Label>
          <div className='flex'>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger
                className={cn(
                  'w-24 h-12 rounded-l-[10px] rounded-r-none border-2 border-r-0 border-[var(--border-dark)]',
                  'focus:border-green-500 focus:ring-green-500',
                  'bg-[var(--white-background)]'
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                <SelectItem value='us'>
                  <div className='flex items-center gap-2'>
                    <span>🇺🇸</span>
                    <span>+1</span>
                  </div>
                </SelectItem>
                <SelectItem value='uk'>
                  <div className='flex items-center gap-2'>
                    <span>🇬🇧</span>
                    <span>+44</span>
                  </div>
                </SelectItem>
                <SelectItem value='in'>
                  <div className='flex items-center gap-2'>
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              id='phone'
              placeholder={USER_MESSAGES.ENTER_NUMBER}
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className={cn(
                'h-12 flex-1 rounded-r-[10px] rounded-l-none border-2 border-l-0 border-[var(--border-dark)] !placeholder-[var(--text-placeholder)]',
                'focus:border-green-500 focus:ring-green-500',
                'bg-[var(--white-background)]'
              )}
            />
          </div>
          <FormErrorMessage message={errors.phone} />
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='communication'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
            {USER_MESSAGES.COMMUNICATION_LABEL}
          </Label>
          <Select value={communication} onValueChange={setCommunication}>
            <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'>
              <SelectValue
                placeholder={USER_MESSAGES.SELECT_COMMUNICATION}
                className='[&>span]:text-[var(--text-placeholder)]'
              />
            </SelectTrigger>
            <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
              <SelectItem value='email'>
                {USER_MESSAGES.EMAIL_OPTION}
              </SelectItem>
              <SelectItem value='phone'>
                {USER_MESSAGES.PHONE_OPTION}
              </SelectItem>
              <SelectItem value='sms'>{USER_MESSAGES.SMS_OPTION}</SelectItem>
              <SelectItem value='slack'>
                {USER_MESSAGES.SLACK_OPTION}
              </SelectItem>
              <SelectItem value='teams'>
                {USER_MESSAGES.TEAMS_OPTION}
              </SelectItem>
            </SelectContent>
          </Select>
          <FormErrorMessage message={errors.communication} />
        </div>
      </div>
      {/* Third Row - Address */}
      <div className='space-y-2'>
        <Label
          htmlFor='address'
          className='text-[14px] font-semibold text-[var(--text-dark)]'
        >
          {USER_MESSAGES.ADDRESS_LABEL}
        </Label>
        <Input
          id='address'
          placeholder={USER_MESSAGES.ENTER_ADDRESS}
          value={address}
          onChange={e => setAddress(e.target.value)}
          className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
        />
        <FormErrorMessage message={errors.address} />
      </div>
      {/* Fourth Row - City, Pin Code */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label
            htmlFor='city'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
            {USER_MESSAGES.CITY_LABEL}
          </Label>
          <Input
            id='city'
            placeholder={USER_MESSAGES.ENTER_CITY}
            value={city}
            onChange={e => setCity(e.target.value)}
            className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
          />
          <FormErrorMessage message={errors.city} />
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='pin-code'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
            {USER_MESSAGES.PIN_CODE_LABEL}
          </Label>
          <Input
            id='pin-code'
            placeholder={USER_MESSAGES.ENTER_PIN_CODE}
            value={pinCode}
            onChange={e => setPinCode(e.target.value)}
            className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
          />
          <FormErrorMessage message={errors.pinCode} />
        </div>
      </div>
      {error && <FormErrorMessage message={error} />}
      <div className='pt-4 flex items-center justify-end gap-3'>
        <Button
          type='button'
          className='h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)] flex items-center'
          onClick={handleCancel}
        >
          {USER_MESSAGES.CANCEL_BUTTON}
        </Button>
        <Button
          type='submit'
          className='h-[48px] px-12 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white'
        >
          {isEditMode
            ? USER_MESSAGES.UPDATE_BUTTON
            : USER_MESSAGES.CREATE_BUTTON}
        </Button>
      </div>
    </form>
  );
}
