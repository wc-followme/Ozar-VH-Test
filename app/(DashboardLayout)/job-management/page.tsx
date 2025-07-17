'use client';
import { IconFlag } from '@tabler/icons-react';
import { Profile2User } from 'iconsax-react';
import { DollarSign } from 'lucide-react';
import { useState } from 'react';
import { FlagHookIcon } from '../../../components/icons/FalgHookIcon';
import { JobCard } from '../../../components/shared/cards/JobCard';
import { StatsCard } from '../../../components/shared/cards/StatsCard';
import ComingSoon from '../../../components/shared/common/ComingSoon';
import SideSheet from '../../../components/shared/common/SideSheet';
import { CreateJobForm } from '../../../components/shared/forms/CreateJobForm';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';

// Mock data for jobs
const mockJobs = [
  {
    id: '1',
    title: 'Downtown Residence',
    jobId: 'Job#789',
    progress: 50,
    image:
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    email: 'tanya.hill@example.com',
    address: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
    startDate: '15 Mar 2025',
    daysLeft: 96,
  },
  {
    id: '2',
    title: 'Maple Grove House',
    jobId: 'Job#789',
    progress: 70,
    image:
      'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    email: 'tanya.hill@example.com',
    address: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
    startDate: '15 Mar 2025',
    daysLeft: 96,
  },
  {
    id: '3',
    title: 'Whispering Pines Lodge',
    jobId: 'Job#789',
    progress: 90,
    image:
      'https://images.pexels.com/photos/1396129/pexels-photo-1396129.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    email: 'tanya.hill@example.com',
    address: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
    startDate: '15 Mar 2025',
    daysLeft: 96,
  },
  {
    id: '4',
    title: 'Sunnyvale Cottage',
    jobId: 'Job#789',
    progress: 20,
    image:
      'https://images.pexels.com/photos/1396125/pexels-photo-1396125.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    email: 'tanya.hill@example.com',
    address: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
    startDate: '15 Mar 2025',
    daysLeft: 96,
  },
  {
    id: '5',
    title: 'Cedar Hill Retreat',
    jobId: 'Job#789',
    progress: 50,
    image:
      'https://images.pexels.com/photos/1396127/pexels-photo-1396127.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    email: 'tanya.hill@example.com',
    address: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
    startDate: '15 Mar 2025',
    daysLeft: 96,
  },
  {
    id: '6',
    title: 'Silver Birch Manor',
    jobId: 'Job#789',
    progress: 50,
    image:
      'https://images.pexels.com/photos/1396131/pexels-photo-1396131.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    email: 'tanya.hill@example.com',
    address: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
    startDate: '15 Mar 2025',
    daysLeft: 96,
  },
  {
    id: '7',
    title: 'Rosewood Villa',
    jobId: 'Job#789',
    progress: 50,
    image:
      'https://images.pexels.com/photos/1396128/pexels-photo-1396128.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    email: 'tanya.hill@example.com',
    address: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
    startDate: '15 Mar 2025',
    daysLeft: 96,
  },
  {
    id: '8',
    title: 'Lakeside Haven',
    jobId: 'Job#789',
    progress: 50,
    image:
      'https://images.pexels.com/photos/1396130/pexels-photo-1396130.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    email: 'tanya.hill@example.com',
    address: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
    startDate: '15 Mar 2025',
    daysLeft: 96,
  },
];

export default function JobManagement() {
  const [selectedTab, setSelectedTab] = useState('info');
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className=''>
      <div className=''>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 xl:gap-6 mb-8'>
          {stats.map(({ id, icon, value, label, iconColor, bgColor }) => (
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

        {/* Jobs Grid */}
        <div>
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className='w-full'
          >
            <div className='flex items-center gap-2 w-full'>
              <TabsList className='flex w-fit bg-[var(--dark-background)] p-1 rounded-[30px] h-auto font-normal justify-start flex-wrap max-w-fit'>
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
                  className='px-8  py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
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
                  className='px-8  py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
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
                  className='px-8  py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
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
                  className='px-8  py-2 text-sm xl:text-base gap-3 text-[var(--text-dark)] transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
                >
                  Archive
                  <Badge
                    className={`py-[4px] px-[8px] text-sm font-medium rounded-lg ${selectedTab === 'archive' ? 'bg-graybrand text-white' : 'bg-transparent text-graybrand'}`}
                  >
                    8
                  </Badge>
                </TabsTrigger>
              </TabsList>
              <Button
                variant='ghost'
                className='btn-primary !h-[48px] ml-auto hover:text-white'
                onClick={() => setIsOpen(true)}
              >
                Create Job
              </Button>
            </div>
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
      </div>
      <SideSheet open={isOpen} onOpenChange={setIsOpen} title='Create Job'>
        <CreateJobForm />
      </SideSheet>
    </div>
  );
}
