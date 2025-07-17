import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiService } from '@/lib/api';
import { cn } from '@/lib/utils';
import { tradeFormSchema, TradeFormSchema } from '@/lib/validations/trade';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FormErrorMessage from '../common/FormErrorMessage';
import MultiSelect from '../common/MultiSelect';

interface Category {
  id: number;
  name: string;
  status: string;
}

interface TradeFormProps {
  onSubmit: (data: { tradeName: string; category: string }) => void;
  loading?: boolean;
  onCancel?: () => void;
}

interface TradeFormData {
  tradeName: string;
  categories: string[];
}

export default function TradeForm({
  onSubmit,
  loading,
  onCancel,
}: TradeFormProps) {
  const [categoriesOption, setCategoriesOption] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await apiService.getCategoriesDropdown();
        if (response.statusCode === 200 && Array.isArray(response.data)) {
          setCategoriesOption(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        setCategoriesOption([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TradeFormSchema>({
    resolver: yupResolver(tradeFormSchema),
    defaultValues: {
      tradeName: '',
      categories: [],
    },
  });

  const onFormSubmit = (data: TradeFormSchema) => {
    onSubmit({
      tradeName: data.tradeName,
      category: data.categories.join(', '),
    });
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className='space-y-6 w-full max-w-xl'
    >
      <div className='space-y-2'>
        <Label
          htmlFor='category'
          className='text-[14px] font-semibold text-[var(--text-dark)]'
        >
          Category
        </Label>
        <Controller
          name='categories'
          control={control}
          render={({ field }) =>
            loadingCategories ? (
              <Input
                disabled
                placeholder='Loading categories...'
                className='h-12 w-full border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]'
              />
            ) : (
              <MultiSelect
                options={categoriesOption}
                getOptionLabel={(option: Category) => option?.name || ''}
                getOptionValue={(option: Category) => String(option?.id)}
                value={
                  Array.isArray(field.value)
                    ? field.value.filter(
                        (v): v is string => typeof v === 'string'
                      )
                    : []
                }
                onChange={field.onChange}
                placeholder='Select Category'
                error={errors.categories?.message as string}
                name='category'
              />
            )
          }
        />
        <FormErrorMessage message={errors.categories?.message as string} />
      </div>
      <div className='space-y-2'>
        <Label
          htmlFor='tradeName'
          className='text-[14px] font-semibold text-[var(--text-dark)]'
        >
          Trade Name
        </Label>
        <Controller
          name='tradeName'
          control={control}
          render={({ field }) => (
            <Input
              id='tradeName'
              {...field}
              placeholder='Enter Trade Name'
              className={cn(
                'h-12 border-2 bg-[var(--white-background)] rounded-[10px] !placeholder-[var(--text-placeholder)]',
                errors.tradeName
                  ? 'border-[var(--warning)]'
                  : 'border-[var(--border-dark)]'
              )}
            />
          )}
        />
        <FormErrorMessage message={errors.tradeName?.message as string} />
      </div>
      <div className='pt-2 flex items-center gap-4'>
        <Button
          type='button'
          variant='outline'
          className='h-[48px] px-8 border-2 border-[var(--border-dark)] bg-transparent rounded-full font-semibold text-[var(--text-dark)] flex items-center'
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          className='h-[48px] px-12 bg-[var(--secondary)] hover:bg-green-600 rounded-full font-semibold text-white'
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
}
