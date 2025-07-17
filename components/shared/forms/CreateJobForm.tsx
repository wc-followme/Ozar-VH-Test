'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { RadioGroupStripe } from '../common/RadioStripe';
import { SelectBoxCard } from '../common/SelectBoxCard';

const selectBoxOptions = [
  {
    id: 'homeowner-info',
    title: 'Homeowner Info',
    description:
      'Includes name, email, phone number, and basic contact details.',
    status: false,
  },
  {
    id: 'property-details',
    title: 'Property Details',
    description:
      'Covers home size, number of BHKs, and type of work (interior, exterior, etc.).',
    status: false,
  },
  {
    id: 'project-estimate',
    title: 'Project Estimate',
    description:
      'Provides a detailed cost estimate based on selected services and property info.',
    status: false,
  },
  {
    id: 'adding-more',
    title: 'Adding more project details',
    description:
      'Includes name, email, phone number, and basic contact details.',
    status: true,
  },
  {
    id: 'complete-estimate',
    title: 'Complete line items in estimates to create new estimates.',
    description: 'Covers home size, number of BHKs, and type of work.',
    status: true,
  },
];
export function CreateJobForm() {
  const [jobType, setJobType] = useState('public');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Card className='w-full max-w-4xl mx-auto bg-transparent shadow-none border-0'>
      <CardContent className='p-0'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Full Name Input */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2 col-span-2'>
              <Label htmlFor='full-name' className='fled-label'>
                New to Us / Already with Us
              </Label>
              <Input
                id='full-name'
                placeholder='Enter client full name'
                className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='full-name' className='fled-label'>
                Email
              </Label>
              <Input
                id='full-name'
                placeholder='Enter your email'
                className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='full-name' className='fled-label'>
                Phone Number
              </Label>
              <Input
                id='full-name'
                placeholder='Enter your number'
                className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
              />
            </div>
          </div>

          {/* Job Type Radio Group */}
          <div className='space-y-3'>
            <RadioGroupStripe value={jobType} onChange={setJobType} />
          </div>

          {/* Select Boxes Section */}
          <div className='space-y-4'>
            <Label htmlFor='full-name' className='fled-label'>
              Select Boxes
            </Label>
            <div className='grid gap-4 grid-cols-3 md:grid-cols-3'>
              {selectBoxOptions.map(({ id, title, description, status }) => (
                <SelectBoxCard
                  key={id}
                  id={id}
                  title={title}
                  description={description}
                  status={status}
                />
              ))}
            </div>
          </div>

          {/* Link Input */}
          <div className='space-y-2'>
            <Label htmlFor='full-name' className='fled-label'>
              Link
            </Label>
            <Input
              id='full-name'
              placeholder=''
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
          </div>

          {/* Submit Button */}
          <div className='pt-4 flex items-center gap-3'>
            <Button className='btn-secondary !h-12'>Continue Estimate</Button>
            <Button type='submit' className='btn-primary !h-12'>
              Create Job
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
