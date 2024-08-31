import { genCustomError } from 'src/shared/utils/error.utils';
import type {
  VerifyMeasureRequestDTO,
  VerifyMeasureResponseDTO,
} from '../../model/dto';
import { z, type ZodError } from 'zod';
import {
  getDBItem,
  getDBRecordByParam,
  setDBItem,
} from 'src/modules/external/storage';
import { MeasureRecord } from 'src/modules/model/measure.entity';

export const verifyMeasureUseCase = async (
  data: VerifyMeasureRequestDTO
): Promise<VerifyMeasureResponseDTO> => {
  verifyValidator(data);

  const measureRecord = getDBItem<MeasureRecord>(data.measure_uuid);

  if (
    !measureRecord.measureValueStatus ||
    measureRecord.measureValueStatus === 'INVALID'
  ) {
    if (measureRecord.value !== data.confirmed_value)
      measureRecord.value = data.confirmed_value;

    measureRecord.measureValueStatus = 'VALID';
    await setDBItem(measureRecord.id, measureRecord);
  }

  return {
    success: true,
  };
};
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
