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
