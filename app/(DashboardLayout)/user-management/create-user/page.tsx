'use client';

import { UserInfoForm } from '@/components/shared/forms/UserinfoForm';
import { PhotoUpload } from '@/components/shared/PhotoUpload';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function AddUserPage() {
  const [selectedTab, setSelectedTab] = useState('info');

  return (
    <div className=''>
      <div className=''>
        {/* Breadcrumb */}
        <div className='flex items-center text-sm text-gray-500 mb-6 mt-2'>
          <span className='text-[var(--text-dark)] text-[14px] font-normal'>
            User Management
          </span>
          <ChevronRight className='h-4 w-4 mx-2' />
          <span className='text-[var(--text-dark)] text-[14px] font-normal text-[var(--primary)]'>
            Add User
          </span>
        </div>

        {/* Main Content */}
        <div className='bg-[var(--white-background)] rounded-[20px] border border-[var(--border-dark)] p-[28px]'>
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className='w-full'
          >
            <TabsList className='grid w-full max-w-[328px] grid-cols-2 bg-[var(--background)] p-1 rounded-[30px] h-auto font-normal'>
              <TabsTrigger
                value='info'
                className='rounded-md px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Info
              </TabsTrigger>
              <TabsTrigger
                value='permissions'
                className='rounded-md px-8 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Permissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value='info' className='pt-8'>
              <div className='flex items-start gap-6'>
                {/* Left Column - Upload Photo */}
                <div className='w-[250px] flex-shrink-0'>
                  <PhotoUpload />
                </div>

                {/* Right Column - Form Fields */}
                <div className='flex-1'>
                  <UserInfoForm />
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex justify-end gap-2 mt-8'>
                <Link
                  className='h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)] flex items-center'
                  href={'/user-management'}
                >
                  Cancel
                </Link>
                <Button className='h-[48px] px-12 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white'>
                  Create
                </Button>
              </div>
            </TabsContent>

            <TabsContent value='permissions' className='p-8'>
              <div className='text-center py-16'>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  Permissions Settings
                </h3>
                <p className='text-gray-500'>
                  Configure user permissions and access levels here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
