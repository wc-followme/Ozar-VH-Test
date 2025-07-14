'use client';

import { CompanyCard } from '@/components/shared/cards/CompanyCard';
import { useToast } from '@/components/ui/use-toast';
import { apiService, Company, FetchCompaniesResponse } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { extractApiErrorMessage, formatDate } from '@/lib/utils';
import { AddCircle, Edit2, Trash } from 'iconsax-react';
import Link from 'next/link';
import { ReactNode, useEffect, useState } from 'react';
import { COMPANY_MESSAGES } from './company-messages';
import { FetchCompaniesParams } from './types';

const menuOptions: Array<{
  label: string;
  action: string;
  variant?: 'default' | 'destructive';
  icon: ReactNode;
}> = [
  {
    label: COMPANY_MESSAGES.EDIT_MENU,
    action: 'edit',
    icon: <Edit2 size='18' color='var(--text-dark)' variant='Outline' />,
  },
  {
    label: COMPANY_MESSAGES.DELETE_MENU,
    action: 'delete',
    icon: <Trash size='18' color='var(--text-dark)' />,
  },
];

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Fetch companies
  useEffect(() => {
    fetchCompanies(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCompanyApiResponse = (
    obj: unknown
  ): obj is FetchCompaniesResponse => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'statusCode' in obj &&
      'data' in obj &&
      typeof (obj as any).data === 'object' &&
      'data' in (obj as any).data &&
      Array.isArray((obj as any).data.data)
    );
  };

  const fetchCompanies = async (targetPage = 1, append = false) => {
    setLoading(true);
    try {
      const params: FetchCompaniesParams = {
        page: targetPage,
        limit: 10,
        status: 'ACTIVE',
        sortOrder: 'ASC',
      };

      console.log('🚀 Fetching companies with params:', params);
      const res = await apiService.fetchCompanies(params);
      console.log('📦 API Response:', res);

      if (isCompanyApiResponse(res)) {
        const newCompanies = res.data.data;
        console.log('✅ Companies received:', newCompanies);
        setCompanies(prev =>
          append ? [...prev, ...newCompanies] : newCompanies
        );
        setPage(targetPage);
        setHasMore(res.data.page < res.data.totalPages);
      } else {
        console.warn('⚠️ Unexpected response structure:', res);
        // Fallback for unexpected response structure
        setCompanies([]);
        setHasMore(false);
      }
    } catch (err: unknown) {
      console.error('❌ API Error:', err);
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(err, COMPANY_MESSAGES.FETCH_ERROR);
      showErrorToast(message);
      if (!append) setCompanies([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Status toggle handler
  const handleToggleStatus = (id: number) => {
    setCompanies(
      companies.map(company =>
        company.id === id ? { ...company, status: !company.status } : company
      )
    );
    // In a real implementation, you would call an API to update the status
    // showSuccessToast(COMPANY_MESSAGES.STATUS_UPDATE_SUCCESS);
  };

  return (
    <div className='w-full p-6 overflow-y-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <h1 className='text-2xl font-medium text-[var(--text-dark)]'>
          {COMPANY_MESSAGES.COMPANY_MANAGEMENT_TITLE}
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
            <span>{COMPANY_MESSAGES.ADD_COMPANY_BUTTON}</span>
          </Link>
        </div>
      </div>

      {/* Company Grid */}
      {loading && companies.length === 0 ? (
        <div className='text-center py-10'>{COMPANY_MESSAGES.LOADING}</div>
      ) : companies.length === 0 ? (
        <div className='text-center py-10 text-gray-500'>
          {COMPANY_MESSAGES.NO_COMPANIES_FOUND}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
          {companies.map(company => (
            <CompanyCard
              key={company.id}
              name={company.name}
              createdOn={formatDate(company.created_at)}
              subsEnd={formatDate(company.expiry_date)}
              image={company.image}
              status={company.status}
              onToggle={() => handleToggleStatus(company.id)}
              menuOptions={menuOptions}
            />
          ))}
        </div>
      )}

      {loading && companies.length > 0 && (
        <div className='text-center py-4'>{COMPANY_MESSAGES.LOADING_MORE}</div>
      )}
    </div>
  );
}
