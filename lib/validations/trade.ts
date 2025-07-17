import * as yup from 'yup';

export const tradeFormSchema = yup.object({
  tradeName: yup.string().required('Trade Name is required.'),
  categories: yup
    .array()
    .of(yup.string())
    .min(1, 'At least one category is required.')
    .required('At least one category is required.'),
});

export type TradeFormSchema = yup.InferType<typeof tradeFormSchema>;
