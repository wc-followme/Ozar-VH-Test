'use client';
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

// Mock data for demonstration
const mockStats = [
  {
    icon: Profile2User,
    value: '24',
    label: 'Total Jobs',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    icon: DollarSign,
    value: '$12,450',
    label: 'Total Revenue',
    iconColor: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  {
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
    <div className='w-full'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {mockStats.map((stat, index) => (
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

      {/* Main Content */}
      <div className='bg-[var(--card-background)] rounded-[20px] border border-[var(--border-dark)] p-6'>
        <div className='flex items-center justify-between mb-6'>
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
            <Button
              variant='ghost'
              className='btn-primary !h-[48px] ml-auto hover:text-white'
              onClick={() => setIsOpen(true)}
            >
              Create Job
            </Button>
          )}
        </div>
        <Tabs defaultValue='info' className='w-full'>
          <TabsList className='grid w-full grid-cols-5'>
            <TabsTrigger value='info'>Info</TabsTrigger>
            <TabsTrigger value='newLeads'>New Leads</TabsTrigger>
            <TabsTrigger value='ongoingJob'>Ongoing Job</TabsTrigger>
            <TabsTrigger value='waitingOnClient'>Waiting on Client</TabsTrigger>
            <TabsTrigger value='archive'>Archive</TabsTrigger>
          </TabsList>
          <TabsContent value='info' className='pt-8'>
            <div className='grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6'>
              {mockJobs.map(({ id, ...jobProps }) => (
                <JobCard key={id} job={{ id, ...jobProps }} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value='newLeads' className='p-8'>
            <ComingSoon />
          </TabsContent>
          <TabsContent value='ongoingJob' className='p-8'>
            <ComingSoon />
          </TabsContent>
          <TabsContent value='waitingOnClient' className='p-8'>
            <ComingSoon />
          </TabsContent>
          <TabsContent value='archive' className='p-8'>
            <ComingSoon />
          </TabsContent>
        </Tabs>
      </div>
      <SideSheet open={isOpen} onOpenChange={setIsOpen} title='Create Job'>
        <CreateJobForm />
      </SideSheet>
    </div>
  );
}
