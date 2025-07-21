'use client';

import { CategoryCard } from '@/components/shared/cards/CategoryCard';
import LoadingComponent from '@/components/shared/common/LoadingComponent';
import NoDataFound from '@/components/shared/common/NoDataFound';
import SideSheet from '@/components/shared/common/SideSheet';
import CategoryForm from '@/components/shared/forms/CategoryForm';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PAGINATION } from '@/constants/common';
import { STATUS_CODES } from '@/constants/status-codes';
import {
  apiService,
  Category,
  CreateCategoryRequest,
  GetCategoryResponse,
  UpdateCategoryRequest,
} from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { extractApiErrorMessage, extractApiSuccessMessage } from '@/lib/utils';
import {
  CreateCategoryFormData,
  createCategorySchema,
} from '@/lib/validations/category';
import { yupResolver } from '@hookform/resolvers/yup';
import { Edit2, Trash } from 'iconsax-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import CategoryCardSkeleton from '../../../components/shared/skeleton/CategoryCardSkeleton';
import { catIconOptions } from '../../../constants/sidebar-items';
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
  const defaultIconOption = useMemo(() => catIconOptions[0], []);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
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

      const response = await apiService.deleteCategory(uuid);
      showSuccessToast(
        extractApiSuccessMessage(response, CATEGORY_MESSAGES.DELETE_SUCCESS)
      );
      fetchCategories();
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
          showSuccessToast(
            extractApiSuccessMessage(response, CATEGORY_MESSAGES.UPDATE_SUCCESS)
          );

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
          showSuccessToast(
            extractApiSuccessMessage(response, CATEGORY_MESSAGES.CREATE_SUCCESS)
          );

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
    <section className='w-full overflow-y-auto pb-4'>
      <header className='flex items-center justify-between mb-4 xl:mb-8'>
        <h2 className='page-title'>
          {CATEGORY_MESSAGES.CATEGORY_MANAGEMENT_TITLE}
        </h2>
        <Button onClick={() => setOpen(true)} className='btn-primary'>
          {CATEGORY_MESSAGES.ADD_CATEGORY_BUTTON}
        </Button>
      </header>

      {/* Categories Grid */}
      {categories.length === 0 && loading ? (
        <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6 w-full'>
          {[...Array(8)].map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {categories.length === 0 && !loading ? (
            <NoDataFound
              description={CATEGORY_MESSAGES.NO_CATEGORIES_FOUND_DESCRIPTION}
              buttonText={CATEGORY_MESSAGES.ADD_CATEGORY_BUTTON}
              onButtonClick={() => setOpen(true)}
            />
          ) : (
            <div className='grid grid-cols-autofit xl:grid-cols-autofit-xl gap-3 xl:gap-6 w-full'>
              {categories.map((category, index) => {
                const iconOption = catIconOptions.find(
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
                    iconSrc={props => {
                      const Icon = iconOption.icon;
                      // Map size prop to Tailwind class, and color to a text color class
                      const sizeClass = props.size
                        ? `w-[${props.size}px] h-[${props.size}px]`
                        : 'w-6 h-6';
                      const colorClass = props.color
                        ? `text-[${props.color}]`
                        : '';
                      return <Icon className={`${sizeClass} ${colorClass}`} />;
                    }}
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
            <CategoryForm
              control={control}
              isSubmitting={isSubmitting}
              editingCategory={editingCategory}
              handleClose={handleClose}
              CATEGORY_MESSAGES={CATEGORY_MESSAGES}
              iconOptions={catIconOptions}
              errors={{
                icon: errors.icon?.message || '',
                name: errors.name?.message || '',
                description: errors.description?.message || '',
              }}
              selectedIcon={watch('icon')}
              setSelectedIcon={val => setValue('icon', val)}
              onSubmit={handleSubmit(onSubmit)}
            />
          )}
        </div>
      </SideSheet>
    </section>
  );
};

export default CategoryManagement;
