import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';
import { useState } from 'react';

const switchStyleMd =
  'h-6 w-11 data-[state=checked]:bg-[var(--secondary)] data-[state=unchecked]:bg-gray-300 [&>span]:h-[18px] [&>span]:w-[18px] [&>span]:bg-white data-[state=checked]:[&>span]:border-green-400 [&>span]:transition-all [&>span]:duration-200';

const CompanyManagementAddUser = () => {
  const [accordionValue, setAccordionValue] = useState('roles');
  return (
    <div className=''>
      <div className='rounded-2xl border border-[var(--border-dark)] bg-[var(--white-background)]'>
        <Accordion
          type='single'
          collapsible
          value={accordionValue}
          onValueChange={setAccordionValue}
          className=''
        >
          {/* Roles Access Control */}
          <AccordionItem value='roles' className='border-0 !hover:no-underline'>
            <AccordionTrigger className='px-6 py-4 flex items-center justify-normal gap-4 bbg-[var(--white-background)] rounded-2xl !hover:no-underline [&>svg]:ml-auto'>
              <span className='text-base font-semibold !no-underline'>
                Roles Access Control
              </span>
              <Badge className='bg-[var(--secondary)] hover:bg-[var(--secondary)] text-white px-3 py-1 rounded-full text-sm font-semibold leading-tight'>
                Full Access
              </Badge>
            </AccordionTrigger>
            <AccordionContent className='bg-[#F8FAFB] px-6 pb-6 pt-2 rounded-b-2xl'>
              <div className='space-y-4'>
                {/* Browse Roles */}
                <div className='flex items-center justify-between rounded-[10px] bg-[var(--white-background)] px-6 py-4 shadow-sm'>
                  <div>
                    <div className='font-medium text-base text-[var(--text-dark)] mb-2.5'>
                      Browse Roles
                    </div>
                    <div className='text-sm text-[var(--text-secondary)]'>
                      View the complete list of available roles and their basic
                      information including role names, descriptions, and user
                      counts.
                    </div>
                  </div>
                  <Switch defaultChecked className={switchStyleMd} />
                </div>
                {/* Configure & Modify Roles */}
                <div className='flex items-center justify-between rounded-[10px] bg-[var(--white-background)] px-6 py-4 shadow-sm'>
                  <div>
                    <div className='font-medium text-base text-[var(--text-dark)] mb-2.5'>
                      Configure & Modify Roles
                    </div>
                    <div className='text-sm text-[var(--text-secondary)]'>
                      Modify or set up new roles with custom names,
                      descriptions, and permission assignments tailored to your
                      organization&apos;s needs.
                    </div>
                  </div>
                  <Switch defaultChecked className={switchStyleMd} />
                </div>
                {/* Archive & Restore Roles */}
                <div className='flex items-center justify-between rounded-[10px] bg-[var(--white-background)] px-6 py-4 shadow-sm'>
                  <div>
                    <div className='font-medium text-base text-[var(--text-dark)] mb-2.5'>
                      Archive & Restore Roles
                    </div>
                    <div className='text-sm text-[var(--text-secondary)]'>
                      Remove roles that are no longer needed. System prevents
                      deletion of roles with active users for data safety.
                    </div>
                  </div>
                  <Switch defaultChecked className={switchStyleMd} />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Users Access Control */}
          <AccordionItem value='users' className='border-0'>
            <AccordionTrigger className='px-6 py-4 flex items-center justify-normal gap-5 bg-[var(--white-background)] rounded-2xl [&>svg]:ml-auto'>
              <span className='text-base text-[var(--text-dark)] font-bold'>
                Users Access Control
              </span>
              <Badge className='bg-[#F58B1E] hover:bg-[#F58B1E] text-white px-3 py-1 rounded-full text-sm font-semibold leading-tight'>
                Limited Access
              </Badge>
            </AccordionTrigger>
            <AccordionContent className='bg-[#F8FAFB] px-6 pb-6 pt-2 rounded-b-2xl'>
              <div className='text-[var(--text-secondary)] text-sm'>
                Dummy content for Users Access Control.
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Company Management & Operations */}
          <AccordionItem value='company' className='border-0'>
            <AccordionTrigger className='px-6 py-4 flex items-center justify-normal gap-5 bg-[var(--white-background)] rounded-2xl [&>svg]:ml-auto'>
              <span className='text-base text-[var(--text-dark)] font-bold'>
                Company Management & Operations
              </span>
              <Badge className='bg-[var(--warning)] hover:bg-[var(--warning)] text-white px-3 py-1 rounded-full text-sm font-semibold leading-tight'>
                Restricted
              </Badge>
            </AccordionTrigger>
            <AccordionContent className='bg-[#F8FAFB] px-6 pb-6 pt-2 rounded-b-2xl'>
              <div className='text-[var(--text-secondary)] text-sm'>
                Dummy content for Company Management & Operations.
              </div>
            </AccordionContent>
          </AccordionItem>
          {/* Category Management & Service */}
          <AccordionItem value='category' className='border-0'>
            <AccordionTrigger className='px-6 py-4 flex items-center justify-normal gap-5 bg-[var(--white-background)] rounded-2xl [&>svg]:ml-auto'>
              <span className='text-base text-[var(--text-dark)] font-bold'>
                Category Management & Service
              </span>
              <Badge className='bg-[var(--warning)] hover:bg-[var(--warning)] text-white px-3 py-1 rounded-full text-sm font-semibold leading-tight'>
                Restricted
              </Badge>
            </AccordionTrigger>
            <AccordionContent className='bg-[#F8FAFB] px-6 pb-6 pt-2 rounded-b-2xl'>
              <div className='text-[var(--text-secondary)] text-sm'>
                Dummy content for Category Management & Service.
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      {/* Action Buttons */}
      <div className='flex justify-end gap-6 mt-8'>
        <Link
          href={'/company-details'}
          className='inline-flex items-center h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)]'
        >
          Cancel
        </Link>
        <Button className='h-[48px] px-12 bg-green-500 hover:bg-green-600 rounded-full font-semibold text-white'>
          Save
        </Button>
      </div>
    </div>
  );
};

export default CompanyManagementAddUser;
