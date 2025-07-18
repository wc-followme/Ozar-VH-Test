import * as yup from 'yup';

export const serviceFormSchema = yup.object({
  serviceName: yup.string().required('Service name is required'),
  trades: yup
    .array()
    .of(yup.string())
    .min(1, 'At least one trade is required')
    .required('At least one trade is required'),
});

export type ServiceFormSchema = yup.InferType<typeof serviceFormSchema>;
