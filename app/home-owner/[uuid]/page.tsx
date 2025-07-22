'use client';

import { HomeOwnerHeader } from '@/components/layout/HomeOwnerHeader';
import { StepGeneralInfo } from '@/components/shared/forms/StepGeneralInfo';
import { StepOptionalDetails } from '@/components/shared/forms/StepOptionalDetails';
import { StepProjectType } from '@/components/shared/forms/StepProjectType';
import { showErrorToast, showSuccessToast } from '@/components/ui/use-toast';
import { apiService } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomeOwnerWizardPage() {
  const params = useParams();
  const router = useRouter();
  const uuid = params['uuid'] as string;

  // Job data state
  const [jobData, setJobData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wizard step state
  const [step, setStep] = useState<'general' | 'optional' | 'projectType'>(
    'general'
  );

  // Form data state
  const [generalInfoData, setGeneralInfoData] = useState<any>(null);
  const [optionalDetailsData, setOptionalDetailsData] = useState<any>(null);
  const [projectTypeData, setProjectTypeData] = useState<any>(null);

  // Fetch job data on component mount
  useEffect(() => {
    const fetchJobData = async () => {
      if (!uuid) {
        setError('No job UUID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await apiService.fetchJobById(uuid);
        const job = response.data || response;
        setJobData(job);

        // Reset form data based on existing job data
        if (job) {
          // Reset general info data
          setGeneralInfoData({
            fullName: job.client_name || '',
            email: job.client_email || '',
            phone: job.client_phone_number || '',
            address: job.client_address || '',
            budget: job.budget ? `$${job.budget}` : '',
            contractor: job.preferred_contractor
              ? job.preferred_contractor.toString()
              : '',
            projectStartDate: job.project_start_date || '',
            projectFinishDate: job.project_finish_date || '',
          });

          // Reset optional details data
          setOptionalDetailsData({
            typeOfProperty: job.property_type
              ? job.property_type.toLowerCase()
              : '',
            ageOfProperty: job.age_of_property || '',
            approxSqft: job.approx_sq_ft ? job.approx_sq_ft.toString() : '',
            notificationStyle: job.notification_style || 'Email',
            dailyWorkStart: job.daily_work_start_time || '',
            dailyWorkEnd: job.daily_work_end_time || '',
            ownerPresent: job.owner_present_need ? 'Yes' : 'No',
            weekendWork: job.weekend_work ? 'Yes' : 'No',
            animals: job.has_animals ? 'Yes' : 'No',
            petType: job.pet_type || '',
          });

          // Reset project type data
          setProjectTypeData({
            selectedType: job.category_id ? job.category_id.toString() : '',
          });
        }
      } catch (err) {
        console.error('Error fetching job data:', err);
        setError('Failed to load job data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [uuid]);

  // Navigation handlers
  const goToGeneral = () => setStep('general');
  const goToOptional = () => setStep('optional');
  const goToProjectType = () => setStep('projectType');

  // Form submission handlers
  const handleGeneralInfoSubmit = (data: any) => {
    setGeneralInfoData(data);
    if (jobBoxesStep === 'FIRST') {
      // Submit only general info
      handleFinalSubmit({ generalInfo: data });
    } else {
      goToOptional();
    }
  };

  const handleOptionalDetailsSubmit = (data: any) => {
    setOptionalDetailsData(data);
    if (jobBoxesStep === 'SECOND') {
      // Submit general + optional info
      handleFinalSubmit({
        generalInfo: generalInfoData,
        optionalDetails: data,
      });
    } else {
      goToProjectType();
    }
  };

  const handleOptionalDetailsSkip = () => {
    if (jobBoxesStep === 'SECOND') {
      // Submit only general info (skip optional)
      handleFinalSubmit({ generalInfo: generalInfoData });
    } else {
      goToProjectType();
    }
  };

  const handleProjectTypeSubmit = (data: any) => {
    setProjectTypeData(data);
    // Submit all data
    handleFinalSubmit({
      generalInfo: generalInfoData,
      optionalDetails: optionalDetailsData,
      projectType: data,
    });
  };

  const handleFinalSubmit = async (allData: any) => {
    try {
      console.log('Submitting all form data:', allData);

      // Prepare API payload
      const payload: any = {};

      // Map general info data
      if (allData.generalInfo) {
        const general = allData.generalInfo;
        payload.client_name = general.fullName || '';
        payload.client_email = general.email || '';
        payload.client_phone_number = general.phone || '';
        payload.client_address = general.address || '';
        payload.budget =
          parseFloat(general.budget?.replace(/[^0-9.]/g, '')) || 0;
        payload.preferred_contractor = Number(general.contractor) || null;

        // Handle dates
        if (general.projectStartDate) {
          payload.project_start_date = new Date(general.projectStartDate)
            .toISOString()
            .split('T')[0];
        }
        if (general.projectFinishDate) {
          payload.project_finish_date = new Date(general.projectFinishDate)
            .toISOString()
            .split('T')[0];
        }
      }

      // Map optional details data
      if (allData.optionalDetails) {
        const optional = allData.optionalDetails;
        payload.property_type =
          optional.typeOfProperty?.toUpperCase() || 'RESIDENTIAL';
        payload.age_of_property = optional.ageOfProperty || '';
        payload.approx_sq_ft =
          parseInt(optional.approxSqft?.replace(/[^0-9]/g, '')) || 0;
        payload.notification_style = optional.notificationStyle || 'Email';
        payload.daily_work_start_time = optional.dailyWorkStart || '';
        payload.daily_work_end_time = optional.dailyWorkEnd || '';
        payload.owner_present_need = optional.ownerPresent === 'Yes';
        payload.weekend_work = optional.weekendWork === 'Yes';
        payload.has_animals = optional.animals === 'Yes';
        payload.pet_type = optional.petType || '';
      }

      // Map project type data
      if (allData.projectType) {
        const project = allData.projectType;
        payload.category_id = Number(project.selectedType) || null;
      }

      // Add existing job data if available
      if (jobData) {
        payload.company_id = Number(jobData.company_id) || null;
        payload.client_id = jobData.client_id || null;
        payload.job_image = jobData.job_image || '';
        payload.project_name = jobData.project_name || '';
        payload.latitude = jobData.latitude || '';
        payload.longitude = jobData.longitude || '';
        payload.job_status = jobData.job_status || 'PENDING';
        payload.job_privacy = jobData.job_privacy || 'PUBLIC';
        payload.status = jobData.status || 'ACTIVE';
      }

      payload.job_boxes_step = jobBoxesStep;

      console.log('API Payload:', payload);

      // Call the API using apiService
      const response = await apiService.updateJob(uuid, payload);

      console.log('API Response:', response);

      // Show success toast with API response message
      if (response && response.message) {
        showSuccessToast(response.message);
        router.push('/job-management');
      } else {
        showSuccessToast('Form submitted successfully!');
      }

      // Redirect to job management page after a short delay
    } catch (error: any) {
      console.error('Error submitting form:', error);

      // Show error toast with API response message
      if (error && error.message) {
        showErrorToast(error.message);
      } else {
        showErrorToast('Failed to submit form. Please try again.');
      }
    } finally {
    }
  };

  // Get job boxes step from job data
  const jobBoxesStep = jobData?.job_boxes_step || 'THIRD';

  // Progress indicator logic based on job_boxes_step
  const getSteps = () => {
    switch (jobBoxesStep) {
      case 'FIRST':
        return [];
      case 'SECOND':
        return [
          { key: 'general', label: 'General Info' },
          { key: 'optional', label: 'Optional Details' },
        ];
      case 'THIRD':
      default:
        return [
          { key: 'general', label: 'General Info' },
          { key: 'optional', label: 'Optional Details' },
          { key: 'projectType', label: 'Project Type' },
        ];
    }
  };

  const steps = getSteps();
  const stepIndex = steps.findIndex(s => s.key === step);
  const totalSteps = steps.length;

  // Cancel/Previous button class
  const cancelButtonClass =
    'h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)] flex items-center';

  // Loading state
  if (isLoading) {
    return (
      <div className='min-h-screen bg-[var(--white-background)] flex flex-col items-center'>
        <HomeOwnerHeader />
        <div className='mt-auto'>
          <div className='w-[90vw] mx-auto flex flex-col items-center bg-[var(--background)] min-h-[calc(100vh-100px)] rounded-tl-[32px] rounded-tr-[32px] px-4 md:px-12 py-8 md:py-16 shadow-none'>
            <div className='flex items-center justify-center h-64'>
              <div className='text-lg text-gray-600'>Loading job data...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='min-h-screen bg-[var(--white-background)] flex flex-col items-center'>
        <HomeOwnerHeader />
        <div className='mt-auto'>
          <div className='w-[90vw] mx-auto flex flex-col items-center bg-[var(--background)] min-h-[calc(100vh-100px)] rounded-tl-[32px] rounded-tr-[32px] px-4 md:px-12 py-8 md:py-16 shadow-none'>
            <div className='flex items-center justify-center h-64'>
              <div className='text-lg text-red-600'>{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[var(--white-background)] flex flex-col items-center'>
      <HomeOwnerHeader />
      {/* Centered content with background */}
      <div className='mt-auto'>
        <div className=''>
          <div className='w-[90vw] mx-auto flex flex-col items-center bg-[var(--background)] min-h-[calc(100vh-100px)] rounded-tl-[32px] rounded-tr-[32px] px-4 md:px-12 py-8 md:py-16 shadow-none'>
            {/* Custom Progress Bar - Only show if not FIRST step */}
            {jobBoxesStep !== 'FIRST' && steps.length > 0 && (
              <div className='w-full flex justify-center mb-12'>
                <div className='flex items-center justify-center w-full max-w-2xl'>
                  {steps.map((s, idx) => (
                    <>
                      <div
                        key={s.key}
                        className={`flex items-center ${idx !== 0 ? 'ml-0' : ''}`}
                      >
                        {/* Circle */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${stepIndex >= idx ? 'bg-green-600' : 'bg-gray-300'}`}
                        />
                        {/* Line (except after last circle) */}
                        {idx < totalSteps - 1 && (
                          <div
                            className={`h-2 w-[120px] -mx-[1px] md:w-[180px] ${stepIndex > idx ? 'bg-green-600' : 'bg-gray-300'}`}
                          />
                        )}
                      </div>
                    </>
                  ))}
                </div>
              </div>
            )}
            {/* Wizard Steps */}
            {step === 'general' && (
              <StepGeneralInfo
                onNext={handleGeneralInfoSubmit}
                defaultValues={generalInfoData}
                isLastStep={jobBoxesStep === 'FIRST'}
              />
            )}
            {step === 'optional' && (
              <StepOptionalDetails
                onPrev={goToGeneral}
                {...(jobBoxesStep === 'THIRD' && {
                  onSkip: handleOptionalDetailsSkip,
                })}
                onNext={handleOptionalDetailsSubmit}
                cancelButtonClass={cancelButtonClass}
                defaultValues={optionalDetailsData}
                isLastStep={jobBoxesStep === 'SECOND'}
              />
            )}
            {step === 'projectType' && jobBoxesStep === 'THIRD' && (
              <StepProjectType
                onPrev={goToOptional}
                onSubmit={handleProjectTypeSubmit}
                cancelButtonClass={cancelButtonClass}
                defaultValues={projectTypeData}
                isLastStep={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
