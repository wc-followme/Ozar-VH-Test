'use client';

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
import { useState } from 'react';
import FormErrorMessage from '../common/FormErrorMessage';

interface UserInfoFormProps {
  roles: { id: number; name: string }[];
  loadingRoles?: boolean;
}

export function UserInfoForm({ roles, loadingRoles }: UserInfoFormProps) {
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
  const [errors, setErrors] = useState<any>({});

  const validate = () => {
    const newErrors: any = {};
    if (!roleId) newErrors.roleCategory = 'Role is required.';
    if (!fullName) newErrors.fullName = 'Full name is required.';
    if (!designation) newErrors.designation = 'Designation is required.';
    if (!date) newErrors.date = 'Date of joining is required.';
    if (!email) newErrors.email = 'Email is required.';
    if (!phone) newErrors.phone = 'Phone number is required.';
    if (!communication)
      newErrors.communication = 'Preferred communication is required.';
    if (!address) newErrors.address = 'Address is required.';
    if (!city) newErrors.city = 'City is required.';
    if (!pinCode) newErrors.pinCode = 'Pin code is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Submit logic here
      alert('Form submitted!');
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
          Role
        </Label>
        <Select
          value={roleId}
          onValueChange={setRoleId}
          disabled={loadingRoles}
        >
          <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'>
            <SelectValue
              placeholder={loadingRoles ? 'Loading roles...' : 'Select role'}
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
            Full Name
          </Label>
          <Input
            id='full-name'
            placeholder='Enter Full Name'
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
            Designation
          </Label>
          <Input
            id='designation'
            placeholder='Enter Job Title'
            value={designation}
            onChange={e => setDesignation(e.target.value)}
            className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
          />
          <FormErrorMessage message={errors.designation} />
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='date-joining'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
            Date Of Joining
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'w-full h-12 px-4 pr-2 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                  'focus:border-green-500 focus:ring-green-500',
                  'justify-between font-normal',
                  !date && 'text-muted-foreground'
                )}
              >
                {date ? format(date, 'PPP') : <span>Select Date</span>}
                <Calendar1
                  size='60'
                  color='#24338C'
                  variant='Outline'
                  className='!h-8 !w-8'
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
              <CalendarComponent
                mode='single'
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormErrorMessage message={errors.date} />
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='email'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
            Email
          </Label>
          <Input
            id='email'
            type='email'
            placeholder='Enter Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
          />
          <FormErrorMessage message={errors.email} />
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='phone'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
            Phone Number
          </Label>
          <div className='flex w-full'>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger
                className={cn(
                  'h-12 w-24 rounded-l-[10px] rounded-r-none border-2 border-[var(--border-dark)]',
                  'focus:border-green-500 focus:ring-green-500',
                  'bg-[var(--white-background)]'
                )}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                <SelectItem value='us'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs'>🇺🇸</span>
                    <span>+1</span>
                  </div>
                </SelectItem>
                <SelectItem value='uk'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs'>🇬🇧</span>
                    <span>+44</span>
                  </div>
                </SelectItem>
                <SelectItem value='in'>
                  <div className='flex items-center gap-2'>
                    <span className='text-xs'>🇮🇳</span>
                    <span>+91</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              id='phone'
              placeholder='Enter Number'
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
            Preferred Method of Communication
          </Label>
          <Select value={communication} onValueChange={setCommunication}>
            <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'>
              <SelectValue
                placeholder='eg. email, phone, etc.'
                className='[&>span]:text-[var(--text-placeholder)]'
              />
            </SelectTrigger>
            <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
              <SelectItem value='email'>Email</SelectItem>
              <SelectItem value='phone'>Phone</SelectItem>
              <SelectItem value='sms'>SMS</SelectItem>
              <SelectItem value='slack'>Slack</SelectItem>
              <SelectItem value='teams'>Microsoft Teams</SelectItem>
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
          Address
        </Label>
        <Input
          id='address'
          placeholder='Enter Company Address'
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
            City
          </Label>
          <Input
            id='city'
            placeholder='Enter City'
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
            Pin Code
          </Label>
          <Input
            id='pin-code'
            placeholder='Enter Pin Code'
            value={pinCode}
            onChange={e => setPinCode(e.target.value)}
            className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
          />
          <FormErrorMessage message={errors.pinCode} />
        </div>
      </div>
      <div className='pt-4 flex items-center justify-end gap-3'>
        <Button
          type='button'
          className='h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)] flex items-center'
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          className='h-[48px] px-12 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white'
        >
          Create
        </Button>
      </div>
    </form>
  );
}
