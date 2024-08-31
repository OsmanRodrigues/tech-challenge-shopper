import { z, ZodError } from 'zod';
import { requestHandlerWrapper } from '../../../shared/utils/request-handler.utils';
import { genCustomError } from '../../../shared/utils/error.utils';
import {
  getDBRecordByParam,
  type GetDBRecordParam,
} from '../../external/storage';

import type {
  ListMeasureItem,
  ListMeasureRequestDTO,
  ListMeasureResponseDTO,
} from '../../model/dto';
import {
  MeasureType,
  MeasureValueStatus,
  type MeasureRecord,
} from '../../model/measure.entity';

export const listMeasuresUseCase = async (
  data: ListMeasureRequestDTO
): Promise<ListMeasureResponseDTO> => {
  listValidator(data);

  const searchParams: GetDBRecordParam<MeasureRecord>[] = [
    { paramName: 'customerCode', paramValue: data.customer_code },
  ];

  if (data.measure_type) {
    searchParams.push({ paramName: 'type', paramValue: data.measure_type });
  }

  const dbSearchRes = await getDBRecordByParam<MeasureRecord, ListMeasureItem>(
    searchParams,
    {
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
    }
  );

  if (!dbSearchRes?.length)
    throw genCustomError(
      'MEASURE_NOT_FOUND',
      'Nenhum registro encontrado.',
      404
    );

  return {
    customer_code: data.customer_code,
    measures: dbSearchRes,
  };
};
export const listRequestHandler = requestHandlerWrapper(listMeasuresUseCase, {
  withQueryParams: true,
  withReqParams: true,
});
const listValidator = (data: ListMeasureRequestDTO) => {
  try {
    const listRequestSchema = z.object({
      measure_type: z.nativeEnum(MeasureType),
    });
    listRequestSchema.parse(data);
  } catch (err) {
    const typedError = err as ZodError;

    throw genCustomError(
      'INVALID_TYPE',
      'Parâmetro measure type diferente de WATER ou GAS.',
      400,
      typedError.issues
    );
  }
};
