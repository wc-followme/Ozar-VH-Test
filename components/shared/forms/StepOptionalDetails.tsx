import { STEP_MESSAGES } from '@/app/(DashboardLayout)/job-management/step-messages';
import {
  StepOptionalDetailsData,
  StepOptionalDetailsProps,
} from '@/app/(DashboardLayout)/job-management/types';
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
  typeOfProperty: yup.string().required(STEP_MESSAGES.PROPERTY_TYPE_REQUIRED),
  ageOfProperty: yup.string().required(STEP_MESSAGES.PROPERTY_AGE_REQUIRED),
  approxSqft: yup.string().required(STEP_MESSAGES.SQUARE_FOOTAGE_REQUIRED),
  notificationStyle: yup
    .string()
    .required(STEP_MESSAGES.NOTIFICATION_STYLE_REQUIRED),
  dailyWorkStart: yup.string().optional(),
  dailyWorkEnd: yup.string().optional(),
  ownerPresent: yup.string().required(STEP_MESSAGES.OWNER_PRESENCE_REQUIRED),
  weekendWork: yup.string().required(STEP_MESSAGES.WEEKEND_WORK_REQUIRED),
  animals: yup.string().required(STEP_MESSAGES.ANIMALS_REQUIRED),
  petType: yup.string().when('animals', {
    is: 'Yes',
    then: schema => schema.required(STEP_MESSAGES.PET_TYPE_REQUIRED),
    otherwise: schema => schema.optional(),
  }),
});
export function StepOptionalDetails({
  onPrev,
  onNext,
  cancelButtonClass,
  defaultValues,
  isLastStep = false,
}: StepOptionalDetailsProps) {
  const form = useForm({
    resolver: yupResolver(optionalDetailsSchema),
    defaultValues: {
      typeOfProperty: 'Residential',
      ageOfProperty: '0-5 years',
      approxSqft: '',
      notificationStyle: 'Email',
      dailyWorkStart: '',
      dailyWorkEnd: '',
      ownerPresent: 'No',
      weekendWork: 'No',
      animals: 'No',
      petType: '',
      ...defaultValues,
    },
  });

  const { watch } = form;
  const animals = watch('animals');

  const onSubmit = (data: any) => {
    onNext(data as StepOptionalDetailsData);
  };

  return (
    <div className='w-full max-w-[846px] bg-[var(--card-background)] rounded-2xl p-6 flex flex-col items-center'>
      <h2 className='text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
        {STEP_MESSAGES.OPTIONAL_DETAILS_TITLE}
      </h2>
      <p className='text-[var(--text-secondary)] text-[18px] font-normal text-center mb-8 max-w-lg'>
        {STEP_MESSAGES.OPTIONAL_DETAILS_DESCRIPTION}
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
                      {STEP_MESSAGES.TYPE_OF_PROPERTY_LABEL}
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='input-field'>
                          <SelectValue
                            placeholder={STEP_MESSAGES.RESIDENTIAL}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                        <SelectItem value='Residential'>
                          {STEP_MESSAGES.RESIDENTIAL}
                        </SelectItem>
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
                      {STEP_MESSAGES.AGE_OF_PROPERTY_LABEL}
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='input-field'>
                          <SelectValue placeholder={STEP_MESSAGES.SELECT_AGE} />
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
                    <FormLabel className='field-label'>
                      {STEP_MESSAGES.APPROX_SQ_FT_LABEL}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={STEP_MESSAGES.APPROX_SQ_FT_PLACEHOLDER}
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
                      {STEP_MESSAGES.NOTIFICATION_STYLE_LABEL}
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='input-field'>
                          <SelectValue
                            placeholder={STEP_MESSAGES.EMAIL_NOTIFICATION}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                        <SelectItem value='Email'>
                          {STEP_MESSAGES.EMAIL_NOTIFICATION}
                        </SelectItem>
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
              <FormLabel className='field-label'>
                {STEP_MESSAGES.DAILY_WORK_TIMING_LABEL}
              </FormLabel>
              <div className='relative'>
                <FormField
                  control={form.control}
                  name='dailyWorkStart'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type='time'
                          placeholder={STEP_MESSAGES.START_TIME}
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
                          placeholder={STEP_MESSAGES.END_TIME}
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
                      {STEP_MESSAGES.OWNER_PRESENT_LABEL}
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='input-field'>
                          <SelectValue placeholder={STEP_MESSAGES.NO} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                        <SelectItem value='Yes'>{STEP_MESSAGES.YES}</SelectItem>
                        <SelectItem value='No'>{STEP_MESSAGES.NO}</SelectItem>
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
                      {STEP_MESSAGES.WEEKEND_WORK_LABEL}
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='input-field'>
                          <SelectValue placeholder={STEP_MESSAGES.YES} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                        <SelectItem value='Yes'>{STEP_MESSAGES.YES}</SelectItem>
                        <SelectItem value='No'>{STEP_MESSAGES.NO}</SelectItem>
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
                      {STEP_MESSAGES.ANIMALS_IN_HOME_LABEL}
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='input-field'>
                          <SelectValue placeholder={STEP_MESSAGES.YES} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                        <SelectItem value='Yes'>{STEP_MESSAGES.YES}</SelectItem>
                        <SelectItem value='No'>{STEP_MESSAGES.NO}</SelectItem>
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
                      <FormLabel className='field-label'>
                        {STEP_MESSAGES.PET_TYPE_LABEL}
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className='input-field'>
                            <SelectValue
                              placeholder={STEP_MESSAGES.SELECT_PET_TYPE}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                          <SelectItem value='Dog'>Dog</SelectItem>
                          <SelectItem value='Cat'>Cat</SelectItem>
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
              {STEP_MESSAGES.PREVIOUS}
            </button>
            <div className='flex gap-2'>
              <Button className='btn-primary !h-12 !px-12' type='submit'>
                {isLastStep ? STEP_MESSAGES.SUBMIT : STEP_MESSAGES.NEXT_STEP}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
