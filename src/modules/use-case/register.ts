import { randomUUID } from 'node:crypto';
import { setDBItem, uploadFile } from '../external/storage';
import { genContent } from '../external/ai';
import { getMeasurePrompt } from '../../shared/prompts';

import type { MeasureRecord } from '../model/measure.entity';
import type {
  MeasureRegisterRequestDTO,
  MeasureRegisterResponseDTO,
} from '../model/dto';
import type { RequestHandler } from 'express';

export const registerMeasureUseCase = async (
  data: MeasureRegisterRequestDTO
): Promise<MeasureRegisterResponseDTO> => {
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
  const dbRes = await setDBItem<MeasureRecord>(measureGUID, measureRecord);

  if (dbRes === null)
    throw new Error(
      'Cannot proceed with measure register. Database write service failed.'
    );

  return {
    image_url: dbRes.fileMetadata!.uri,
    measure_uuid: dbRes.id,
    measure_value: dbRes.value!,
  };
};
export const registerHandler: RequestHandler = async (req, res) => {
  const { body } = req;

  const useCaseRes = await registerMeasureUseCase(body);

  res.send(useCaseRes);
};
