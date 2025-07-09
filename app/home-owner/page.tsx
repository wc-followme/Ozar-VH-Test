'use client';

import { StepGeneralInfo } from '@/components/shared/forms/StepGeneralInfo';
import { StepOptionalDetails } from '@/components/shared/forms/StepOptionalDetails';
import { StepProjectType } from '@/components/shared/forms/StepProjectType';
import { useState } from 'react';
import { HomeOwnerHeader } from '../../components/layout/HomeOwnerHeader';

export default function HomeOwnerWizardPage() {
  // Wizard step state
  const [step, setStep] = useState<'general' | 'optional' | 'projectType'>(
    'general'
  );

  // Step 1: General Info state
  const [projectStart, setProjectStart] = useState<Date | undefined>();
  const [projectFinish, setProjectFinish] = useState<Date | undefined>();
  const [emails, setEmails] = useState(['']);
  const [phones, setPhones] = useState(['']);
  const [contractor, setContractor] = useState('any');
  const handleAddEmail = () => setEmails([...emails, '']);
  const handleEmailChange = (idx: number, value: string) =>
    setEmails(emails.map((e, i) => (i === idx ? value : e)));
  const handleAddPhone = () => setPhones([...phones, '']);
  const handlePhoneChange = (idx: number, value: string) =>
    setPhones(phones.map((p, i) => (i === idx ? value : p)));

  // Step 2: Optional Details state
  const [typeOfProperty, setTypeOfProperty] = useState('Residential');
  const [ageOfProperty, setAgeOfProperty] = useState('20 years');
  const [approxSqft, setApproxSqft] = useState('2500 Sq / Ft');
  const [notificationStyle, setNotificationStyle] = useState('Email');
  const [dailyWorkStart, setDailyWorkStart] = useState('');
  const [dailyWorkEnd, setDailyWorkEnd] = useState('');
  const [ownerPresent, setOwnerPresent] = useState('No');
  const [weekendWork, setWeekendWork] = useState('Yes');
  const [animals, setAnimals] = useState('Yes');
  const [petType, setPetType] = useState('Dog');

  // Step 3: Project Type state
  const [selectedType, setSelectedType] = useState('full_home');

  // Navigation handlers
  const goToGeneral = () => setStep('general');
  const goToOptional = () => setStep('optional');
  const goToProjectType = () => setStep('projectType');

  // Progress indicator logic
  const steps = [
    { key: 'general', label: 'General Info' },
    { key: 'optional', label: 'Optional Details' },
    { key: 'projectType', label: 'Project Type' },
  ];
  const stepIndex = steps.findIndex(s => s.key === step);
  const totalSteps = steps.length;

  // Cancel/Previous button class
  const cancelButtonClass =
    'h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)] flex items-center';

  return (
    <div className='min-h-screen bg-[var(--white-background)] flex flex-col items-center'>
      <HomeOwnerHeader />
      {/* Centered content with background */}
      <div className='mt-auto'>
        <div className=''>
          <div className='w-[90vw] mx-auto flex flex-col items-center bg-[var(--background)] min-h-[calc(100vh-100px)] rounded-tl-[32px] rounded-tr-[32px] px-4 md:px-12 py-8 md:py-16 shadow-none'>
            {/* Custom Progress Bar */}
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
            {/* Wizard Steps */}
            {step === 'general' && (
              <StepGeneralInfo
                projectStart={projectStart}
                setProjectStart={setProjectStart}
                projectFinish={projectFinish}
                setProjectFinish={setProjectFinish}
                emails={emails}
                setEmails={setEmails}
                handleAddEmail={handleAddEmail}
                handleEmailChange={handleEmailChange}
                phones={phones}
                setPhones={setPhones}
                handleAddPhone={handleAddPhone}
                handlePhoneChange={handlePhoneChange}
                contractor={contractor}
                setContractor={setContractor}
                onNext={goToOptional}
              />
            )}
            {step === 'optional' && (
              <StepOptionalDetails
                typeOfProperty={typeOfProperty}
                setTypeOfProperty={setTypeOfProperty}
                ageOfProperty={ageOfProperty}
                setAgeOfProperty={setAgeOfProperty}
                approxSqft={approxSqft}
                setApproxSqft={setApproxSqft}
                notificationStyle={notificationStyle}
                setNotificationStyle={setNotificationStyle}
                dailyWorkStart={dailyWorkStart}
                setDailyWorkStart={setDailyWorkStart}
                dailyWorkEnd={dailyWorkEnd}
                setDailyWorkEnd={setDailyWorkEnd}
                ownerPresent={ownerPresent}
                setOwnerPresent={setOwnerPresent}
                weekendWork={weekendWork}
                setWeekendWork={setWeekendWork}
                animals={animals}
                setAnimals={setAnimals}
                petType={petType}
                setPetType={setPetType}
                onPrev={goToGeneral}
                onSkip={goToProjectType}
                onNext={goToProjectType}
                cancelButtonClass={cancelButtonClass}
              />
            )}
            {step === 'projectType' && (
              <StepProjectType
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                onPrev={goToOptional}
                onSubmit={() => {}}
                cancelButtonClass={cancelButtonClass}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
