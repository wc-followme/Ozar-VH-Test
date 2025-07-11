'use client';

import { CompanyCard } from '@/components/shared/cards/CompanyCard';
import { AddCircle, Edit2, Trash } from 'iconsax-react';
import Link from 'next/link';
import { useState } from 'react';

// Dummy companies data
const dummyCompanies = [
  {
    id: 1,
    name: 'Envision Construction',
    createdOn: '30/08/2024',
    subsEnd: '30/08/2025',
    image: 'images/company-management/company-img-1.png',
    status: true,
  },
  {
    id: 2,
    name: 'Innovative Dwellings',
    createdOn: '30/08/2024',
    subsEnd: '30/08/2025',
    image: 'images/company-management/company-img-2.png',
    status: true,
  },
  {
    id: 3,
    name: 'Dream Builders',
    createdOn: '30/08/2024',
    subsEnd: '30/08/2025',
    image: 'images/company-management/company-img-3.png',
    status: true,
  },
  {
    id: 4,
    name: 'Future Foundations',
    createdOn: '30/08/2024',
    subsEnd: '30/08/2025',
    image: 'images/company-management/company-img-1.png',
    status: true,
  },
  {
    id: 5,
    name: 'Eco Homes',
    createdOn: '30/08/2024',
    subsEnd: '30/08/2025',
    image: 'images/company-management/company-img-2.png',
    status: true,
  },
  {
    id: 6,
    name: 'Eco Homes',
    createdOn: '30/08/2024',
    subsEnd: '30/08/2025',
    image: 'images/company-management/company-img-3.png',
    status: true,
  },
  {
    id: 7,
    name: 'NextGen Housing',
    createdOn: '30/08/2024',
    subsEnd: '30/08/2025',
    image: 'images/company-management/company-img-1.png',
    status: true,
  },
  {
    id: 8,
    name: 'Urban Nest',
    createdOn: '30/08/2024',
    subsEnd: '30/08/2025',
    image: 'images/company-management/company-img-2.png',
    status: true,
  },
];

const CompanyManagement = () => {
  const [company, setCompany] = useState(dummyCompanies);

  const handleToggleStatus = (id: number) => {
    setCompany(
      company.map(company =>
        company.id === id ? { ...company, status: !company.status } : company
      )
    );
  };

  const menuOptions: any = [
    { label: 'Edit', action: 'edit', icon: Edit2 },
    { label: 'Archive', action: 'delete', icon: Trash },
  ];

  return (
    <div className='w-full overflow-y-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-2xl font-medium text-[var(--text-dark)]'>
          Company Management
        </h1>

        <div className='flex items-center gap-4'>
          <Link
            className='h-[42px] px-6 bg-[var(--secondary)] hover:bg-[var(--hover-bg)] rounded-full font-semibold text-white text-base inline-flex items-center gap-2'
            href={'/company-management/add-company'}
          >
            <AddCircle
              size='32'
              color='currentColor'
              className='!w-[1.375rem] !h-[1.375rem]'
            />
            <span>Add Company</span>
          </Link>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4'>
        {company.map(company => (
          <CompanyCard
            key={company.id}
            name={company.name}
            createdOn={company.createdOn}
            subsEnd={company.subsEnd}
            image={company.image}
            status={company.status}
            onToggle={() => handleToggleStatus(company.id)}
            menuOptions={menuOptions}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyManagement;
