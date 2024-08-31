import { randomUUID } from 'node:crypto';
import {
  getDBRecordByParam,
  setDBRecord,
  uploadFile,
} from '../../external/storage';
import { genContent } from '../../external/ai';
import { getMeasurePrompt } from '../../../shared/prompts';
import { genCustomError } from '../../../shared/utils/error.utils';
import { FileMIMEType } from '../../../shared/constants';
import { z, type ZodError } from 'zod';
import { requestHandlerWrapper } from '../../../shared/utils/request-handler.utils';

import { MeasureType, type MeasureRecord } from '../../model/measure.entity';
import type {
  MeasureRegisterRequestDTO,
  MeasureRegisterResponseDTO,
} from '../../model/dto';

export const registerMeasureUseCase = async (
  data: MeasureRegisterRequestDTO
): Promise<MeasureRegisterResponseDTO> => {
  registerValidator(data);

  const dbSearchRes = getDBRecordByParam<MeasureRecord>([
    {
      paramName: 'collectedAt',
      paramValue: new Date(data.measure_datetime).getMonth(),
      recordValueTransformer: (recordValue) => new Date(recordValue).getMonth(),
    },
    { paramName: 'type', paramValue: data.measure_type },
  ]);

  if (!!dbSearchRes.length && !!dbSearchRes[0].id) {
    throw genCustomError(
      'DOUBLE_REPORT',
      'Já existe uma leitura para este tipo no mês atual.',
      409
    );
  }

  const measureGUID = randomUUID();
  const fileUploadRes = await uploadFile(
    data.image,
    `File from measure ${measureGUID}`,
    measureGUID
  );
  const getMeasureRes = await genContent(
    {
      fileUri: fileUploadRes.file.uri,
      mimeType: fileUploadRes.file.mimeType,
    },
    getMeasurePrompt
  );
  const measureRecord: MeasureRecord = {
    id: measureGUID,
    type: data.measure_type,
    collectedAt: data.measure_datetime,
    createdAt: new Date().toISOString(),
    customerCode: data.customer_code,
    value: Number.isNaN(getMeasureRes) ? undefined : Number(getMeasureRes),
    fileMetadata: {
      name: fileUploadRes.file.name,
      uri: fileUploadRes.file.uri,
    },
  };
  const dbRes = await setDBRecord<MeasureRecord>(measureGUID, measureRecord);

  if (dbRes === null)
    throw genCustomError(
      'EXPECTATION_FAILED',
      'Não foi possível realizar o registro da medição. Ocorreu uma falha no serviço de banco de dados.',
      417
    );

  return {
    image_url: dbRes.fileMetadata!.uri,
    measure_uuid: dbRes.id,
    measure_value: dbRes.value!,
  };
};
export const registerHandler = requestHandlerWrapper(registerMeasureUseCase, {
  withBody: true,
});
const registerValidator = (data: MeasureRegisterRequestDTO) => {
  try {
    const measureSchema = z.object({
      image: z.union([
        z
          .string()
          .regex(
            new RegExp(
              `data:(${Object.keys(FileMIMEType)
                .toString()
                .replaceAll(',', '|')});base64,`
            )
          ),
        z.string().base64(),
      ]),
      customer_code: z.string().min(1),
      measure_datetime: z.string().datetime(),
      measure_type: z.nativeEnum(MeasureType),
    });
    measureSchema.parse(data);
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
