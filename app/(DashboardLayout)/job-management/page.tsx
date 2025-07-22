'use client';
import { IconFlag } from '@tabler/icons-react';
import { Profile2User } from 'iconsax-react';
import { DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FlagHookIcon } from '../../../components/icons/FalgHookIcon';
import { JobCard } from '../../../components/shared/cards/JobCard';
import { StatsCard } from '../../../components/shared/cards/StatsCard';
import NoDataFound from '../../../components/shared/common/NoDataFound';
import SideSheet from '../../../components/shared/common/SideSheet';
import { CreateJobForm } from '../../../components/shared/forms/CreateJobForm';
import JobManagementPageSkeleton from '../../../components/shared/skeleton/JobManagementPageSkeleton';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { ScrollArea, ScrollBar } from '../../../components/ui/scroll-area';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';
import { getUserPermissionsFromStorage } from '../../../lib/utils';

// Mock data for demonstration
const mockStats = [
  {
    id: '1',
    icon: Profile2User,
    value: '24',
    label: 'Total Jobs',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    id: '2',
    icon: DollarSign,
    value: '$12,450',
    label: 'Total Revenue',
    iconColor: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  {
    id: '3',
    icon: IconFlag,
    value: '8',
    label: 'Active Jobs',
    iconColor: 'text-orange-500',
    bgColor: 'bg-orange-100',
  },
];

const mockJobs = [
  {
    id: '1',
    title: 'Kitchen Renovation',
    jobId: 'JOB-001',
    progress: 75,
    image: '/images/img-placeholder-md.png',
    email: 'client@example.com',
    address: '123 Main St, City',
    startDate: '2024-01-15',
    daysLeft: 5,
  },
  {
    id: '2',
    title: 'Bathroom Remodel',
    jobId: 'JOB-002',
    progress: 45,
    image: '/images/img-placeholder-md.png',
    email: 'client2@example.com',
    address: '456 Oak Ave, Town',
    startDate: '2024-01-20',
    daysLeft: 12,
  },
  {
    id: '3',
    title: 'Living Room Painting',
    jobId: 'JOB-003',
    progress: 90,
    image: '/images/img-placeholder-md.png',
    email: 'client3@example.com',
    address: '789 Pine Rd, Village',
    startDate: '2024-01-10',
    daysLeft: 2,
  },
];

export default function JobManagement() {
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('info');

  // Get user permissions for jobs
  const userPermissions = getUserPermissionsFromStorage();
  const canEdit = userPermissions?.jobs?.edit;

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <JobManagementPageSkeleton />;
  }

  return (
    <div className=''>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 xl:gap-6 mb-4 xl:mb-8'>
        {mockStats.map(({ id, icon, value, label, iconColor, bgColor }) => (
          <StatsCard
            key={id}
            icon={icon}
            value={value}
            label={label}
            iconColor={iconColor}
            bgColor={bgColor}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className='bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-6'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
          <div className='flex items-center gap-3'>
            <FlagHookIcon className='w-6 h-6 text-[var(--text-dark)]' />
            <h2 className='text-xl font-semibold text-[var(--text-dark)]'>
              Job Overview
            </h2>
            <Badge className='bg-[var(--secondary)] text-white px-3 py-1 rounded-full text-sm'>
              {mockJobs.length} Jobs
            </Badge>
          </div>
          {canEdit && (
            <div className='flex justify-end'>
              <Button
                variant='ghost'
                className='btn-primary !h-[48px] hover:text-white'
                onClick={() => setIsOpen(true)}
              >
                Create Job
              </Button>
            </div>
          )}
        </div>

        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className='w-full'
        >
          <ScrollArea className='w-full max-w-full flex-1 rounded-full mb-4'>
            <TabsList className='flex flex-row justify-start h-full w-fit bg-[var(--dark-background)] rounded-full min-w-max whitespace-nowrap'>
              <TabsTrigger
                value='info'
                className='px-4 py-2 text-sm xl:text-base gap-3 transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Need Attention{' '}
                <Badge
                  className={`py-[4px] px-[8px] text-sm font-medium rounded-lg ${selectedTab === 'info' ? 'bg-sidebarpurple text-white' : 'bg-transparent text-sidebarpurple'}`}
                >
                  8
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value='newLeads'
                className='px-8 py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                New Leads
                <Badge
                  className={`py-[4px] px-[8px] text-sm font-medium rounded-lg ${selectedTab === 'newLeads' ? 'bg-limebrand text-white' : 'bg-transparent text-limebrand'}`}
                >
                  8
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value='ongoingJob'
                className='px-8 py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Ongoing Job
                <Badge
                  className={`py-[4px] px-[8px] text-sm font-medium rounded-lg ${selectedTab === 'ongoingJob' ? 'bg-yellowbrand text-white' : 'bg-transparent text-yellowbrand'}`}
                >
                  8
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value='waitingOnClient'
                className='px-8 py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Waiting on Client
                <Badge
                  className={`py-[4px] px-[8px] text-sm font-medium rounded-lg ${selectedTab === 'waitingOnClient' ? 'bg-yellowbrand text-white' : 'bg-transparent text-yellowbrand'}`}
                >
                  8
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value='archive'
                className='px-8 py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                Archive
                <Badge
                  className={`py-[4px] px-[8px] text-sm font-medium rounded-lg ${selectedTab === 'archive' ? 'bg-graybrand text-white' : 'bg-transparent text-graybrand'}`}
                >
                  8
                </Badge>
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation='horizontal' />
          </ScrollArea>

          <TabsContent value='info' className='pt-4 xl:pt-8'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6'>
              {mockJobs.map(({ id, ...jobProps }) => (
                <JobCard key={id} job={{ id, ...jobProps }} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value='newLeads' className='p-8'>
            <NoDataFound buttonText='Create Job' />
          </TabsContent>
          <TabsContent value='ongoingJob' className='p-8'>
            <NoDataFound buttonText='Create Job' />
          </TabsContent>
          <TabsContent value='waitingOnClient' className='p-8'>
            <NoDataFound buttonText='Create Job' />
          </TabsContent>
          <TabsContent value='archive' className='p-8'>
            <NoDataFound buttonText='Create Job' />
          </TabsContent>
        </Tabs>
      </div>
      <SideSheet open={isOpen} onOpenChange={setIsOpen} title='Create Job'>
        <CreateJobForm />
      </SideSheet>
    </div>
  );
}
