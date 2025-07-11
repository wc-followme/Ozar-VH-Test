'use client';

import {
  FormErrors,
  Role,
  UserFormData,
  UserInitialData,
} from '@/app/(DashboardLayout)/user-management/types';
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
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar1 } from 'iconsax-react';
import { useEffect, useState } from 'react';
import FormErrorMessage from '../common/FormErrorMessage';

interface UserInfoFormProps {
  roles: Role[];
  loadingRoles?: boolean;
  imageUrl?: string;
  onSubmit: (data: UserFormData) => void;
  loading?: boolean;
  initialData?: UserInitialData;
  isEditMode?: boolean;
}

export function UserInfoForm({
  roles,
  loadingRoles,
  imageUrl,
  onSubmit,
  loading,
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
  const [errors, setErrors] = useState<FormErrors>({});

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

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate()) {
      const payload: UserFormData = {
        role_id: Number(roleId),
        name: fullName,
        email,
        phone_number: phone,
        designation,
        preferred_communication_method: communication,
        address,
        city,
        pincode: pinCode,
      };

      // Add profile picture URL only if provided
      if (imageUrl) {
        payload.profile_picture_url = imageUrl;
      }

      // Add date only if it's provided
      if (date) {
        payload.date_of_joining = date.toISOString().split('T')[0];
      }

      // Add password only if provided or required (for create mode)
      if (!isEditMode || password) {
        payload.password = password || 'password123';
      }

      onSubmit(payload);
    }
  };

  const handleCancel = (): void => {
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
          disabled={loadingRoles || false}
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
        <FormErrorMessage message={errors.roleCategory || ''} />
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
          <FormErrorMessage message={errors.fullName || ''} />
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
          <FormErrorMessage message={errors.designation || ''} />
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
          <FormErrorMessage message={errors.date || ''} />
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
          <FormErrorMessage message={errors.email || ''} />
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
          <FormErrorMessage message={errors.password || ''} />
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
              <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px] max-h-60 overflow-y-auto'>
                <SelectItem value='us'>
                  <div className='flex items-center gap-2'>
                    <span>🇺🇸</span>
                    <span>+1</span>
                  </div>
                </SelectItem>
                <SelectItem value='ca'>
                  <div className='flex items-center gap-2'>
                    <span>🇨🇦</span>
                    <span>+1</span>
                  </div>
                </SelectItem>
                <SelectItem value='gb'>
                  <div className='flex items-center gap-2'>
                    <span>🇬🇧</span>
                    <span>+44</span>
                  </div>
                </SelectItem>
                <SelectItem value='au'>
                  <div className='flex items-center gap-2'>
                    <span>🇦🇺</span>
                    <span>+61</span>
                  </div>
                </SelectItem>
                <SelectItem value='de'>
                  <div className='flex items-center gap-2'>
                    <span>🇩🇪</span>
                    <span>+49</span>
                  </div>
                </SelectItem>
                <SelectItem value='fr'>
                  <div className='flex items-center gap-2'>
                    <span>🇫🇷</span>
                    <span>+33</span>
                  </div>
                </SelectItem>
                <SelectItem value='it'>
                  <div className='flex items-center gap-2'>
                    <span>🇮🇹</span>
                    <span>+39</span>
                  </div>
                </SelectItem>
                <SelectItem value='es'>
                  <div className='flex items-center gap-2'>
                    <span>🇪🇸</span>
                    <span>+34</span>
                  </div>
                </SelectItem>
                <SelectItem value='nl'>
                  <div className='flex items-center gap-2'>
                    <span>🇳🇱</span>
                    <span>+31</span>
                  </div>
                </SelectItem>
                <SelectItem value='ch'>
                  <div className='flex items-center gap-2'>
                    <span>🇨🇭</span>
                    <span>+41</span>
                  </div>
                </SelectItem>
                <SelectItem value='se'>
                  <div className='flex items-center gap-2'>
                    <span>🇸🇪</span>
                    <span>+46</span>
                  </div>
                </SelectItem>
                <SelectItem value='no'>
                  <div className='flex items-center gap-2'>
                    <span>🇳🇴</span>
                    <span>+47</span>
                  </div>
                </SelectItem>
                <SelectItem value='dk'>
                  <div className='flex items-center gap-2'>
                    <span>🇩🇰</span>
                    <span>+45</span>
                  </div>
                </SelectItem>
                <SelectItem value='fi'>
                  <div className='flex items-center gap-2'>
                    <span>🇫🇮</span>
                    <span>+358</span>
                  </div>
                </SelectItem>
                <SelectItem value='at'>
                  <div className='flex items-center gap-2'>
                    <span>🇦🇹</span>
                    <span>+43</span>
                  </div>
                </SelectItem>
                <SelectItem value='be'>
                  <div className='flex items-center gap-2'>
                    <span>🇧🇪</span>
                    <span>+32</span>
                  </div>
                </SelectItem>
                <SelectItem value='ie'>
                  <div className='flex items-center gap-2'>
                    <span>🇮🇪</span>
                    <span>+353</span>
                  </div>
                </SelectItem>
                <SelectItem value='pt'>
                  <div className='flex items-center gap-2'>
                    <span>🇵🇹</span>
                    <span>+351</span>
                  </div>
                </SelectItem>
                <SelectItem value='gr'>
                  <div className='flex items-center gap-2'>
                    <span>🇬🇷</span>
                    <span>+30</span>
                  </div>
                </SelectItem>
                <SelectItem value='pl'>
                  <div className='flex items-center gap-2'>
                    <span>🇵🇱</span>
                    <span>+48</span>
                  </div>
                </SelectItem>
                <SelectItem value='cz'>
                  <div className='flex items-center gap-2'>
                    <span>🇨🇿</span>
                    <span>+420</span>
                  </div>
                </SelectItem>
                <SelectItem value='hu'>
                  <div className='flex items-center gap-2'>
                    <span>🇭🇺</span>
                    <span>+36</span>
                  </div>
                </SelectItem>
                <SelectItem value='ro'>
                  <div className='flex items-center gap-2'>
                    <span>🇷🇴</span>
                    <span>+40</span>
                  </div>
                </SelectItem>
                <SelectItem value='bg'>
                  <div className='flex items-center gap-2'>
                    <span>🇧🇬</span>
                    <span>+359</span>
                  </div>
                </SelectItem>
                <SelectItem value='hr'>
                  <div className='flex items-center gap-2'>
                    <span>🇭🇷</span>
                    <span>+385</span>
                  </div>
                </SelectItem>
                <SelectItem value='si'>
                  <div className='flex items-center gap-2'>
                    <span>🇸🇮</span>
                    <span>+386</span>
                  </div>
                </SelectItem>
                <SelectItem value='sk'>
                  <div className='flex items-center gap-2'>
                    <span>🇸🇰</span>
                    <span>+421</span>
                  </div>
                </SelectItem>
                <SelectItem value='lt'>
                  <div className='flex items-center gap-2'>
                    <span>🇱🇹</span>
                    <span>+370</span>
                  </div>
                </SelectItem>
                <SelectItem value='lv'>
                  <div className='flex items-center gap-2'>
                    <span>🇱🇻</span>
                    <span>+371</span>
                  </div>
                </SelectItem>
                <SelectItem value='ee'>
                  <div className='flex items-center gap-2'>
                    <span>🇪🇪</span>
                    <span>+372</span>
                  </div>
                </SelectItem>
                <SelectItem value='ru'>
                  <div className='flex items-center gap-2'>
                    <span>🇷🇺</span>
                    <span>+7</span>
                  </div>
                </SelectItem>
                <SelectItem value='ua'>
                  <div className='flex items-center gap-2'>
                    <span>🇺🇦</span>
                    <span>+380</span>
                  </div>
                </SelectItem>
                <SelectItem value='by'>
                  <div className='flex items-center gap-2'>
                    <span>🇧🇾</span>
                    <span>+375</span>
                  </div>
                </SelectItem>
                <SelectItem value='md'>
                  <div className='flex items-center gap-2'>
                    <span>🇲🇩</span>
                    <span>+373</span>
                  </div>
                </SelectItem>
                <SelectItem value='in'>
                  <div className='flex items-center gap-2'>
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </div>
                </SelectItem>
                <SelectItem value='cn'>
                  <div className='flex items-center gap-2'>
                    <span>🇨🇳</span>
                    <span>+86</span>
                  </div>
                </SelectItem>
                <SelectItem value='jp'>
                  <div className='flex items-center gap-2'>
                    <span>🇯🇵</span>
                    <span>+81</span>
                  </div>
                </SelectItem>
                <SelectItem value='kr'>
                  <div className='flex items-center gap-2'>
                    <span>🇰🇷</span>
                    <span>+82</span>
                  </div>
                </SelectItem>
                <SelectItem value='sg'>
                  <div className='flex items-center gap-2'>
                    <span>🇸🇬</span>
                    <span>+65</span>
                  </div>
                </SelectItem>
                <SelectItem value='my'>
                  <div className='flex items-center gap-2'>
                    <span>🇲🇾</span>
                    <span>+60</span>
                  </div>
                </SelectItem>
                <SelectItem value='th'>
                  <div className='flex items-center gap-2'>
                    <span>🇹🇭</span>
                    <span>+66</span>
                  </div>
                </SelectItem>
                <SelectItem value='vn'>
                  <div className='flex items-center gap-2'>
                    <span>🇻🇳</span>
                    <span>+84</span>
                  </div>
                </SelectItem>
                <SelectItem value='ph'>
                  <div className='flex items-center gap-2'>
                    <span>🇵🇭</span>
                    <span>+63</span>
                  </div>
                </SelectItem>
                <SelectItem value='id'>
                  <div className='flex items-center gap-2'>
                    <span>🇮🇩</span>
                    <span>+62</span>
                  </div>
                </SelectItem>
                <SelectItem value='hk'>
                  <div className='flex items-center gap-2'>
                    <span>🇭🇰</span>
                    <span>+852</span>
                  </div>
                </SelectItem>
                <SelectItem value='tw'>
                  <div className='flex items-center gap-2'>
                    <span>🇹🇼</span>
                    <span>+886</span>
                  </div>
                </SelectItem>
                <SelectItem value='mo'>
                  <div className='flex items-center gap-2'>
                    <span>🇲🇴</span>
                    <span>+853</span>
                  </div>
                </SelectItem>
                <SelectItem value='bd'>
                  <div className='flex items-center gap-2'>
                    <span>🇧🇩</span>
                    <span>+880</span>
                  </div>
                </SelectItem>
                <SelectItem value='pk'>
                  <div className='flex items-center gap-2'>
                    <span>🇵🇰</span>
                    <span>+92</span>
                  </div>
                </SelectItem>
                <SelectItem value='lk'>
                  <div className='flex items-center gap-2'>
                    <span>🇱🇰</span>
                    <span>+94</span>
                  </div>
                </SelectItem>
                <SelectItem value='mm'>
                  <div className='flex items-center gap-2'>
                    <span>🇲🇲</span>
                    <span>+95</span>
                  </div>
                </SelectItem>
                <SelectItem value='kh'>
                  <div className='flex items-center gap-2'>
                    <span>🇰🇭</span>
                    <span>+855</span>
                  </div>
                </SelectItem>
                <SelectItem value='la'>
                  <div className='flex items-center gap-2'>
                    <span>🇱🇦</span>
                    <span>+856</span>
                  </div>
                </SelectItem>
                <SelectItem value='np'>
                  <div className='flex items-center gap-2'>
                    <span>🇳🇵</span>
                    <span>+977</span>
                  </div>
                </SelectItem>
                <SelectItem value='bt'>
                  <div className='flex items-center gap-2'>
                    <span>🇧🇹</span>
                    <span>+975</span>
                  </div>
                </SelectItem>
                <SelectItem value='mv'>
                  <div className='flex items-center gap-2'>
                    <span>🇲🇻</span>
                    <span>+960</span>
                  </div>
                </SelectItem>
                <SelectItem value='br'>
                  <div className='flex items-center gap-2'>
                    <span>🇧🇷</span>
                    <span>+55</span>
                  </div>
                </SelectItem>
                <SelectItem value='ar'>
                  <div className='flex items-center gap-2'>
                    <span>🇦🇷</span>
                    <span>+54</span>
                  </div>
                </SelectItem>
                <SelectItem value='mx'>
                  <div className='flex items-center gap-2'>
                    <span>🇲🇽</span>
                    <span>+52</span>
                  </div>
                </SelectItem>
                <SelectItem value='cl'>
                  <div className='flex items-center gap-2'>
                    <span>🇨🇱</span>
                    <span>+56</span>
                  </div>
                </SelectItem>
                <SelectItem value='co'>
                  <div className='flex items-center gap-2'>
                    <span>🇨🇴</span>
                    <span>+57</span>
                  </div>
                </SelectItem>
                <SelectItem value='pe'>
                  <div className='flex items-center gap-2'>
                    <span>🇵🇪</span>
                    <span>+51</span>
                  </div>
                </SelectItem>
                <SelectItem value='ve'>
                  <div className='flex items-center gap-2'>
                    <span>🇻🇪</span>
                    <span>+58</span>
                  </div>
                </SelectItem>
                <SelectItem value='ec'>
                  <div className='flex items-center gap-2'>
                    <span>🇪🇨</span>
                    <span>+593</span>
                  </div>
                </SelectItem>
                <SelectItem value='uy'>
                  <div className='flex items-center gap-2'>
                    <span>🇺🇾</span>
                    <span>+598</span>
                  </div>
                </SelectItem>
                <SelectItem value='py'>
                  <div className='flex items-center gap-2'>
                    <span>🇵🇾</span>
                    <span>+595</span>
                  </div>
                </SelectItem>
                <SelectItem value='bo'>
                  <div className='flex items-center gap-2'>
                    <span>🇧🇴</span>
                    <span>+591</span>
                  </div>
                </SelectItem>
                <SelectItem value='gf'>
                  <div className='flex items-center gap-2'>
                    <span>🇬🇫</span>
                    <span>+594</span>
                  </div>
                </SelectItem>
                <SelectItem value='sr'>
                  <div className='flex items-center gap-2'>
                    <span>🇸🇷</span>
                    <span>+597</span>
                  </div>
                </SelectItem>
                <SelectItem value='gy'>
                  <div className='flex items-center gap-2'>
                    <span>🇬🇾</span>
                    <span>+592</span>
                  </div>
                </SelectItem>
                <SelectItem value='eg'>
                  <div className='flex items-center gap-2'>
                    <span>🇪🇬</span>
                    <span>+20</span>
                  </div>
                </SelectItem>
                <SelectItem value='za'>
                  <div className='flex items-center gap-2'>
                    <span>🇿🇦</span>
                    <span>+27</span>
                  </div>
                </SelectItem>
                <SelectItem value='ng'>
                  <div className='flex items-center gap-2'>
                    <span>🇳🇬</span>
                    <span>+234</span>
                  </div>
                </SelectItem>
                <SelectItem value='ke'>
                  <div className='flex items-center gap-2'>
                    <span>🇰🇪</span>
                    <span>+254</span>
                  </div>
                </SelectItem>
                <SelectItem value='gh'>
                  <div className='flex items-center gap-2'>
                    <span>🇬🇭</span>
                    <span>+233</span>
                  </div>
                </SelectItem>
                <SelectItem value='tz'>
                  <div className='flex items-center gap-2'>
                    <span>🇹🇿</span>
                    <span>+255</span>
                  </div>
                </SelectItem>
                <SelectItem value='ug'>
                  <div className='flex items-center gap-2'>
                    <span>🇺🇬</span>
                    <span>+256</span>
                  </div>
                </SelectItem>
                <SelectItem value='mz'>
                  <div className='flex items-center gap-2'>
                    <span>🇲🇿</span>
                    <span>+258</span>
                  </div>
                </SelectItem>
                <SelectItem value='mg'>
                  <div className='flex items-center gap-2'>
                    <span>🇲🇬</span>
                    <span>+261</span>
                  </div>
                </SelectItem>
                <SelectItem value='zw'>
                  <div className='flex items-center gap-2'>
                    <span>🇿🇼</span>
                    <span>+263</span>
                  </div>
                </SelectItem>
                <SelectItem value='zm'>
                  <div className='flex items-center gap-2'>
                    <span>🇿🇲</span>
                    <span>+260</span>
                  </div>
                </SelectItem>
                <SelectItem value='mw'>
                  <div className='flex items-center gap-2'>
                    <span>🇲🇼</span>
                    <span>+265</span>
                  </div>
                </SelectItem>
                <SelectItem value='bw'>
                  <div className='flex items-center gap-2'>
                    <span>🇧🇼</span>
                    <span>+267</span>
                  </div>
                </SelectItem>
                <SelectItem value='sz'>
                  <div className='flex items-center gap-2'>
                    <span>🇸🇿</span>
                    <span>+268</span>
                  </div>
                </SelectItem>
                <SelectItem value='ls'>
                  <div className='flex items-center gap-2'>
                    <span>🇱🇸</span>
                    <span>+266</span>
                  </div>
                </SelectItem>
                <SelectItem value='ma'>
                  <div className='flex items-center gap-2'>
                    <span>🇲🇦</span>
                    <span>+212</span>
                  </div>
                </SelectItem>
                <SelectItem value='dz'>
                  <div className='flex items-center gap-2'>
                    <span>🇩🇿</span>
                    <span>+213</span>
                  </div>
                </SelectItem>
                <SelectItem value='tn'>
                  <div className='flex items-center gap-2'>
                    <span>🇹🇳</span>
                    <span>+216</span>
                  </div>
                </SelectItem>
                <SelectItem value='ly'>
                  <div className='flex items-center gap-2'>
                    <span>🇱🇾</span>
                    <span>+218</span>
                  </div>
                </SelectItem>
                <SelectItem value='sd'>
                  <div className='flex items-center gap-2'>
                    <span>🇸🇩</span>
                    <span>+249</span>
                  </div>
                </SelectItem>
                <SelectItem value='et'>
                  <div className='flex items-center gap-2'>
                    <span>🇪🇹</span>
                    <span>+251</span>
                  </div>
                </SelectItem>
                <SelectItem value='so'>
                  <div className='flex items-center gap-2'>
                    <span>🇸🇴</span>
                    <span>+252</span>
                  </div>
                </SelectItem>
                <SelectItem value='dj'>
                  <div className='flex items-center gap-2'>
                    <span>🇩🇯</span>
                    <span>+253</span>
                  </div>
                </SelectItem>
                <SelectItem value='ae'>
                  <div className='flex items-center gap-2'>
                    <span>🇦🇪</span>
                    <span>+971</span>
                  </div>
                </SelectItem>
                <SelectItem value='sa'>
                  <div className='flex items-center gap-2'>
                    <span>🇸🇦</span>
                    <span>+966</span>
                  </div>
                </SelectItem>
                <SelectItem value='qa'>
                  <div className='flex items-center gap-2'>
                    <span>🇶🇦</span>
                    <span>+974</span>
                  </div>
                </SelectItem>
                <SelectItem value='kw'>
                  <div className='flex items-center gap-2'>
                    <span>🇰🇼</span>
                    <span>+965</span>
                  </div>
                </SelectItem>
                <SelectItem value='bh'>
                  <div className='flex items-center gap-2'>
                    <span>🇧🇭</span>
                    <span>+973</span>
                  </div>
                </SelectItem>
                <SelectItem value='om'>
                  <div className='flex items-center gap-2'>
                    <span>🇴🇲</span>
                    <span>+968</span>
                  </div>
                </SelectItem>
                <SelectItem value='jo'>
                  <div className='flex items-center gap-2'>
                    <span>🇯🇴</span>
                    <span>+962</span>
                  </div>
                </SelectItem>
                <SelectItem value='lb'>
                  <div className='flex items-center gap-2'>
                    <span>🇱🇧</span>
                    <span>+961</span>
                  </div>
                </SelectItem>
                <SelectItem value='sy'>
                  <div className='flex items-center gap-2'>
                    <span>🇸🇾</span>
                    <span>+963</span>
                  </div>
                </SelectItem>
                <SelectItem value='iq'>
                  <div className='flex items-center gap-2'>
                    <span>🇮🇶</span>
                    <span>+964</span>
                  </div>
                </SelectItem>
                <SelectItem value='ir'>
                  <div className='flex items-center gap-2'>
                    <span>🇮🇷</span>
                    <span>+98</span>
                  </div>
                </SelectItem>
                <SelectItem value='il'>
                  <div className='flex items-center gap-2'>
                    <span>🇮🇱</span>
                    <span>+972</span>
                  </div>
                </SelectItem>
                <SelectItem value='ps'>
                  <div className='flex items-center gap-2'>
                    <span>🇵🇸</span>
                    <span>+970</span>
                  </div>
                </SelectItem>
                <SelectItem value='tr'>
                  <div className='flex items-center gap-2'>
                    <span>🇹🇷</span>
                    <span>+90</span>
                  </div>
                </SelectItem>
                <SelectItem value='cy'>
                  <div className='flex items-center gap-2'>
                    <span>🇨🇾</span>
                    <span>+357</span>
                  </div>
                </SelectItem>
                <SelectItem value='af'>
                  <div className='flex items-center gap-2'>
                    <span>🇦🇫</span>
                    <span>+93</span>
                  </div>
                </SelectItem>
                <SelectItem value='kz'>
                  <div className='flex items-center gap-2'>
                    <span>🇰🇿</span>
                    <span>+7</span>
                  </div>
                </SelectItem>
                <SelectItem value='uz'>
                  <div className='flex items-center gap-2'>
                    <span>🇺🇿</span>
                    <span>+998</span>
                  </div>
                </SelectItem>
                <SelectItem value='tm'>
                  <div className='flex items-center gap-2'>
                    <span>🇹🇲</span>
                    <span>+993</span>
                  </div>
                </SelectItem>
                <SelectItem value='tj'>
                  <div className='flex items-center gap-2'>
                    <span>🇹🇯</span>
                    <span>+992</span>
                  </div>
                </SelectItem>
                <SelectItem value='kg'>
                  <div className='flex items-center gap-2'>
                    <span>🇰🇬</span>
                    <span>+996</span>
                  </div>
                </SelectItem>
                <SelectItem value='mn'>
                  <div className='flex items-center gap-2'>
                    <span>🇲🇳</span>
                    <span>+976</span>
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
          <FormErrorMessage message={errors.phone || ''} />
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
          <FormErrorMessage message={errors.communication || ''} />
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
        <FormErrorMessage message={errors.address || ''} />
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
          <FormErrorMessage message={errors.city || ''} />
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
          <FormErrorMessage message={errors.pinCode || ''} />
        </div>
      </div>
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
          disabled={loading}
        >
          {isEditMode
            ? USER_MESSAGES.UPDATE_BUTTON
            : USER_MESSAGES.CREATE_BUTTON}
        </Button>
      </div>
    </form>
  );
}
