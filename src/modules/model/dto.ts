import type { MeasureRecord } from './measure.entity';

export type MeasureRegisterRequestDTO = {
  image: string;
  customer_code: string;
  measure_datetime: string;
  measure_type: MeasureRecord['type'];
};
export type MeasureRegisterResponseDTO = {
  image_url: string;
  measure_value: number;
  measure_uuid: string;
};
export type VerifyMeasureRequestDTO = Pick<
  MeasureRegisterResponseDTO,
  'measure_uuid'
> & {
  confirmed_value: number;
};
export type VerifyMeasureResponseDTO = {
  success: boolean;
};
export type ListMeasureRequestDTO = {
  customer_code: MeasureRecord['customerCode'];
  measure_type?: MeasureRecord['type'];
};
export type ListMeasureItem = {
  measure_uuid: string;
  measure_datetime: string;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
};
export type ListMeasureResponseDTO = {
  customer_code: MeasureRecord['customerCode'];
  measures: ListMeasureItem[];
};
