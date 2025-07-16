'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import React from 'react';

const switchStyleMd =
  'h-6 w-11 data-[state=checked]:bg-[var(--secondary)] data-[state=unchecked]:bg-gray-300 [&>span]:h-[18px] [&>span]:w-[18px] [&>span]:bg-white data-[state=checked]:[&>span]:border-green-400 [&>span]:transition-all [&>span]:duration-200';

export interface AccessStripe {
  title: string;
  description: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  disabled?: boolean;
}

export interface AccessControlAccordionProps {
  title: string;
  badgeLabel: string;
  stripes: AccessStripe[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AccessControlAccordion: React.FC<AccessControlAccordionProps> = ({
  title,
  badgeLabel,
  stripes,
  open = false,
  onOpenChange,
}) => {
  const accordionValue = open ? 'roles' : '';
  const handleAccordionChange = (value: string) => {
    if (onOpenChange) {
      onOpenChange(value === 'roles');
    }
  };

  // Determine badge color based on access level
  let badgeColorClass = 'bg-[var(--secondary)]';
  if (badgeLabel.toLowerCase() === 'full access') {
    badgeColorClass = 'bg-[var(--secondary)] hover:bg-[var(--secondary)]';
  } else if (badgeLabel.toLowerCase() === 'limited access') {
    badgeColorClass = 'bg-[var(--bg-limited)] hover:bg-[var(--bg-limited)]';
  } else if (badgeLabel.toLowerCase() === 'restricted') {
    badgeColorClass = 'bg-[var(--warning)] hover:bg-[var(--warning)]';
  }

  return (
    <Accordion
      type='single'
      collapsible
      value={accordionValue}
      onValueChange={handleAccordionChange}
      className=''
    >
      <AccordionItem
        value='roles'
        className='border border-[var(--border-dark)] !hover:no-underline rounded-[20px] overflow-hidden'
      >
        <AccordionTrigger className='border-0 px-6 py-5 flex items-center justify-normal gap-4 bg-[var(--white-background)] hover:!no-underline [&>svg]:ml-auto'>
          <span className='text-base font-bold text-[var(--text-dark)] !no-underline'>
            {title}
          </span>
          <Badge
            className={`${badgeColorClass} text-white px-3 py-1 rounded-full text-sm font-medium leading-tight`}
          >
            {badgeLabel}
          </Badge>
        </AccordionTrigger>
        <AccordionContent className='border-0 bg-[var(--background)] px-6 py-4'>
          <div className='flex flex-col gap-4'>
            {stripes.map((stripe, idx) => (
              <div
                key={stripe.title + idx}
                className='flex items-center gap-4 justify-between rounded-[10px] bg-[var(--white-background)] p-4 shadow-sm'
              >
                <div>
                  <div className='font-medium text-base text-[var(--text-dark)] mb-2'>
                    {stripe.title}
                  </div>
                  <div className='text-sm text-[var(--text-secondary)]'>
                    {stripe.description}
                  </div>
                </div>
                <Switch
                  checked={stripe.checked}
                  onCheckedChange={stripe.onToggle}
                  className={switchStyleMd}
                  disabled={stripe.disabled}
                />
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AccessControlAccordion;
