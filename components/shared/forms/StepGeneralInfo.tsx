import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
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
import { format } from 'date-fns';
import { Calendar as IconsaxCalendar } from 'iconsax-react';

interface StepGeneralInfoProps {
  projectStart: Date | undefined;
  setProjectStart: (date: Date | undefined) => void;
  projectFinish: Date | undefined;
  setProjectFinish: (date: Date | undefined) => void;
  emails: string[];
  setEmails: (emails: string[]) => void;
  handleAddEmail: () => void;
  handleEmailChange: (idx: number, value: string) => void;
  phones: string[];
  setPhones: (phones: string[]) => void;
  handleAddPhone: () => void;
  handlePhoneChange: (idx: number, value: string) => void;
  contractor: string;
  setContractor: (contractor: string) => void;
  onNext: () => void;
}

export function StepGeneralInfo({
  projectStart,
  setProjectStart,
  projectFinish,
  setProjectFinish,
  emails,
  handleAddEmail,
  handleEmailChange,
  phones,
  handleAddPhone,
  handlePhoneChange,
  contractor,
  setContractor,
  onNext,
}: StepGeneralInfoProps) {
  return (
    <div className='w-full max-w-[846px] bg-[var(--card-background)] rounded-2xl p-4 flex flex-col items-center'>
      <h2 className='text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
        General information
      </h2>
      <p className='text-[var(--text-secondary)] text-[18px] font-normal text-center mb-8 max-w-lg'>
        Please answer the required questions to start your project. This helps
        us generate a personalized quote for you.
      </p>
      <form
        className='w-full flex flex-col gap-6'
        onSubmit={e => {
          e.preventDefault();
          onNext();
        }}
      >
        <div className='h-[calc(100vh_-_550px)] overflow-y-auto'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Your Name (full width) */}
            <div className='flex flex-col gap-2 col-span-1 md:col-span-2'>
              <label className='field-label'>Your Name</label>
              <Input
                placeholder='Enter your full name'
                className='input-field'
              />
            </div>
            {/* Project Start Date */}
            <div className='flex flex-col gap-2'>
              <label className='field-label'>Project Start Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='w-full h-12 px-4 pr-2 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] focus:border-green-500 focus:ring-green-500 justify-between font-normal'
                  >
                    {projectStart ? format(projectStart, 'PPP') : 'Select Date'}
                    <IconsaxCalendar
                      size='50'
                      className='!h-6 !w-6'
                      color='#24338C'
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='p-0 bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'
                  align='start'
                >
                  <Calendar
                    mode='single'
                    selected={projectStart}
                    onSelect={setProjectStart}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* Project Finish Date */}
            <div className='flex flex-col gap-2'>
              <label className='field-label'>Project Finish Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant='outline'
                    className='w-full h-12 px-4 pr-2 border-2 border-[var(--border-dark)] bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] focus:border-green-500 focus:ring-green-500 justify-between font-normal'
                  >
                    {projectFinish
                      ? format(projectFinish, 'PPP')
                      : 'Select Date'}
                    <IconsaxCalendar
                      size='50'
                      className='!h-6 !w-6'
                      color='#24338C'
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className='p-0 bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'
                  align='start'
                >
                  <Calendar
                    mode='single'
                    selected={projectFinish}
                    onSelect={setProjectFinish}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* Email(s) */}
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between'>
                <label className='field-label'>Email</label>
                <button
                  type='button'
                  className='text-[var(--secondary)] text-xs font-semibold hidden'
                  onClick={handleAddEmail}
                >
                  + Add Another
                </button>
              </div>
              {emails.map((email, idx) => (
                <Input
                  key={idx}
                  type='email'
                  placeholder='Enter your email'
                  className='input-field mb-2'
                  value={email}
                  onChange={e => handleEmailChange(idx, e.target.value)}
                />
              ))}
            </div>
            {/* Phone(s) */}
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between'>
                <label className='field-label'>Phone Number</label>
                <button
                  type='button'
                  className='text-[var(--secondary)] text-xs font-semibold'
                  onClick={handleAddPhone}
                >
                  + Add Another
                </button>
              </div>
              {phones.map((phone, idx) => (
                <Input
                  key={idx}
                  placeholder='Enter your number'
                  className='input-field mb-2'
                  value={phone}
                  onChange={e => handlePhoneChange(idx, e.target.value)}
                />
              ))}
            </div>
            {/* Your Budget */}
            <div className='flex flex-col gap-2'>
              <label className='field-label'>Your Budget</label>
              <Input placeholder='Enter your Budget' className='input-field' />
            </div>
            {/* Preferred Contractor */}
            <div className='flex flex-col gap-2'>
              <label className='field-label'>Preferred Contractor</label>
              <Select value={contractor} onValueChange={setContractor}>
                <SelectTrigger className='input-field'>
                  <SelectValue placeholder='Any' />
                </SelectTrigger>
                <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                  <SelectItem value='any'>Any</SelectItem>
                  <SelectItem value='contractor1'>Contractor 1</SelectItem>
                  <SelectItem value='contractor2'>Contractor 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Address */}
          <div className='flex flex-col gap-2 mt-4'>
            <label className='field-label'>Address</label>
            <Input placeholder='Enter your address' className='input-field' />
          </div>
        </div>
        {/* Next Step Button */}
        <div className='flex justify-end'>
          <Button type='submit' className='btn-primary !h-12 !px-12'>
            Next Step
          </Button>
        </div>
      </form>
    </div>
  );
}
