'use client';
import { Search } from '@/components/icons/Search';
import { Breadcrumb, BreadcrumbItem } from '@/components/shared/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { apiService, GetCompanyResponse } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { extractApiErrorMessage, formatDate } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { Add, Edit2, Trash } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { UserCard } from '../../../../../components/shared/cards/UserCard';
import { COMPANY_MESSAGES } from '../../company-messages';

interface CompanyDetailsPageProps {
  params: Promise<{
    uuid: string;
  }>;
}

const breadcrumbData: BreadcrumbItem[] = [
  { name: 'Company Management', href: '/company-management' },
  { name: 'Company Details' }, // current page
];

// Dummy user data
const dummyUsers = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Admin',
    phone: '(555) 123-4567',
    email: 'alex.johnson@example.com',
    image:
      'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 2,
    name: 'Maria Smith',
    role: 'Contractor',
    phone: '(555) 123-4567',
    email: 'maria.smith@example.com',
    image:
      'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 3,
    name: 'David Brown',
    role: 'Project Manager',
    phone: '(555) 123-4567',
    email: 'david.brown@example.com',
    image:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 4,
    name: 'Sophia Davis',
    role: 'Estimator',
    phone: '(555) 123-4567',
    email: 'sophia.davis@example.com',
    image:
      'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 5,
    name: 'James Wilson',
    role: 'Employee',
    phone: '(555) 123-4567',
    email: 'james.wilson@example.com',
    image:
      'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 6,
    name: 'Olivia Garcia',
    role: 'Employee',
    phone: '(555) 123-4567',
    email: 'olivia.garcia@example.com',
    image:
      'https://images.pexels.com/photos/2625122/pexels-photo-2625122.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 7,
    name: 'Liam Martinez',
    role: 'Employee',
    phone: '(555) 123-4567',
    email: 'liam.martinez@example.com',
    image:
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 8,
    name: 'Emma Rodriguez',
    role: 'Employee',
    phone: '(555) 123-4567',
    email: 'emma.rodriguez@example.com',
    image:
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 9,
    name: 'Noah Hernandez',
    role: 'Employee',
    phone: '(555) 123-4567',
    email: 'noah.hernandez@example.com',
    image:
      'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 10,
    name: 'Ava Lopez',
    role: 'Employee',
    phone: '(555) 123-4567',
    email: 'ava.lopez@example.com',
    image:
      'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 11,
    name: 'Ethan Gonzalez',
    role: 'Employee',
    phone: '(555) 123-4567',
    email: 'ethan.gonzalez@example.com',
    image:
      'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
  {
    id: 12,
    name: 'Isabella Perez',
    role: 'Employee',
    phone: '(555) 123-4567',
    email: 'isabella.perez@example.com',
    image:
      'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    status: true,
  },
];

const CompanyDetails = ({ params }: CompanyDetailsPageProps) => {
  const resolvedParams = React.use(params);
  const [enabled, setEnabled] = useState(true);
  const [selectedTab, setSelectedTab] = useState('about');
  const [filter, setFilter] = useState('all');
  const [company, setCompany] = useState<GetCompanyResponse['data'] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  const [users, setUsers] = useState(dummyUsers);

  const isCompanyApiResponse = (obj: unknown): obj is GetCompanyResponse => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'statusCode' in obj &&
      'data' in obj &&
      typeof (obj as GetCompanyResponse).data === 'object'
    );
  };

  // Fetch company details
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCompanyDetails(
          resolvedParams.uuid
        );

        if (isCompanyApiResponse(response)) {
          setCompany(response.data);
          setEnabled(response.data.status === 'ACTIVE');
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err: unknown) {
        if (handleAuthError(err)) {
          return;
        }
        const errorMessage = extractApiErrorMessage(
          err,
          COMPANY_MESSAGES.FETCH_DETAILS_ERROR
        );
        showErrorToast(errorMessage);
        router.push('/company-management');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [resolvedParams.uuid, router, showErrorToast, handleAuthError]);

  const handleToggleStatus = (id: number) => {
    setUsers(
      users.map(user =>
        user.id === id ? { ...user, status: !user.status } : user
      )
    );
  };
  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    if (filter === 'admin') return user.role === 'Admin';
    if (filter === 'contractor') return user.role === 'Contractor';
    if (filter === 'manager') return user.role === 'Project Manager';
    if (filter === 'employee') return user.role === 'Employee';
    if (filter === 'estimator') return user.role === 'Estimator';
    return true;
  });

  const menuOptions: any = [
    { label: 'Edit', action: 'edit', icon: Edit2 },
    { label: 'Delete', action: 'delete', icon: Trash },
  ];

  const switchStyleSm =
    'h-4 w-9 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-300 [&>span]:h-3 [&>span]:w-3  [&>span]:bg-white data-[state=checked]:[&>span]:border-green-400 [&>span]:transition-all [&>span]:duration-200';
  const selectContentStyle =
    'bg-[var(--white-background)] border border-[var(--secondary)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]';
  const selectItemStyle =
    'text-[var(--text-dark)] hover:bg-[var(--dark-background)] focus:bg-[var(--secondary)] cursor-pointer';

  const [isToggling, setIsToggling] = useState(false);

  // Status toggle handler - same as listing page
  const handleToggle = async () => {
    if (!company) return;

    try {
      setIsToggling(true);

      // Prevent status changes for default companies
      if (company.is_default) {
        showErrorToast(COMPANY_MESSAGES.DEFAULT_COMPANY_STATUS_ERROR);
        return;
      }

      const currentStatus = company.status;
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

      await apiService.updateCompanyStatus(company.uuid, newStatus);

      // Update local state
      setCompany(prev => (prev ? { ...prev, status: newStatus } : null));
      setEnabled(newStatus === 'ACTIVE');

      showSuccessToast(
        `${COMPANY_MESSAGES.STATUS_UPDATE_SUCCESS} Status changed to ${newStatus}.`
      );
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        COMPANY_MESSAGES.STATUS_UPDATE_ERROR
      );
      showErrorToast(message);

      // Revert local state on error
      if (company) {
        setEnabled(company.status === 'ACTIVE');
      }
    } finally {
      setIsToggling(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4'></div>
          <p className='text-gray-600'>{COMPANY_MESSAGES.LOADING}</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <div className='text-center'>
          <p className='text-gray-600'>{COMPANY_MESSAGES.COMPANY_NOT_FOUND}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbData} className='mb-5' />
      <div className='p-6 bg-[var(--white-background)] rounded-[24px]'>
        {/* Header */}
        <div className='flex gap-6'>
          <div className='flex-0 w-[120px]'>
            <div className='w-[120px] h-[120px] p-3 rounded-[16px] border border-[var(--border-dark)] flex items-center justify-center'>
              <Image
                src={
                  company.image
                    ? (process.env['NEXT_PUBLIC_CDN_URL'] || '') + company.image
                    : '/images/company-management/company-img-1.png'
                }
                height={90}
                width={90}
                alt='company'
                className='mx-auto'
              />
            </div>
          </div>
          <div className='flex-1 -mt-[5px]'>
            <div className='flex items-center gap-4 border-b border-[var(--border-dark)] pb-4 mb-4'>
              <div className='flex-1'>
                <h1 className='text-[24px] font-bold text-[var(--text-dark)] leading-7'>
                  {company.name}
                </h1>
                <p className='text-[16px] text-[var(--text-secondary)] mt-0.5'>
                  Construction Company
                </p>
              </div>

              <div className='flex items-center gap-4'>
                <Link href={`/company-management/edit-company/${company.uuid}`}>
                  <Button
                    variant='outline'
                    className='!text-[var(--text-dark)] px-6 h-[40px] rounded-full border-[#D0D5DD] text-[#344054] font-semibold !bg-opacity-20 hover:bg-white'
                  >
                    <Edit2 size='28' color='currentColor' />
                    <span className='text-[var(--text-dark)]'>
                      Edit Details
                    </span>
                  </Button>
                </Link>
                <Link
                  className='h-[42px] px-6 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white text-base inline-flex items-center gap-1'
                  href={'/company-management/add-user'}
                >
                  <Add
                    size='28'
                    color='#fff'
                    className='text-[var(--text-dark)]'
                  />
                  <span>Add User</span>
                </Link>
              </div>
            </div>
            {/* Info Row */}
            <div className='flex gap-4'>
              <div className='flex gap-14 text-[14px] text-[#667085] flex-1 leading-tight'>
                <div>
                  <div className='text-[var(--text-secondary)]'>Industry</div>
                  <div className='font-medium text-[var(--text-dark)]'>
                    Construction
                  </div>
                </div>
                <div>
                  <div className='text-[var(--text-secondary)]'>Created on</div>
                  <div className='font-medium text-[var(--text-dark)]'>
                    {formatDate(company.created_at)}
                  </div>
                </div>
                <div>
                  <div className='text-[var(--text-secondary)]'>
                    Subscription Ends
                  </div>
                  <div className='font-medium text-[var(--text-dark)]'>
                    {formatDate(company.expiry_date)}
                  </div>
                </div>
              </div>
              {/* Status Toggle */}
              {!company.is_default && (
                <div className='flex gap-3 items-center justify-between bg-[var(--border-light)] rounded-[30px] py-1 px-3'>
                  <span className='text-[12px] font-medium text-[var(--text-dark)] w-[100px]'>
                    {enabled ? 'Enable' : 'Disable'}
                  </span>
                  <Switch
                    checked={enabled}
                    onCheckedChange={handleToggle}
                    disabled={isToggling}
                    className={switchStyleSm}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
      </div>
      {/* Main Content */}
      <div className='bg-[var(--white-background)] rounded-[20px] p-[28px] mt-4 min-h-[calc(100vh-370px)]'>
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className='w-full'
        >
          <div className='flex'>
            <TabsList className='grid grid-cols-2 bg-[var(--background)] p-1 rounded-[30px] h-auto font-normal'>
              <TabsTrigger
                value='about'
                className='px-4 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                About
              </TabsTrigger>
              <TabsTrigger
                value='usermanagement'
                className='px-8 py-2 text-base transition-colors data-[state=active]:bg-[var(--primary)] data-[state=active]:text-white rounded-[30px] font-normal'
              >
                User Management
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='about' className='py-6'>
            {/* About Section */}
            <div className='bg-[var(--white-background)] rounded-[16px] border border-[#EAECF0] p-6 mb-6'>
              <div className='text-[14px] text-[var(--text-secondary)] font-medium mb-2'>
                About
              </div>
              <div className='text-[14px] text-[var(--text-dark)] font-medium leading-6'>
                {company.about || 'No description available.'}
              </div>
            </div>
            {/* Contact Info Row */}
            <div className='bg-[var(--white-background)] rounded-[16px] border border-[#EAECF0] p-6 flex gap-8 text-[14px] text-[#667085]'>
              <div>
                <div className='font-medium text-[var(--text-secondary)] mb-1'>
                  Email
                </div>
                <div className='text-[var(--text-dark)]'>
                  {company.email || 'N/A'}
                </div>
              </div>
              <div>
                <div className='font-medium text-[var(--text-secondary)] mb-1'>
                  Phone Number
                </div>
                <div className='text-[var(--text-dark)]'>
                  {company.phone_number || 'N/A'}
                </div>
              </div>
              <div>
                <div className='font-medium text-[var(--text-secondary)] mb-1'>
                  Address
                </div>
                <div className='text-[var(--text-dark)]'>
                  {company.city && company.pincode
                    ? `${company.city}, ${company.pincode}`
                    : 'N/A'}
                </div>
              </div>
              <div>
                <div className='font-medium text-[var(--text-secondary)] mb-1'>
                  Communication
                </div>
                <div className='text-[var(--text-dark)]'>
                  {company.preferred_communication_method || 'N/A'}
                </div>
              </div>
              <div>
                <div className='font-medium text-[var(--text-secondary)] mb-1'>
                  Website
                </div>
                <div className='flex items-center gap-1 text-[var(--text-dark)]'>
                  {company.website ? (
                    <>
                      <span>{company.website}</span>
                      <Link
                        href={
                          company.website.startsWith('http')
                            ? company.website
                            : `https://${company.website}`
                        }
                        target='_blank'
                        className='underline ml-1'
                      >
                        ↗
                      </Link>
                    </>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='usermanagement' className='py-6'>
            <div className='flex justify-between gap-4'>
              <div className='relative max-w-[360px] w-full'>
                <Input
                  id='search'
                  placeholder='Search here...'
                  className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[30px] pl-12 placeholder:text-[var(--text-secondary)]'
                />
                <Search className='absolute top-3 left-4' />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className='w-40 bg-[var(--white-background)] rounded-[30px] border-2 border-[var(--border-dark)] h-[42px] focus:border-[var(--secondary)] focus:ring-0 focus:outline-none'>
                  <SelectValue placeholder='All Users' />
                </SelectTrigger>
                <SelectContent className={selectContentStyle}>
                  <SelectItem value='all' className={selectItemStyle}>
                    All Users
                  </SelectItem>
                  <SelectItem value='admin' className={selectItemStyle}>
                    Admin
                  </SelectItem>
                  <SelectItem value='contractor' className={selectItemStyle}>
                    Contractor
                  </SelectItem>
                  <SelectItem value='manager' className={selectItemStyle}>
                    Project Manager
                  </SelectItem>
                  <SelectItem value='employee' className={selectItemStyle}>
                    Employee
                  </SelectItem>
                  <SelectItem value='estimator' className={selectItemStyle}>
                    Estimator
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='mt-6'>
              {/* User Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {filteredUsers.map(user => (
                  <UserCard
                    key={user.id}
                    name={user.name}
                    role={user.role}
                    phone={user.phone}
                    email={user.email}
                    image={user.image}
                    status={user.status}
                    onToggle={() => handleToggleStatus(user.id)}
                    menuOptions={menuOptions}
                    userUuid={String(user.id)}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanyDetails;
