import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { yupResolver } from '@hookform/resolvers/yup';
import { Clock } from 'iconsax-react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const optionalDetailsSchema = yup.object({
  typeOfProperty: yup.string().required('Property type is required'),
  ageOfProperty: yup.string().required('Property age is required'),
  approxSqft: yup.string().required('Square footage is required'),
  notificationStyle: yup.string().required('Notification style is required'),
  dailyWorkStart: yup.string().optional(),
  dailyWorkEnd: yup.string().optional(),
  ownerPresent: yup.string().required('Owner presence preference is required'),
  weekendWork: yup.string().required('Weekend work preference is required'),
  animals: yup.string().required('Animals preference is required'),
  petType: yup.string().when('animals', {
    is: 'Yes',
    then: schema =>
      schema.required('Pet type is required when animals are present'),
    otherwise: schema => schema.optional(),
  }),
});

interface StepOptionalDetailsProps {
  onPrev: () => void;
  onSkip?: () => void;
  onNext: (data: any) => void;
  cancelButtonClass?: string;
  defaultValues?: any;
  isLastStep?: boolean;
}

export function StepOptionalDetails({
  onPrev,
  onNext,
  cancelButtonClass,
  defaultValues,
  isLastStep = false,
}: StepOptionalDetailsProps) {
  const form = useForm<any>({
    resolver: yupResolver(optionalDetailsSchema),
    defaultValues: {
      typeOfProperty: 'Residential',
      ageOfProperty: '0-5 years',
      approxSqft: '2500 Sq / Ft',
      notificationStyle: 'Email',
      dailyWorkStart: '',
      dailyWorkEnd: '',
      ownerPresent: 'No',
      weekendWork: 'Yes',
      animals: 'Yes',
      petType: 'Dog',
      ...defaultValues,
    },
  });

  const { watch } = form;
  const animals = watch('animals');

  const onSubmit = (data: any) => {
    onNext(data);
  };

  return (
    <div className='w-full max-w-[846px] bg-[var(--card-background)] rounded-2xl p-6 flex flex-col items-center'>
      <h2 className='text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
        Optional Details
      </h2>
      <p className='text-[var(--text-secondary)] text-[18px] font-normal text-center mb-8 max-w-lg'>
        Help us understand your needs better. Answer these questions or leave
        them for later.
      </p>
      <Form {...form}>
        <form
          className='w-full flex flex-col gap-4'
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh_-_550px)] overflow-y-auto'>
            {/* Type of Property */}
            <div className='flex flex-col gap-2'>
              <FormField
                control={form.control}
                name='typeOfProperty'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='field-label'>
                      Type of Property
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='input-field'>
                          <SelectValue placeholder='Residential' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                        <SelectItem value='Residential'>Residential</SelectItem>
                        <SelectItem value='Commercial'>Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Age of Property */}
            <div className='flex flex-col gap-2'>
              <FormField
                control={form.control}
                name='ageOfProperty'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='field-label'>
                      Age of Property
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='input-field'>
                          <SelectValue placeholder='Select age' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                        <SelectItem value='0-5 years'>0-5 years</SelectItem>
                        <SelectItem value='6-10 years'>6-10 years</SelectItem>
                        <SelectItem value='11-20 years'>11-20 years</SelectItem>
                        <SelectItem value='21-30 years'>21-30 years</SelectItem>
                        <SelectItem value='31-50 years'>31-50 years</SelectItem>
                        <SelectItem value='50+ years'>50+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Approx. sq ft */}
            <div className='flex flex-col gap-2'>
              <FormField
                control={form.control}
                name='approxSqft'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='field-label'>Approx. sq ft</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='2500 Sq / Ft'
                        className='input-field'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Notification Style */}
            <div className='flex flex-col gap-2'>
              <FormField
                control={form.control}
                name='notificationStyle'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='field-label'>
                      Notification Style
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='input-field'>
                          <SelectValue placeholder='Email' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                        <SelectItem value='Email'>Email</SelectItem>
                        <SelectItem value='SMS'>SMS</SelectItem>
                        <SelectItem value='Phone'>Phone</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Daily Work Timing */}
            <div className='flex flex-col gap-2'>
              <FormLabel className='field-label'>Daily Work Timing</FormLabel>
              <div className='relative'>
                <FormField
                  control={form.control}
                  name='dailyWorkStart'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='time'
                          placeholder='Start Time'
                          className='input-field pr-12 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                  <Clock size='24' color='#24338C' />
                </span>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <FormLabel className='field-label'>&nbsp;</FormLabel>
              <div className='relative'>
                <FormField
                  control={form.control}
                  name='dailyWorkEnd'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='time'
                          placeholder='End Time'
                          className='input-field pr-12 bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <span className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
                  <Clock size='24' color='#24338C' />
                </span>
              </div>
            </div>
            {/* Owner Need to Be Present */}
            <div className='flex flex-col gap-2'>
              <FormField
                control={form.control}
                name='ownerPresent'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='field-label'>
                      Owner Need to Be Present
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='input-field'>
                          <SelectValue placeholder='No' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                        <SelectItem value='Yes'>Yes</SelectItem>
                        <SelectItem value='No'>No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Weekend Work Availability */}
            <div className='flex flex-col gap-2'>
              <FormField
                control={form.control}
                name='weekendWork'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='field-label'>
                      Weekend Work Availability
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='input-field'>
                          <SelectValue placeholder='Yes' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                        <SelectItem value='Yes'>Yes</SelectItem>
                        <SelectItem value='No'>No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Animals in the Home */}
            <div className='flex flex-col gap-2'>
              <FormField
                control={form.control}
                name='animals'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='field-label'>
                      Animals in the Home
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='input-field'>
                          <SelectValue placeholder='Yes' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                        <SelectItem value='Yes'>Yes</SelectItem>
                        <SelectItem value='No'>No</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Pet type? */}
            {animals === 'Yes' && (
              <div className='flex flex-col gap-2'>
                <FormField
                  control={form.control}
                  name='petType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='field-label'>Pet type?</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className='input-field'>
                            <SelectValue placeholder='Select pet type' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                          <SelectItem value='Dog'>Dog</SelectItem>
                          <SelectItem value='Cat'>Cat</SelectItem>
                          <SelectItem value='Bird'>Bird</SelectItem>
                          <SelectItem value='Fish'>Fish</SelectItem>
                          <SelectItem value='Reptile'>Reptile</SelectItem>
                          <SelectItem value='Other'>Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
          <div className='flex w-full justify-between'>
            <button
              type='button'
              className={cancelButtonClass || 'btn-secondary !h-12 !px-8'}
              onClick={onPrev}
            >
              Previous
            </button>
            <div className='flex gap-2'>
              <Button className='btn-primary !h-12 !px-12' type='submit'>
                {isLastStep ? 'Submit' : 'Next Step'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
