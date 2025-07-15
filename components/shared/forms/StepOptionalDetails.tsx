import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Clock } from 'iconsax-react';

interface StepOptionalDetailsProps {
  typeOfProperty: string;
  setTypeOfProperty: (val: string) => void;
  ageOfProperty: string;
  setAgeOfProperty: (val: string) => void;
  approxSqft: string;
  setApproxSqft: (val: string) => void;
  notificationStyle: string;
  setNotificationStyle: (val: string) => void;
  dailyWorkStart: string;
  setDailyWorkStart: (val: string) => void;
  dailyWorkEnd: string;
  setDailyWorkEnd: (val: string) => void;
  ownerPresent: string;
  setOwnerPresent: (val: string) => void;
  weekendWork: string;
  setWeekendWork: (val: string) => void;
  animals: string;
  setAnimals: (val: string) => void;
  petType: string;
  setPetType: (val: string) => void;
  onPrev: () => void;
  onSkip: () => void;
  onNext: () => void;
  cancelButtonClass?: string;
}

export function StepOptionalDetails({
  typeOfProperty,
  setTypeOfProperty,
  ageOfProperty,
  setAgeOfProperty,
  approxSqft,
  setApproxSqft,
  notificationStyle,
  setNotificationStyle,
  dailyWorkStart,
  setDailyWorkStart,
  dailyWorkEnd,
  setDailyWorkEnd,
  ownerPresent,
  setOwnerPresent,
  weekendWork,
  setWeekendWork,
  animals,
  setAnimals,
  petType,
  setPetType,
  onPrev,
  onSkip,
  onNext,
  cancelButtonClass,
}: StepOptionalDetailsProps) {
  return (
    <div className='w-full max-w-[846px] bg-[var(--card-background)] rounded-2xl p-10 flex flex-col items-center'>
      <h2 className='text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
        Optional Details
      </h2>
      <p className='text-[var(--text-secondary)] text-[18px] font-normal text-center mb-8 max-w-lg'>
        Help us understand your needs better. Answer these questions or leave
        them for later.
      </p>
      <form
        className='w-full flex flex-col gap-6'
        onSubmit={e => {
          e.preventDefault();
          onNext();
        }}
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Type of Property */}
          <div className='flex flex-col gap-2'>
            <label className='text-[14px] font-semibold text-[var(--text-dark)]'>
              Type of Property
            </label>
            <Select value={typeOfProperty} onValueChange={setTypeOfProperty}>
              <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'>
                <SelectValue placeholder='Residential' />
              </SelectTrigger>
              <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                <SelectItem value='Residential'>Residential</SelectItem>
                <SelectItem value='Commercial'>Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Age of Property */}
          <div className='flex flex-col gap-2'>
            <label className='text-[14px] font-semibold text-[var(--text-dark)]'>
              Age of Property
            </label>
            <Input
              value={ageOfProperty}
              onChange={e => setAgeOfProperty(e.target.value)}
              placeholder='20 years'
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
          </div>
          {/* Approx. sq ft */}
          <div className='flex flex-col gap-2'>
            <label className='text-[14px] font-semibold text-[var(--text-dark)]'>
              Approx. sq ft
            </label>
            <Input
              value={approxSqft}
              onChange={e => setApproxSqft(e.target.value)}
              placeholder='2500 Sq / Ft'
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
          </div>
          {/* Notification Style */}
          <div className='flex flex-col gap-2'>
            <label className='text-[14px] font-semibold text-[var(--text-dark)]'>
              Notification Style
            </label>
            <Select
              value={notificationStyle}
              onValueChange={setNotificationStyle}
            >
              <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'>
                <SelectValue placeholder='Email' />
              </SelectTrigger>
              <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                <SelectItem value='Email'>Email</SelectItem>
                <SelectItem value='SMS'>SMS</SelectItem>
                <SelectItem value='Phone'>Phone</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Daily Work Timing */}
          <div className='flex flex-col gap-2'>
            <label className='text-[14px] font-semibold text-[var(--text-dark)]'>
              Daily Work Timing
            </label>
            <div className='relative'>
              <Input
                value={dailyWorkStart}
                onChange={e => setDailyWorkStart(e.target.value)}
                placeholder='Start Time'
                className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] pr-12'
              />
              <span className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                <Clock size='24' color='#24338C' />
              </span>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-[14px] font-semibold text-[var(--text-dark)]'>
              &nbsp;
            </label>
            <div className='relative'>
              <Input
                value={dailyWorkEnd}
                onChange={e => setDailyWorkEnd(e.target.value)}
                placeholder='End Time'
                className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)] pr-12'
              />
              <span className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                <Clock size='24' color='#24338C' />
              </span>
            </div>
          </div>
          {/* Owner Need to Be Present */}
          <div className='flex flex-col gap-2'>
            <label className='text-[14px] font-semibold text-[var(--text-dark)]'>
              Owner Need to Be Present
            </label>
            <Select value={ownerPresent} onValueChange={setOwnerPresent}>
              <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'>
                <SelectValue placeholder='No' />
              </SelectTrigger>
              <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                <SelectItem value='Yes'>Yes</SelectItem>
                <SelectItem value='No'>No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Weekend Work Availability */}
          <div className='flex flex-col gap-2'>
            <label className='text-[14px] font-semibold text-[var(--text-dark)]'>
              Weekend Work Availability
            </label>
            <Select value={weekendWork} onValueChange={setWeekendWork}>
              <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'>
                <SelectValue placeholder='Yes' />
              </SelectTrigger>
              <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                <SelectItem value='Yes'>Yes</SelectItem>
                <SelectItem value='No'>No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Animals in the Home */}
          <div className='flex flex-col gap-2'>
            <label className='text-[14px] font-semibold text-[var(--text-dark)]'>
              Animals in the Home
            </label>
            <Select value={animals} onValueChange={setAnimals}>
              <SelectTrigger className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'>
                <SelectValue placeholder='Yes' />
              </SelectTrigger>
              <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                <SelectItem value='Yes'>Yes</SelectItem>
                <SelectItem value='No'>No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Pet type? */}
          <div className='flex flex-col gap-2'>
            <label className='text-[14px] font-semibold text-[var(--text-dark)]'>
              Pet type?
            </label>
            <Input
              value={petType}
              onChange={e => setPetType(e.target.value)}
              placeholder='Dog'
              className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
            />
          </div>
        </div>
        <div className='flex w-full justify-between mt-6'>
          <button
            type='button'
            className={cancelButtonClass || 'btn-secondary !h-12 !px-8'}
            onClick={onPrev}
          >
            Previous
          </button>
          <div className='flex gap-2'>
            <button
              type='button'
              className='text-[var(--text-dark)] font-semibold bg-transparent'
              onClick={onSkip}
            >
              Skip
            </button>
            <button className='btn-primary !h-12 !px-12' type='submit'>
              Next Step
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
