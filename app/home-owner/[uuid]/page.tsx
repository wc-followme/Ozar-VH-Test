'use client';

import { HomeOwnerHeader } from '@/components/layout/HomeOwnerHeader';
import { StepGeneralInfo } from '@/components/shared/forms/StepGeneralInfo';
import { StepOptionalDetails } from '@/components/shared/forms/StepOptionalDetails';
import { StepProjectType } from '@/components/shared/forms/StepProjectType';
import { showErrorToast, showSuccessToast } from '@/components/ui/use-toast';
import { apiService } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HOME_OWNER_MESSAGES } from '../home-owner-messages';
import {
  GeneralInfoData,
  HomeOwnerFormData,
  JOB_BOXES_STEPS,
  JobData,
  OptionalDetailsData,
  ProjectTypeData,
  WIZARD_STEPS,
  WizardStep,
} from '../home-owner-types';

export default function HomeOwnerWizardPage() {
  const params = useParams();
  const router = useRouter();
  const uuid = params['uuid'] as string;

  // Job data state
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wizard step state
  const [step, setStep] = useState<WizardStep>(WIZARD_STEPS.GENERAL);

  // Form data state
  const [generalInfoData, setGeneralInfoData] =
    useState<GeneralInfoData | null>(null);
  const [optionalDetailsData, setOptionalDetailsData] =
    useState<OptionalDetailsData | null>(null);
  const [projectTypeData, setProjectTypeData] =
    useState<ProjectTypeData | null>(null);

  // Fetch job data on component mount
  useEffect(() => {
    const fetchJobData = async () => {
      if (!uuid) {
        setError(HOME_OWNER_MESSAGES.NO_UUID_ERROR);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await apiService.fetchJobById(uuid);
        const { data } = response;
        const job = data || response;
        setJobData(job);

        // Reset form data based on existing job data
        if (job) {
          const {
            client_name,
            client_email,
            client_phone_number,
            client_address,
            budget,
            preferred_contractor,
            project_start_date,
            project_finish_date,
            property_type,
            age_of_property,
            approx_sq_ft,
            notification_style,
            daily_work_start_time,
            daily_work_end_time,
            owner_present_need,
            weekend_work,
            has_animals,
            pet_type,
            category_id,
          } = job;

          // Reset general info data
          setGeneralInfoData({
            fullName: client_name || '',
            email: client_email || '',
            phone: client_phone_number || '',
            address: client_address || '',
            budget: budget ? `$${budget}` : '',
            contractor: preferred_contractor
              ? preferred_contractor.toString()
              : '',
            projectStartDate: project_start_date || '',
            projectFinishDate: project_finish_date || '',
          });

          // Reset optional details data
          setOptionalDetailsData({
            typeOfProperty: property_type ? property_type.toLowerCase() : '',
            ageOfProperty: age_of_property || '',
            approxSqft: approx_sq_ft ? approx_sq_ft.toString() : '',
            notificationStyle: notification_style || 'Email',
            dailyWorkStart: daily_work_start_time || '',
            dailyWorkEnd: daily_work_end_time || '',
            ownerPresent: owner_present_need ? 'Yes' : 'No',
            weekendWork: weekend_work ? 'Yes' : 'No',
            animals: has_animals ? 'Yes' : 'No',
            petType: pet_type || '',
          });

          // Reset project type data
          setProjectTypeData({
            selectedType: category_id ? category_id.toString() : '',
          });
        }
      } catch (err) {
        setError(HOME_OWNER_MESSAGES.JOB_FETCH_ERROR);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [uuid]);

  // Navigation handlers
  const goToGeneral = () => setStep(WIZARD_STEPS.GENERAL);
  const goToOptional = () => setStep(WIZARD_STEPS.OPTIONAL);
  const goToProjectType = () => setStep(WIZARD_STEPS.PROJECT_TYPE);

  // Form submission handlers
  const handleGeneralInfoSubmit = (data: GeneralInfoData) => {
    setGeneralInfoData(data);
    if (jobBoxesStep === JOB_BOXES_STEPS.FIRST) {
      // Submit only general info
      handleFinalSubmit({ generalInfo: data });
    } else {
      goToOptional();
    }
  };

  const handleOptionalDetailsSubmit = (data: OptionalDetailsData) => {
    setOptionalDetailsData(data);
    if (jobBoxesStep === JOB_BOXES_STEPS.SECOND) {
      // Submit general + optional info
      handleFinalSubmit({
        generalInfo: generalInfoData!,
        optionalDetails: data,
      });
    } else {
      goToProjectType();
    }
  };

  const handleOptionalDetailsSkip = () => {
    if (jobBoxesStep === JOB_BOXES_STEPS.SECOND) {
      // Submit only general info (skip optional)
      handleFinalSubmit({ generalInfo: generalInfoData! });
    } else {
      goToProjectType();
    }
  };

  const handleProjectTypeSubmit = (data: ProjectTypeData) => {
    setProjectTypeData(data);
    // Submit all data
    handleFinalSubmit({
      generalInfo: generalInfoData!,
      optionalDetails: optionalDetailsData!,
      projectType: data,
    });
  };

  const handleFinalSubmit = async (allData: HomeOwnerFormData) => {
    try {
      // Prepare API payload
      const payload: any = {};

      // Map general info data
      if (allData.generalInfo) {
        const {
          fullName,
          email,
          phone,
          address,
          budget,
          contractor,
          projectStartDate,
          projectFinishDate,
        } = allData.generalInfo;

        payload.client_name = fullName || '';
        payload.client_email = email || '';
        payload.client_phone_number = phone || '';
        payload.client_address = address || '';
        payload.budget = parseFloat(budget?.replace(/[^0-9.]/g, '')) || 0;
        payload.preferred_contractor = Number(contractor) || null;

        // Handle dates
        if (projectStartDate) {
          payload.project_start_date = new Date(projectStartDate)
            .toISOString()
            .split('T')[0];
        }
        if (projectFinishDate) {
          payload.project_finish_date = new Date(projectFinishDate)
            .toISOString()
            .split('T')[0];
        }
      }

      // Map optional details data
      if (allData.optionalDetails) {
        const {
          typeOfProperty,
          ageOfProperty,
          approxSqft,
          notificationStyle,
          dailyWorkStart,
          dailyWorkEnd,
          ownerPresent,
          weekendWork,
          animals,
          petType,
        } = allData.optionalDetails;

        payload.property_type = typeOfProperty?.toUpperCase() || 'RESIDENTIAL';
        payload.age_of_property = ageOfProperty || '';
        payload.approx_sq_ft =
          parseInt(approxSqft?.replace(/[^0-9]/g, '')) || 0;
        payload.notification_style = notificationStyle || 'Email';
        payload.daily_work_start_time = dailyWorkStart || '';
        payload.daily_work_end_time = dailyWorkEnd || '';
        payload.owner_present_need = ownerPresent === 'Yes';
        payload.weekend_work = weekendWork === 'Yes';
        payload.has_animals = animals === 'Yes';
        payload.pet_type = petType || '';
      }

      // Map project type data
      if (allData.projectType) {
        const { selectedType } = allData.projectType;
        payload.category_id = Number(selectedType) || null;
      }

      // Add existing job data if available
      if (jobData) {
        const {
          company_id,
          client_id,
          job_image,
          project_name,
          latitude,
          longitude,
          job_status,
          job_privacy,
          status,
        } = jobData;

        payload.company_id = Number(company_id) || null;
        payload.client_id = client_id || null;
        payload.job_image = job_image || '';
        payload.project_name = project_name || '';
        payload.latitude = latitude || '';
        payload.longitude = longitude || '';
        payload.job_status = job_status || 'PENDING';
        payload.job_privacy = job_privacy || 'PUBLIC';
        payload.status = status || 'ACTIVE';
      }

      payload.job_boxes_step = jobBoxesStep;

      // Call the API using apiService
      const response = await apiService.updateJob(uuid, payload);

      // Show success toast with API response message
      if (response && response.message) {
        showSuccessToast(response.message);
        router.push('/job-management');
      } else {
        showSuccessToast(HOME_OWNER_MESSAGES.FORM_SUBMIT_SUCCESS);
      }

      // Redirect to job management page after a short delay
    } catch (error: any) {
      // Show error toast with API response message
      if (error && error.message) {
        showErrorToast(error.message);
      } else {
        showErrorToast(HOME_OWNER_MESSAGES.FORM_SUBMIT_ERROR);
      }
    } finally {
    }
  };

  // Get job boxes step from job data
  const jobBoxesStep = jobData?.job_boxes_step || JOB_BOXES_STEPS.THIRD;

  // Progress indicator logic based on job_boxes_step
  const getSteps = () => {
    switch (jobBoxesStep) {
      case JOB_BOXES_STEPS.FIRST:
        return [];
      case JOB_BOXES_STEPS.SECOND:
        return [
          {
            key: WIZARD_STEPS.GENERAL,
            label: HOME_OWNER_MESSAGES.GENERAL_INFO_LABEL,
          },
          {
            key: WIZARD_STEPS.OPTIONAL,
            label: HOME_OWNER_MESSAGES.OPTIONAL_DETAILS_LABEL,
          },
        ];
      case JOB_BOXES_STEPS.THIRD:
      default:
        return [
          {
            key: WIZARD_STEPS.GENERAL,
            label: HOME_OWNER_MESSAGES.GENERAL_INFO_LABEL,
          },
          {
            key: WIZARD_STEPS.OPTIONAL,
            label: HOME_OWNER_MESSAGES.OPTIONAL_DETAILS_LABEL,
          },
          {
            key: WIZARD_STEPS.PROJECT_TYPE,
            label: HOME_OWNER_MESSAGES.PROJECT_TYPE_LABEL,
          },
        ];
    }
  };

  const steps = getSteps();
  const stepIndex = steps.findIndex(({ key }) => key === step);
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
              <div className='text-lg text-gray-600'>
                {HOME_OWNER_MESSAGES.LOADING_JOB_DATA}
              </div>
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
            {jobBoxesStep !== JOB_BOXES_STEPS.FIRST && steps.length > 0 && (
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
            {step === WIZARD_STEPS.GENERAL && (
              <StepGeneralInfo
                onNext={handleGeneralInfoSubmit}
                defaultValues={generalInfoData}
                isLastStep={jobBoxesStep === JOB_BOXES_STEPS.FIRST}
              />
            )}
            {step === WIZARD_STEPS.OPTIONAL && (
              <StepOptionalDetails
                onPrev={goToGeneral}
                {...(jobBoxesStep === JOB_BOXES_STEPS.THIRD && {
                  onSkip: handleOptionalDetailsSkip,
                })}
                onNext={handleOptionalDetailsSubmit}
                cancelButtonClass={cancelButtonClass}
                defaultValues={optionalDetailsData}
                isLastStep={jobBoxesStep === JOB_BOXES_STEPS.SECOND}
              />
            )}
            {step === WIZARD_STEPS.PROJECT_TYPE &&
              jobBoxesStep === JOB_BOXES_STEPS.THIRD && (
                <StepProjectType
                  onPrev={goToOptional}
                  onSubmit={handleProjectTypeSubmit}
                  cancelButtonClass={cancelButtonClass}
                  defaultValues={projectTypeData as any}
                  isLastStep={true}
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
