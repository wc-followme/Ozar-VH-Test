'use client';

import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
// import CompanyManagementAddUser from '@/components/shared/CompanyManagementAddUser';
import { ImageUpload } from '@/components/shared/ImageUpload';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar1 } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const breadcrumbData: BreadcrumbItem[] = [
  { name: 'Company Management', href: '/company-management' },
  {
    name: 'Envision Construction',
    href: '/company-management/company-details',
  },
  { name: 'Add User' }, // current page
];

export default function AddCompanyUserPage() {
  const [selectedTab, setSelectedTab] = useState('info');
  const [date, setDate] = useState<Date>();
  const [country, setCountry] = useState('us');

  const router = useRouter();

  const handleCreateClick = () => {
    // Replace with your actual route
    router.push('/company-management/company-details');
  };
  const handleUploadClick = () => {
    // Implement upload logic
    console.log('Upload clicked');
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbData} className='mb-5' />
      <div className='bg-[var(--white-background)] rounded-[20px] border border-[var(--border-dark)] p-[28px]'>
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className='w-full'
        >
          <TabsList className='grid w-full max-w-[328px] grid-cols-2 bg-[var(--background)] p-1 rounded-[30px] h-auto font-normal mb-6'>
            <TabsTrigger
              value='info'
              className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
            >
              Info
            </TabsTrigger>
            <TabsTrigger
              value='settings'
              className='px-8 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value='info' className='pt-2'>
            <div className='flex items-start gap-8'>
              {/* Left Column - Upload Photo */}
              <div className='w-[250px] flex-shrink-0'>
                <ImageUpload
                  onClick={handleUploadClick}
                  label='Upload Photo'
                  className='h-[250px]'
                  //   text={''}
                />
                {/* <div className='mt-5'>
                  <Image
                    src='https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2'
                    height={250}
                    width={250}
                    alt=''
                    className='mx-auto object-cover h-[15.625rem] rounded-[0.625rem]'
                  />
                  <Button
                    variant='outline'
                    className='!text-[var(--text-dark)] px-6 h-[40px] rounded-full border-[#D0D5DD] text-[#344054] font-semibold !bg-opacity-20 hover:bg-white mt-4 w-full'
                  >
                    <span className='text-[var(--text-dark)]'>
                      Change Photo
                    </span>
                  </Button>
                </div> */}
              </div>

              {/* Right Column - Form Fields */}
              <div className='flex-1'>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-4'>
                  <div className='space-y-2 xl:col-span-3'>
                    <Label
                      htmlFor='role-category'
                      className='text-[14px] font-semibold text-[var(--text-dark)]'
                    >
                      Role Category
                    </Label>
                    <Select defaultValue='contractors'>
                      <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px]'>
                        <SelectValue placeholder='Select role category' />
                      </SelectTrigger>
                      <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                        <SelectItem value='rolecategory'>
                          Role Category
                        </SelectItem>
                        <SelectItem value='contractors'>Contractors</SelectItem>
                        <SelectItem value='employees'>Employees</SelectItem>
                        <SelectItem value='managers'>Managers</SelectItem>
                        <SelectItem value='administrators'>
                          Administrators
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                            'w-full h-12 px-4 pr-2 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px]',
                            'focus:border-green-500 focus:ring-green-500',
                            'justify-between font-normal',
                            !date && 'text-muted-foreground'
                          )}
                        >
                          {date ? (
                            format(date, 'PPP')
                          ) : (
                            <span>Select Date</span>
                          )}
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
                      <Select defaultValue={country} onValueChange={setCountry}>
                        <SelectTrigger
                          className={cn(
                            'h-12 w-24 rounded-l-[10px] rounded-r-none border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)]'
                          )}
                        >
                          {' '}
                          <SelectValue />{' '}
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
                          'h-12 flex-1 rounded-r-[10px] rounded-l-none border-2 border-l-0 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] !placeholder-[var(--text-placeholder)]'
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
                      <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px]'>
                        <SelectValue placeholder='eg. email, phone, etc.' />
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
                <div className='space-y-2 mt-4'>
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
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
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
            </div>
            {/* Action Buttons */}
            <div className='flex justify-end gap-6 mt-8'>
              <Button
                type='button'
                variant='outline'
                className='h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)]'
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                className='h-[48px] px-12 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white'
                onClick={handleCreateClick}
              >
                Create
              </Button>
            </div>
          </TabsContent>
          <TabsContent value='settings' className='pt-2 pb-8'>
            {/* <CompanyManagementAddUser /> */}
            <div className='min-h-[550px] text-center flex items-center justify-center'>
              {' '}
              Coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
