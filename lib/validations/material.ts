import * as yup from 'yup';

export const materialFormSchema = yup.object({
  materialName: yup.string().required('Material name is required'),
  services: yup
    .array()
    .of(yup.string())
    .min(1, 'At least one service is required')
    .required('At least one service is required'),
});

export type MaterialFormSchema = yup.InferType<typeof materialFormSchema>;
