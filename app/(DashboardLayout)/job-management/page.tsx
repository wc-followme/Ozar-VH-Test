'use client';
import NoDataFound from '@/components/shared/common/NoDataFound';
import { useToast } from '@/components/ui/use-toast';
import { CommonStatus, JobFilterType } from '@/constants/common';
import { apiService } from '@/lib/api';
import { IconFlag } from '@tabler/icons-react';
import { Profile2User } from 'iconsax-react';
import { DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FlagHookIcon } from '../../../components/icons/FalgHookIcon';
import { JobCard } from '../../../components/shared/cards/JobCard';
import { StatsCard } from '../../../components/shared/cards/StatsCard';
import ComingSoon from '../../../components/shared/common/ComingSoon';
import SideSheet from '../../../components/shared/common/SideSheet';
import { CreateJobForm } from '../../../components/shared/forms/CreateJobForm';
import JobManagementPageSkeleton from '../../../components/shared/skeleton/JobManagementPageSkeleton';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';
import { getUserPermissionsFromStorage } from '../../../lib/utils';
import { JOB_MESSAGES } from './job-messages';
import {
  CreateJobFormData,
  CreateJobRequest,
  Job,
  JobFilterCounts,
} from './types';

export default function JobManagement() {
  const [selectedTab, setSelectedTab] = useState('newLeads');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]); // Replace mockJobs
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const { showSuccessToast, showErrorToast } = useToast();

  // State for filter counts
  const [filterCounts, setFilterCounts] = useState<JobFilterCounts>({
    all: 0,
    need_attention: 0,
    new_leads: 0,
    ongoing_jobs: 0,
    waiting_on_client: 0,
    archived: 0,
  });

  // Function to fetch filter counts
  const fetchFilterCounts = async () => {
    try {
      const response = await apiService.fetchJobStatistics();
      if (response.data) {
        setFilterCounts(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching filter counts:', error);
    }
  };

  // Get user permissions for jobs
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.jobs?.edit;
  // Function to fetch jobs based on selected tab
  const fetchJobsByTab = async (tab: string) => {
    try {
      setLoading(true);
      const params: any = {
        page: 1,
        limit: 10,
      };

      // Set parameters based on selected tab
      switch (tab) {
        case 'newLeads':
          params.status = CommonStatus.ACTIVE;
          params.type = JobFilterType.NEW_LEADS;
          break;
        case 'info':
          return;
        // params.status = CommonStatus.ACTIVE;
        // params.type = JobFilterType.NEED_ATTENTION;
        // break;
        case 'ongoingJob':
          return;
        // params.status = CommonStatus.ACTIVE;
        // params.type = JobFilterType.ONGOING;
        // break;
        case 'waitingOnClient':
          return;
        // params.status = CommonStatus.ACTIVE;
        // params.type = JobFilterType.WAITING_ON_CLIENT;
        // break;
        case 'archive':
          params.status = CommonStatus.INACTIVE;
          params.type = JobFilterType.ALL;
          break;
        default:
          params.status = CommonStatus.ACTIVE;
          params.type = JobFilterType.ALL;
      }

      const response = await apiService.fetchJobs(params);
      setJobs(
        Array.isArray(response.data) ? response.data : response.data?.data || []
      );
    } catch (error: any) {
      showErrorToast(error?.message || JOB_MESSAGES.FETCH_ERROR);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch filter counts on mount
  useEffect(() => {
    fetchFilterCounts();
  }, []);

  // Effect to fetch jobs when selected tab changes
  useEffect(() => {
    fetchJobsByTab(selectedTab);
  }, [selectedTab]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    fetchJobsByTab(value);
  };

  // Handle job creation
  const handleCreateJob = async (data: CreateJobFormData) => {
    setIsSubmitting(true);
    try {
      // Prepare job_boxes_step with automatic logic
      let jobBoxesStep = '';
      if (
        Array.isArray(data.job_boxes_step) &&
        data.job_boxes_step.length > 0
      ) {
        if (data.job_boxes_step.length === 1) {
          jobBoxesStep = 'FIRST';
        } else if (data.job_boxes_step.length === 2) {
          jobBoxesStep = 'SECOND';
        } else if (data.job_boxes_step.length === 3) {
          jobBoxesStep = 'THIRD';
        }
      }

      // Prepare payload for API
      const payload: CreateJobRequest = {
        client_name: data.client_name,
        client_email: data.client_email,
        client_phone_number: data.client_phone_number,
        job_boxes_step: jobBoxesStep,
        job_privacy: data.job_privacy,
      };

      // Only include client_id if it has a value
      if (
        data.client_id !== undefined &&
        data.client_id !== null &&
        data.client_id !== ''
      ) {
        // Convert string to number if needed
        payload.client_id =
          typeof data.client_id === 'string'
            ? parseInt(data.client_id, 10)
            : data.client_id;
      }

      // Call API using apiService
      const response = await apiService.createJob(payload);

      if (response.data) {
        // Generate home-owner link with job UUID
        const jobUuid = response.data?.uuid || response.data?.id;
        const homeOwnerLink = jobUuid
          ? `http://localhost:3000/home-owner/${jobUuid}`
          : null;

        showSuccessToast(response.message || JOB_MESSAGES.CREATE_SUCCESS);

        // Set the generated link
        if (homeOwnerLink) {
          setGeneratedLink(homeOwnerLink);
          console.log('Home Owner Link:', homeOwnerLink);
        }
        if (data.job_boxes_step.length === 0) {
          setIsOpen(false);
        }
        // Refresh jobs and counts after successful creation
        fetchJobsByTab(selectedTab);
        fetchFilterCounts();
      } else {
        showErrorToast(response.message || JOB_MESSAGES.CREATE_ERROR);
      }
    } catch (err: any) {
      showErrorToast(err?.message || JOB_MESSAGES.CREATE_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    {
      id: 'active-projects',
      icon: FlagHookIcon,
      value: '24',
      label: 'Active Projects',
      iconColor: 'text-[#EBB402]',
      bgColor: 'bg-[#EBB4021A]',
    },
    {
      id: 'completed',
      icon: IconFlag,
      value: '18',
      label: 'Completed',
      iconColor: 'text-[#00A8BF]',
      bgColor: 'bg-[#1A57BF1A]',
    },
    {
      id: 'revenue',
      icon: DollarSign,
      value: '$2.4M',
      label: 'Revenue',
      iconColor: 'text-[#90C91D]',
      bgColor: 'bg-[#31A31D1A]',
    },
    {
      id: 'team-member',
      icon: Profile2User,
      value: '32',
      label: 'Team Member',
      iconColor: 'text-[#F58B1E]',
      bgColor: 'bg-[#F58B1E1A]',
    },
  ];
  if (loading) {
    return <JobManagementPageSkeleton />;
  }
  return (
    <div className='w-full'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            iconColor={stat.iconColor}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      {/* Jobs Grid */}
      <div>
        <Tabs
          value={selectedTab}
          onValueChange={handleTabChange}
          className='w-full'
        >
          <div className='flex items-center gap-2 w-full'>
            <TabsList className='flex w-fit bg-[var(--dark-background)] p-1 rounded-[30px] h-auto font-normal justify-start flex-wrap max-w-fit'>
              <TabsTrigger
                value='newLeads'
                className='px-8  py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                New Leads
                <Badge
                  className={`py-[4px] px-[8px] text-sm font-medium rounded-lg ${selectedTab === 'newLeads' ? 'bg-limebrand text-white' : 'bg-transparent text-limebrand'}`}
                >
                  {filterCounts.new_leads}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value='info'
                className='px-4 py-2 text-sm xl:text-base gap-3 transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Need Attention{' '}
                <Badge
                  className={`py-[4px] px-[8px] text-sm font-medium rounded-lg ${selectedTab === 'info' ? 'bg-sidebarpurple text-white' : 'bg-transparent text-sidebarpurple'}`}
                >
                  {filterCounts.need_attention}
                </Badge>
              </TabsTrigger>

              <TabsTrigger
                value='ongoingJob'
                className='px-8  py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Ongoing Job
                <Badge
                  className={`py-[4px] px-[8px] text-sm font-medium rounded-lg ${selectedTab === 'ongoingJob' ? 'bg-yellowbrand text-white' : 'bg-transparent text-yellowbrand'}`}
                >
                  {filterCounts.ongoing_jobs}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value='waitingOnClient'
                className='px-8  py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Waiting on Client
                <Badge
                  className={`py-[4px] px-[8px] text-sm font-medium rounded-lg ${selectedTab === 'waitingOnClient' ? 'bg-yellowbrand text-white' : 'bg-transparent text-yellowbrand'}`}
                >
                  {filterCounts.waiting_on_client}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value='archive'
                className='px-8  py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Archive
                <Badge
                  className={`py-[4px] px-[8px] text-sm font-medium rounded-lg ${selectedTab === 'archive' ? 'bg-graybrand text-white' : 'bg-transparent text-graybrand'}`}
                >
                  {filterCounts.archived}
                </Badge>
              </TabsTrigger>
            </TabsList>
            {canEdit && (
              <Button
                variant='ghost'
                className='btn-primary !h-[48px] ml-auto hover:text-white'
                onClick={() => setIsOpen(true)}
              >
                {JOB_MESSAGES.ADD_JOB_BUTTON}
              </Button>
            )}
          </div>
          <TabsContent value='newLeads' className='pt-8'>
            {jobs.length === 0 ? (
              <NoDataFound
                description={JOB_MESSAGES.NO_JOBS_FOUND_DESCRIPTION}
                buttonText={JOB_MESSAGES.ADD_JOB_BUTTON}
                onButtonClick={() => setIsOpen(true)}
              />
            ) : (
              <div className='grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6'>
                {jobs.map((job: Job) => (
                  <JobCard
                    key={job.id}
                    job={{
                      id: job.uuid,
                      title: job.client_name || 'Project Name',
                      jobId: job.project_id || 'Job#789',
                      progress: 50, // Static value since not in API
                      image:
                        job.job_image ||
                        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
                      email: job.client_email || 'tanya.hill@example.com',
                      address:
                        job.client_address ||
                        '2972 Westheimer Rd. Santa Ana, Illinois 85486',
                      startDate: job.project_start_date
                        ? new Date(job.project_start_date).toLocaleDateString()
                        : '15 Mar 2025',
                      daysLeft: 96, // Static value since not in API
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value='info' className='pt-8'>
            <ComingSoon />
          </TabsContent>

          <TabsContent value='ongoingJob' className='p-8'>
            <ComingSoon />
          </TabsContent>
          <TabsContent value='waitingOnClient' className='p-8'>
            <ComingSoon />
          </TabsContent>
          <TabsContent value='archive' className='pt-8'>
            {jobs.length === 0 ? (
              <NoDataFound
                description={JOB_MESSAGES.NO_JOBS_FOUND_DESCRIPTION}
                buttonText={JOB_MESSAGES.ADD_JOB_BUTTON}
                onButtonClick={() => setIsOpen(true)}
              />
            ) : (
              <div className='grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6'>
                {jobs.map((job: Job) => (
                  <JobCard
                    key={job.id}
                    job={{
                      id: job.uuid,
                      title: job.client_name || 'Project Name',
                      jobId: job.project_id || 'Job#789',
                      progress: 50, // Static value since not in API
                      image:
                        job.job_image ||
                        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
                      email: job.client_email || 'tanya.hill@example.com',
                      address:
                        job.client_address ||
                        '2972 Westheimer Rd. Santa Ana, Illinois 85486',
                      startDate: job.project_start_date
                        ? new Date(job.project_start_date).toLocaleDateString()
                        : '15 Mar 2025',
                      daysLeft: 96, // Static value since not in API
                    }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <SideSheet
        open={isOpen}
        onOpenChange={open => {
          setIsOpen(open);
          if (open) {
            setGeneratedLink(''); // Clear generated link when opening form
          }
        }}
        title={JOB_MESSAGES.ADD_JOB_TITLE}
      >
        <CreateJobForm
          onSubmit={handleCreateJob}
          isSubmitting={isSubmitting}
          generatedLink={generatedLink}
        />
      </SideSheet>
    </div>
  );
}
