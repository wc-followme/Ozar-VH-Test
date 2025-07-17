'use client';

import { CategoryCard } from '@/components/shared/cards/CategoryCard';
import FormErrorMessage from '@/components/shared/common/FormErrorMessage';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import SideSheet from '@/components/shared/common/SideSheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { PAGINATION } from '@/constants/common';
import { iconOptions } from '@/constants/sidebar-items';
import { STATUS_CODES } from '@/constants/status-codes';
import {
  apiService,
  Category,
  CreateCategoryRequest,
  GetCategoryResponse,
  UpdateCategoryRequest,
} from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { extractApiErrorMessage } from '@/lib/utils';
import {
  CreateCategoryFormData,
  createCategorySchema,
} from '@/lib/validations/category';
import { yupResolver } from '@hookform/resolvers/yup';
import { Edit2, Trash } from 'iconsax-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CATEGORY_MESSAGES } from './category-messages';

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);
  const { showSuccessToast, showErrorToast } = useToast();
  const { handleAuthError } = useAuth();

  // Memoize menu options to prevent unnecessary re-renders
  const menuOptions = useMemo(
    () => [
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
    ],
    []
  );

  // Form management with react-hook-form
  const defaultIconOption = useMemo(() => iconOptions[0], []);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCategoryFormData>({
    resolver: yupResolver(createCategorySchema),
    defaultValues: {
      name: '',
      description: '',
      icon: defaultIconOption?.value ?? '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.fetchCategories({
        page: 1,
        limit: PAGINATION.DEFAULT_LIMIT,
        status: 'ACTIVE', // Only fetch active categories
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

  // Fetch category details for editing
  const fetchCategoryDetails = async (uuid: string) => {
    setIsLoadingCategory(true);
    try {
      const response: GetCategoryResponse =
        await apiService.getCategoryDetails(uuid);

      if (response.statusCode === STATUS_CODES.OK && response.data) {
        const category = response.data;
        setEditingCategory(category);

        // Reset form with category data
        reset({
          name: category.name,
          description: category.description,
          icon: category.icon,
        });

        setOpen(true);
      } else {
        throw new Error(
          response.message || CATEGORY_MESSAGES.FETCH_DETAILS_ERROR
        );
      }
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        CATEGORY_MESSAGES.FETCH_DETAILS_ERROR
      );
      showErrorToast(message);
    } finally {
      setIsLoadingCategory(false);
    }
  };

  // Handle edit category
  const handleEditCategory = (uuid: string) => {
    fetchCategoryDetails(uuid);
  };

  // Handle form submission
  const onSubmit = async (data: CreateCategoryFormData) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        // Update existing category
        const updateData: UpdateCategoryRequest = {
          name: data.name,
          description: data.description,
          icon: data.icon,
        };

        const response = await apiService.updateCategory(
          editingCategory.uuid,
          updateData
        );
        if (
          response.statusCode === STATUS_CODES.OK ||
          response.statusCode === STATUS_CODES.CREATED
        ) {
          showSuccessToast(CATEGORY_MESSAGES.UPDATE_SUCCESS);

          // Update the category in the list
          setCategories(categories =>
            categories.map(c =>
              c.uuid === editingCategory.uuid ? { ...c, ...updateData } : c
            )
          );

          // Reset form and close modal
          reset({
            name: '',
            description: '',
            icon: defaultIconOption?.value ?? '',
          });
          setEditingCategory(null);
          setOpen(false);
        } else {
          throw new Error(response.message || CATEGORY_MESSAGES.UPDATE_ERROR);
        }
      } else {
        // Create new category
        const categoryData: CreateCategoryRequest = {
          name: data.name,
          description: data.description,
          icon: data.icon,
          status: 'ACTIVE', // Default to ACTIVE when creating
          is_default: false, // New categories are not default
        };

        const response = await apiService.createCategory(categoryData);
        if (
          response.statusCode === STATUS_CODES.OK ||
          response.statusCode === STATUS_CODES.CREATED
        ) {
          showSuccessToast(CATEGORY_MESSAGES.CREATE_SUCCESS);

          // Reset form and close modal
          reset({
            name: '',
            description: '',
            icon: defaultIconOption?.value ?? '',
          });
          setOpen(false);

          // Refresh categories list
          fetchCategories();
        } else {
          throw new Error(response.message || CATEGORY_MESSAGES.CREATE_ERROR);
        }
      }
    } catch (err: unknown) {
      // Handle auth errors first (will redirect to login if 401)
      if (handleAuthError(err)) {
        return; // Don't show toast if it's an auth error
      }

      const message = extractApiErrorMessage(
        err,
        editingCategory
          ? CATEGORY_MESSAGES.UPDATE_ERROR
          : CATEGORY_MESSAGES.CREATE_ERROR
      );
      showErrorToast(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    reset({
      name: '',
      description: '',
      icon: defaultIconOption?.value ?? '',
    });
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
      {categories.length === 0 && loading ? (
        <LoadingComponent variant='fullscreen' />
      ) : (
        <>
          {categories.length === 0 && !loading ? (
            <div className='text-center py-10 text-gray-500'>
              {CATEGORY_MESSAGES.NO_CATEGORIES_FOUND}
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full'>
              {categories.map((category, index) => {
                const iconOption = iconOptions.find(
                  opt => opt.value === category.icon
                ) || {
                  icon: () => null,
                  color: '#00a8bf',
                };
                return (
                  <CategoryCard
                    key={category.id || index}
                    name={category.name}
                    description={category.description}
                    iconSrc={iconOption.icon}
                    iconColor={iconOption.color}
                    iconBgColor={iconOption.color + '26'}
                    menuOptions={menuOptions}
                    categoryUuid={category.uuid}
                    onDelete={() => handleDeleteCategory(category.uuid)}
                    onEdit={() => handleEditCategory(category.uuid)}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Create/Edit Category Side Sheet */}
      <SideSheet
        title={
          editingCategory
            ? CATEGORY_MESSAGES.EDIT_CATEGORY_TITLE
            : CATEGORY_MESSAGES.ADD_CATEGORY_TITLE
        }
        open={open}
        onOpenChange={setOpen}
        size='600px'
      >
        <div className='space-y-6'>
          {isLoadingCategory ? (
            <LoadingComponent variant='fullscreen' size='sm' />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              {/* Icon & Category Name */}
              <div className='space-y-2'>
                <Label className='text-[14px] font-semibold text-[var(--text-dark)]'>
                  {CATEGORY_MESSAGES.ICON_LABEL} &{' '}
                  {CATEGORY_MESSAGES.CATEGORY_NAME_LABEL}
                </Label>
                <div className='flex gap-3'>
                  {/* Icon Selector */}
                  <div className='w-[80px]'>
                    <Controller
                      name='icon'
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className='h-12 px-3 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'>
                            <SelectValue>
                              <div
                                className='flex w-8 h-8 items-center justify-center rounded-[10px]'
                                style={{
                                  backgroundColor: `${(() => {
                                    const selectedIcon =
                                      iconOptions.find(
                                        opt => opt.value === field.value
                                      ) || iconOptions[0];
                                    return selectedIcon?.color ?? '';
                                  })()}26`,
                                }}
                              >
                                {(() => {
                                  const selectedIcon =
                                    iconOptions.find(
                                      opt => opt.value === field.value
                                    ) || iconOptions[0];
                                  const IconComponent = selectedIcon?.icon;
                                  return IconComponent ? (
                                    <IconComponent
                                      className='w-4 h-4'
                                      style={{
                                        color: selectedIcon?.color ?? '',
                                      }}
                                    />
                                  ) : null;
                                })()}
                              </div>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className='bg-[var(--white-background)] border border-[var(--border-dark)] shadow-[0px_2px_8px_0px_#0000001A] rounded-[8px]'>
                            {iconOptions.map(
                              ({
                                value,
                                color,
                                label,
                                icon: IconComponent,
                              }) => (
                                <SelectItem key={value} value={value}>
                                  <div className='flex items-center gap-2'>
                                    <div
                                      className='flex w-6 h-6 items-center justify-center rounded-md'
                                      style={{
                                        backgroundColor: `${color}26`,
                                      }}
                                    >
                                      <IconComponent
                                        className='w-3 h-3'
                                        style={{ color }}
                                      />
                                    </div>
                                    <span className='text-sm'>
                                      {label} sdfsd
                                    </span>
                                  </div>
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  {/* Category Name */}
                  <div className='flex-1'>
                    <Controller
                      name='name'
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder={CATEGORY_MESSAGES.ENTER_CATEGORY_NAME}
                          className='h-12 border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
                          disabled={isSubmitting}
                        />
                      )}
                    />
                  </div>
                </div>
                {(errors.icon || errors.name) && (
                  <div className='space-y-1'>
                    {errors.icon && (
                      <FormErrorMessage message={errors.icon.message || ''} />
                    )}
                    {errors.name && (
                      <FormErrorMessage message={errors.name.message || ''} />
                    )}
                  </div>
                )}
              </div>
              {/* Description */}
              <div className='space-y-2'>
                <Label className='text-[14px] font-semibold text-[var(--text-dark)]'>
                  {CATEGORY_MESSAGES.DESCRIPTION_LABEL}
                </Label>
                <Controller
                  name='description'
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder={CATEGORY_MESSAGES.ENTER_DESCRIPTION}
                      className='min-h-[80px] border-2 border-[var(--border-dark)] focus:border-green-500 focus:ring-green-500 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
                      disabled={isSubmitting}
                    />
                  )}
                />
                {errors.description && (
                  <FormErrorMessage
                    message={errors.description.message || ''}
                  />
                )}
              </div>

              {/* Actions */}
              <div className='flex gap-4 pt-2'>
                <Button
                  type='button'
                  variant='outline'
                  className='btn-secondary !h-12 !px-8'
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  {CATEGORY_MESSAGES.CANCEL_BUTTON}
                </Button>
                <Button
                  type='submit'
                  className='btn-primary !h-12 !px-12'
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? editingCategory
                      ? CATEGORY_MESSAGES.UPDATING_BUTTON
                      : CATEGORY_MESSAGES.CREATING_BUTTON
                    : editingCategory
                      ? CATEGORY_MESSAGES.UPDATE_BUTTON
                      : CATEGORY_MESSAGES.CREATE_BUTTON}
                </Button>
              </div>
            </form>
          )}
        </div>
      </SideSheet>
    </section>
  );
};

export default CategoryManagement;
