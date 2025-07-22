import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { apiService } from '@/lib/api';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { FlagHookIcon } from '../../icons/FalgHookIcon';

const projectTypeSchema = yup.object({
  selectedType: yup.string().required('Please select a project type'),
});

interface StepProjectTypeProps {
  onPrev: () => void;
  onSubmit: (data: any) => void;
  cancelButtonClass?: string;
  defaultValues?: any;
  isLastStep?: boolean;
}

export function StepProjectType({
  onPrev,
  onSubmit,
  cancelButtonClass,
  defaultValues,
  isLastStep = false,
}: StepProjectTypeProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const form = useForm<any>({
    resolver: yupResolver(projectTypeSchema),
    defaultValues: {
      selectedType: '',
      ...defaultValues,
    },
  });

  const { watch, setValue } = form;
  const selectedType = watch('selectedType');

  // Fetch categories from API using the existing method
  const fetchCategories = async (page: number = 1, append: boolean = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const response = await apiService.fetchCategories({
        page,
        limit: 10,
        status: 'ACTIVE',
      });

      if (response.statusCode === 200) {
        const newCategories = response.data.data;

        if (append) {
          setCategories(prev => [...prev, ...newCategories]);
        } else {
          setCategories(newCategories);
        }

        setHasMore(page < response.data.totalPages);
        setCurrentPage(page);

        // Set default category if it's the first page and no category is selected
        if (page === 1 && !selectedType) {
          const defaultCategory = newCategories.find(
            (cat: any) => cat.is_default
          );
          if (defaultCategory) {
            setValue('selectedType', defaultCategory.id);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Load more categories
  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchCategories(currentPage + 1, true);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='w-full max-w-[846px] bg-[var(--card-background)] rounded-2xl p-6 flex flex-col items-center'>
        <h2 className='text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
          Which type of project do you need for your home?
        </h2>
        <p className='text-[var(--text-secondary)] text-[18px] font-normal text-center mb-8 max-w-lg'>
          Choose the project category to help us provide accurate planning and
          estimates.
        </p>
        <div className='w-full flex items-center justify-center h-64'>
          <div className='text-lg text-gray-600'>Loading categories...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='w-full max-w-[846px] bg-[var(--card-background)] rounded-2xl p-6 flex flex-col items-center'>
        <h2 className='text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
          Which type of project do you need for your home?
        </h2>
        <p className='text-[var(--text-secondary)] text-[18px] font-normal text-center mb-8 max-w-lg'>
          Choose the project category to help us provide accurate planning and
          estimates.
        </p>
        <div className='w-full flex items-center justify-center h-64'>
          <div className='text-lg text-red-600'>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-[846px] bg-[var(--card-background)] rounded-2xl p-6 flex flex-col items-center'>
      <h2 className='text-[30px] font-bold text-center mb-2 text-[var(--text-dark)]'>
        Which type of project do you need for your home?
      </h2>
      <p className='text-[var(--text-secondary)] text-[18px] font-normal text-center mb-8 max-w-lg'>
        Choose the project category to help us provide accurate planning and
        estimates.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='w-full'>
          <FormField
            control={form.control}
            name='selectedType'
            render={({}) => (
              <FormItem>
                <FormControl>
                  <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 h-[calc(100vh_-_550px)] overflow-y-auto'>
                    {categories.map((category: any) => {
                      return (
                        <div
                          key={category.id}
                          className={`flex flex-col items-start border border-[var(--border-dark)] rounded-2xl bg-[var(--card-background)] p-6 cursor-pointer transition-all duration-150 hover:shadow-md ${selectedType === category.id ? 'bg-[var(--card-hover)] shadow-green-100' : ''}`}
                          onClick={() => setValue('selectedType', category.id)}
                        >
                          <div
                            className={`w-10 h-10 rounded-[16px] bg-[#EBB4021A] text-[#EBB402] flex items-center justify-center mb-4`}
                          >
                            <FlagHookIcon
                              className={`w-5 h-5`}
                              color='currentcolor'
                            />
                          </div>
                          <div className='font-bold text-base mb-2 text-[var(--text-dark)]'>
                            {category.name || 'Unnamed Category'}
                          </div>
                          <div className='text-[var(--text-secondary)] text-base font-normal leading-snug'>
                            {category.description || 'No description available'}
                          </div>
                          {category.is_default && (
                            <div className='mt-2'>
                              <span className='text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full'>
                                Default
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Load More Button */}
                    {hasMore && (
                      <div className='col-span-1 md:col-span-2 flex justify-center mt-4'>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={loadMore}
                          disabled={isLoadingMore}
                          className='px-6'
                        >
                          {isLoadingMore ? 'Loading...' : 'Load More'}
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex w-full justify-between'>
            <button
              type='button'
              className={cancelButtonClass || 'btn-secondary !h-12 !px-8'}
              onClick={onPrev}
            >
              Previous
            </button>
            <Button type='submit' className='btn-primary !h-12 !px-12'>
              {isLastStep ? 'Submit' : 'Next Step'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
