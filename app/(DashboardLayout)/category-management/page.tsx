'use client';

import { CategoryCard } from '@/components/shared/cards/CategoryCard';
import SideSheet from '@/components/shared/common/SideSheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { PAGINATION } from '@/constants/common';
import { apiService, Category, CreateCategoryRequest } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { extractApiErrorMessage, formatDate } from '@/lib/utils';
import { Edit2, Trash } from 'iconsax-react';
import { useCallback, useEffect, useState } from 'react';
import { CATEGORY_MESSAGES } from './category-messages';
import { CategoryFormErrors } from './category-types';

const menuOptions = [
  {
    label: CATEGORY_MESSAGES.EDIT_MENU,
    action: 'edit',
    icon: Edit2,
    variant: 'default' as const,
  },
  {
    label: CATEGORY_MESSAGES.DELETE_MENU,
    action: 'delete',
    icon: Trash,
    variant: 'destructive' as const,
  },
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('fas fa-folder');
  const [errors, setErrors] = useState<CategoryFormErrors>({});

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.fetchCategories({
        page: 1,
        limit: PAGINATION.DEFAULT_LIMIT,
      });

      // Handle different possible response structures
      let newCategories: Category[] = [];

      if (res && res.data) {
        // If data is directly an array
        if (Array.isArray(res.data)) {
          newCategories = res.data;
        }
        // If data is nested under data.data
        else if (res.data.data && Array.isArray(res.data.data)) {
          newCategories = res.data.data;
        }
        // If data is just the response itself (fallback)
        else if (Array.isArray(res)) {
          newCategories = res;
        }
      }

      setCategories(newCategories);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        CATEGORY_MESSAGES.FETCH_ERROR
      );
      showErrorToast(message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [handleAuthError, showErrorToast]);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Status toggle handler
  const handleToggleStatus = async (
    id: number,
    currentStatus: 'ACTIVE' | 'INACTIVE'
  ) => {
    try {
      const category = categories.find(c => c.id === id);
      if (!category || !category.uuid)
        throw new Error(CATEGORY_MESSAGES.CATEGORY_NOT_FOUND_ERROR);

      // Prevent status changes for default categories
      if (category.is_default) {
        showErrorToast(CATEGORY_MESSAGES.DEFAULT_CATEGORY_STATUS_ERROR);
        return;
      }

      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await apiService.updateCategoryStatus(category.uuid, newStatus);

      setCategories(categories =>
        categories.map(c => (c.id === id ? { ...c, status: newStatus } : c))
      );

      showSuccessToast(
        `${CATEGORY_MESSAGES.STATUS_UPDATE_SUCCESS} Status changed to ${newStatus}.`
      );
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        CATEGORY_MESSAGES.STATUS_UPDATE_ERROR
      );
      showErrorToast(message);
    }
  };

  // Delete handler
  const handleDeleteCategory = async (uuid: string) => {
    try {
      const category = categories.find(c => c.uuid === uuid);

      // Prevent deletion of default categories
      if (category?.is_default) {
        showErrorToast(CATEGORY_MESSAGES.DEFAULT_CATEGORY_DELETE_ERROR);
        return;
      }

      await apiService.deleteCategory(uuid);
      setCategories(categories => categories.filter(c => c.uuid !== uuid));
      showSuccessToast(CATEGORY_MESSAGES.DELETE_SUCCESS);
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        CATEGORY_MESSAGES.DELETE_ERROR
      );
      showErrorToast(message);
    }
  };

  const validate = (): boolean => {
    const newErrors: CategoryFormErrors = {};
    if (!name.trim()) newErrors.name = CATEGORY_MESSAGES.NAME_REQUIRED;
    if (!description.trim())
      newErrors.description = CATEGORY_MESSAGES.DESCRIPTION_REQUIRED;
    if (!icon.trim()) newErrors.icon = CATEGORY_MESSAGES.ICON_REQUIRED;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload: CreateCategoryRequest = {
        name: name.trim(),
        description: description.trim(),
        icon: icon.trim(),
        is_default: false,
        status: 'ACTIVE',
      };

      await apiService.createCategory(payload);
      showSuccessToast(CATEGORY_MESSAGES.CREATE_SUCCESS);

      // Reset form and close modal
      setName('');
      setDescription('');
      setIcon('fas fa-folder');
      setErrors({});
      setOpen(false);

      // Refresh categories list
      fetchCategories();
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        CATEGORY_MESSAGES.CREATE_ERROR
      );
      showErrorToast(message);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setIcon('fas fa-folder');
    setErrors({});
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <section className='flex flex-col w-full items-start gap-8 overflow-y-auto'>
      <header className='flex items-center justify-between w-full'>
        <h2 className='page-title'>
          {CATEGORY_MESSAGES.CATEGORY_MANAGEMENT_TITLE}
        </h2>
        <Button onClick={() => setOpen(true)} className='btn-primary'>
          {CATEGORY_MESSAGES.ADD_CATEGORY_BUTTON}
        </Button>
      </header>

      {/* Categories Grid */}
      {loading ? (
        <div className='text-center py-10'>{CATEGORY_MESSAGES.LOADING}</div>
      ) : categories.length === 0 ? (
        <div className='text-center py-10 text-gray-500'>
          {CATEGORY_MESSAGES.NO_CATEGORIES_FOUND}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full'>
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              name={category.name}
              description={category.description}
              icon={category.icon}
              createdOn={formatDate(category.created_at)}
              status={category.status === 'ACTIVE'}
              onToggle={() => handleToggleStatus(category.id, category.status)}
              menuOptions={menuOptions}
              isDefault={category.is_default}
              categoryUuid={category.uuid}
              onDelete={() => handleDeleteCategory(category.uuid)}
            />
          ))}
        </div>
      )}

      {/* Create Category Side Sheet */}
      <SideSheet
        title={CATEGORY_MESSAGES.ADD_CATEGORY_TITLE}
        open={open}
        onOpenChange={setOpen}
        size='600px'
      >
        <div className='space-y-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Category Name */}
            <div className='space-y-2'>
              <Label className='text-[14px] font-semibold text-[var(--text-dark)]'>
                {CATEGORY_MESSAGES.CATEGORY_NAME_LABEL}
              </Label>
              <Input
                placeholder={CATEGORY_MESSAGES.ENTER_CATEGORY_NAME}
                value={name}
                onChange={e => setName(e.target.value)}
                className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px]'
              />
              {errors.name && (
                <p className='text-red-500 text-sm'>{errors.name}</p>
              )}
            </div>

            {/* Icon */}
            <div className='space-y-2'>
              <Label className='text-[14px] font-semibold text-[var(--text-dark)]'>
                {CATEGORY_MESSAGES.ICON_LABEL}
              </Label>
              <Input
                placeholder={CATEGORY_MESSAGES.SELECT_ICON}
                value={icon}
                onChange={e => setIcon(e.target.value)}
                className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px]'
              />
              {errors.icon && (
                <p className='text-red-500 text-sm'>{errors.icon}</p>
              )}
            </div>

            {/* Description */}
            <div className='space-y-2'>
              <Label className='text-[14px] font-semibold text-[var(--text-dark)]'>
                {CATEGORY_MESSAGES.DESCRIPTION_LABEL}
              </Label>
              <Textarea
                placeholder={CATEGORY_MESSAGES.ENTER_DESCRIPTION}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className='min-h-[80px] border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px]'
              />
              {errors.description && (
                <p className='text-red-500 text-sm'>{errors.description}</p>
              )}
            </div>

            {/* Actions */}
            <div className='flex gap-4 pt-2'>
              <Button
                type='button'
                variant='outline'
                className='btn-secondary !px-8 !h-12'
                onClick={handleClose}
              >
                {CATEGORY_MESSAGES.CANCEL_BUTTON}
              </Button>
              <Button type='submit' className='btn-primary !h-12 !px-12'>
                {CATEGORY_MESSAGES.CREATE_BUTTON}
              </Button>
            </div>
          </form>
        </div>
      </SideSheet>
    </section>
  );
};

export default CategoryManagement;
