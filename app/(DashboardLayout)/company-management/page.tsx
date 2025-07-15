'use client';

import { CompanyCard } from '@/components/shared/cards/CompanyCard';
import { useToast } from '@/components/ui/use-toast';
import { PAGINATION } from '@/constants/common';
import { apiService, Company, FetchCompaniesResponse } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { extractApiErrorMessage, formatDate } from '@/lib/utils';
import { AddCircle, Edit2, Trash } from 'iconsax-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { COMPANY_MESSAGES } from './company-messages';

const menuOptions = [
  {
    label: COMPANY_MESSAGES.EDIT_MENU,
    action: 'edit',
    icon: Edit2,
    variant: 'default' as const,
  },
  {
    label: COMPANY_MESSAGES.DELETE_MENU,
    action: 'delete',
    icon: Trash,
    variant: 'destructive' as const,
  },
];

export default function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [_page, _setPage] = useState<number>(1);
  const [_hasMore, _setHasMore] = useState<boolean>(true);
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
      const res: FetchCompaniesResponse = await apiService.fetchCompanies({
        page: targetPage,
        limit: PAGINATION.DEFAULT_LIMIT,
        status: 'ACTIVE',
        sortOrder: 'ASC',
        sortBy: 'created_at',
      });

      if (isCompanyApiResponse(res)) {
        const newCompanies = res.data.data;
        setCompanies(prev =>
          append ? [...prev, ...newCompanies] : newCompanies
        );
        _setPage(targetPage);
        _setHasMore(res.data.page < res.data.totalPages);
      } else {
        // Fallback for unexpected response structure
        setCompanies([]);
        _setHasMore(false);
      }
    } catch (err: unknown) {
      // API Error handling
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(err, COMPANY_MESSAGES.FETCH_ERROR);
      showErrorToast(message);
      if (!append) setCompanies([]);
      _setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Status toggle handler - updated to actually call API
  const handleToggleStatus = async (
    id: number,
    currentStatus: 'ACTIVE' | 'INACTIVE'
  ) => {
    try {
      const company = companies.find(c => c.id === id);
      if (!company || !company.uuid)
        throw new Error(COMPANY_MESSAGES.COMPANY_NOT_FOUND_ERROR);

      // Prevent status changes for default companies
      if (company.is_default) {
        showErrorToast(COMPANY_MESSAGES.DEFAULT_COMPANY_STATUS_ERROR);
        return;
      }

      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await apiService.updateCompanyStatus(company.uuid, newStatus);

      setCompanies(companies =>
        companies.map(c => (c.id === id ? { ...c, status: newStatus } : c))
      );

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
    }
  };

  // Delete handler
  const handleDeleteCompany = async (uuid: string) => {
    try {
      const company = companies.find(c => c.uuid === uuid);

      // Prevent deletion of default companies
      if (company?.is_default) {
        showErrorToast(COMPANY_MESSAGES.DEFAULT_COMPANY_DELETE_ERROR);
        return;
      }

      await apiService.deleteCompany(uuid);
      setCompanies(companies => companies.filter(c => c.uuid !== uuid));
      showSuccessToast(COMPANY_MESSAGES.DELETE_SUCCESS);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        COMPANY_MESSAGES.DELETE_ERROR
      );
      showErrorToast(message);
    }
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
              image={
                company.image
                  ? (process.env['NEXT_PUBLIC_CDN_URL'] || '') + company.image
                  : ''
              }
              status={company.status === 'ACTIVE'}
              onToggle={() => handleToggleStatus(company.id, company.status)}
              menuOptions={menuOptions}
              isDefault={company.is_default}
              companyUuid={company.uuid}
              onDelete={() => handleDeleteCompany(company.uuid)}
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
