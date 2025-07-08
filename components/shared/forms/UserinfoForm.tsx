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

export function UserInfoForm() {
  const [date, setDate] = useState<Date>();

  return (
    <div className='space-y-6'>
      {/* Role Category */}
      <div className='space-y-2'>
        <Label
          htmlFor='role-category'
          className='text-[14px] font-semibold text-[var(--text-dark)]'
        >
          Role Category
        </Label>
        <Select defaultValue='contractors'>
          <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'>
            <SelectValue placeholder='Select role category' />
          </SelectTrigger>
          <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
            <SelectItem value='contractors'>Contractors</SelectItem>
            <SelectItem value='employees'>Employees</SelectItem>
            <SelectItem value='managers'>Managers</SelectItem>
            <SelectItem value='administrators'>Administrators</SelectItem>
          </SelectContent>
        </Select>
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
            className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
          />
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
            className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
          />
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
            className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
          />
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='phone'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
            Phone Number
          </Label>
          <div className='flex w-full'>
            <Select defaultValue='us'>
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
              className={cn(
                'h-12 flex-1 rounded-r-[10px] rounded-l-none border-2 border-l-0 border-[var(--border-dark)] !placeholder-[var(--text-placeholder)]',
                'focus:border-green-500 focus:ring-green-500',
                'bg-[var(--white-background)]'
              )}
            />
          </div>
        </div>
        <div className='space-y-2'>
          <Label
            htmlFor='communication'
            className='text-[14px] font-semibold text-[var(--text-dark)]'
          >
            Preferred Method of Communication
          </Label>
          <Select>
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
          className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
        />
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
            className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
          />
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
            className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
          />
        </div>
      </div>
    </div>
  );
}
