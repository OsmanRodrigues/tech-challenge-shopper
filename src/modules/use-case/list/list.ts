import { requestHandlerWrapper } from '../../../shared/utils/request-handler.utils';
import {
  getDBRecordByParam,
  type GetDBRecordParam,
} from '../../external/storage';

import type {
  ListMeasureRequestDTO,
  ListMeasureResponseDTO,
} from '../../model/dto';
import {
  MeasureValueStatus,
  type MeasureRecord,
} from '../../model/measure.entity';

export const listMeasuresUseCase = async (
  data: ListMeasureRequestDTO
): Promise<ListMeasureResponseDTO> => {
  const searchParams: GetDBRecordParam<MeasureRecord>[] = [
    { paramName: 'customerCode', paramValue: data.customer_code },
  ];

  if (data.measure_type) {
    searchParams.push({ paramName: 'type', paramValue: data.measure_type });
  }

  const dbSearchRes = await getDBRecordByParam<MeasureRecord>(searchParams, {
    valueMap: {
      id: 'measure_uuid',
      collectedAt: 'measure_datetime',
      type: 'measure_type',
      measureValueStatus: 'has_confirmed',
      fileMetadata: 'image_url',
    },
    valueMapTransformer: {
      measureValueStatus: (status) => status === MeasureValueStatus.VALID,
      fileMetadata: (data) => data?.uri,
    },
  });

  return {
    customer_code: data.customer_code,
    measures: dbSearchRes as any,
  };
};
export const listRequestHandler = requestHandlerWrapper(listMeasuresUseCase, {
  withQueryParams: true,
  withReqParams: true,
});
