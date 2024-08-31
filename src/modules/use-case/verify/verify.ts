import { requestHandlerWrapper } from '../../../shared/utils/request-handler.utils';
import { getDBRecord, setDBRecord } from '../../external/storage';
import { genCustomError } from '../../../shared/utils/error.utils';
import { z, type ZodError } from 'zod';

import type { MeasureRecord } from '../../model/measure.entity';
import type {
  VerifyMeasureRequestDTO,
  VerifyMeasureResponseDTO,
} from '../../model/dto';

export const verifyMeasureUseCase = async (
  data: VerifyMeasureRequestDTO
): Promise<VerifyMeasureResponseDTO> => {
  verifyValidator(data);

  const measureRecord = getDBRecord<MeasureRecord>(data.measure_uuid);

  if (!measureRecord?.id)
    throw genCustomError('MEASURE_NOT_FOUND', 'Leitura não encontrada', 404);

  if (measureRecord.measureValueStatus === 'VALID') {
    throw genCustomError(
      'CONFIRMATION_DUPLICATE',
      'Leitura já confirmada',
      409
    );
  } else {
    if (measureRecord?.value !== data.confirmed_value) {
      measureRecord.value = data.confirmed_value;
    }

    measureRecord.measureValueStatus = 'VALID';
    await setDBRecord(measureRecord.id, measureRecord);
  }

  return {
    success: true,
  };
};
export const verifyHandler = requestHandlerWrapper(verifyMeasureUseCase, {
  withBody: true,
});
const verifyValidator = (data: VerifyMeasureRequestDTO) => {
  try {
    const verifyMeasureSchema = z.object({
      measure_uuid: z.string().uuid(),
      confirmed_value: z.number().min(1),
    });
    verifyMeasureSchema.parse(data);
  } catch (err) {
    const typedError = err as ZodError;

    throw genCustomError(
      'INVALID_DATA',
      'Os dados fornecidos no corpo da requisição são inválidos.',
      400,
      typedError.issues
    );
  }
};
