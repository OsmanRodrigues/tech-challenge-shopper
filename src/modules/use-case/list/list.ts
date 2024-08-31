import { getDBRecordByParam, GetDBRecordParam } from '../../external/storage';

import type {
  ListMeasureRequestDTO,
  ListMeasureResponseDTO,
} from '../../model/dto';
import type { MeasureRecord } from '../../model/measure.entity';

export const listMeasuresUseCase = async (
  data: ListMeasureRequestDTO
): Promise<ListMeasureResponseDTO> => {
  const searchParams: GetDBRecordParam<MeasureRecord>[] = [
    { paramName: 'customerCode', paramValue: data.customer_code },
  ];

  if (data.measure_type) {
    searchParams.push({ paramName: 'type', paramValue: data.measure_type });
  }

  const dbSearchRes = await getDBRecordByParam<MeasureRecord>(searchParams);

  return {
    customer_code: data.customer_code,
    measures: dbSearchRes as any,
  };
};
