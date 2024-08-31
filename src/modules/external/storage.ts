import fs from 'node:fs';
import {
  GoogleAIFileManager,
  FileMetadataResponse,
} from '@google/generative-ai/server';
import { googleAIStudioAPIKey } from '../../shared/configs';
import { FileMIMEType } from '../../shared/constants';

export type GetDBRecordParam<DBRecord = any> = {
  paramName: keyof DBRecord | number;
  paramValue: any;
  recordValueTransformer?: (recordValue: any) => any;
};

if (!googleAIStudioAPIKey) {
  throw new Error('File manager API key not provided.');
}

const fileManagerKey = googleAIStudioAPIKey;
const dbFileName = 'db.json';
export let fileManager: GoogleAIFileManager | null = null;
export let db: Record<string, any> | null = null;

export const startStorageServices = () => {
  if (db === null) {
    try {
      db = JSON.parse(fs.readFileSync(dbFileName).toString());
    } catch (err: any) {
      if (err.code === 'ENOENT' && err.path === dbFileName) {
        fs.writeFileSync(dbFileName, `{}`);
        db = JSON.parse(fs.readFileSync(dbFileName).toString());
      } else throw err;
    }
  }

  if (fileManager === null) {
    if (!fileManagerKey) {
      throw new Error('Cannot start storage service. API Key not provided.');
    }

    fileManager = new GoogleAIFileManager(fileManagerKey);
  }
};
export const setDBRecord = async <Value = any>(
  key: string,
  value: Value
): Promise<Value | null> => {
  if (db === null) startStorageServices();

  if (typeof db === 'object') {
    let logMessageFallback = 'registered';

    if (!!db![key]) logMessageFallback = 'updated';

    db![key] = value;
    fs.writeFileSync(dbFileName, JSON.stringify(db));
    db = JSON.parse(fs.readFileSync(dbFileName).toString());

    const dbRecord = db![key];

    console.log(`> [Database] ${logMessageFallback} record ${dbRecord.id}`);

    return dbRecord;
  }

  return null;
};
export const getDBRecord = <DBRecord = any>(key: string | number): DBRecord => {
  if (db === null) {
    startStorageServices();
  }

  if (typeof key === 'number') {
    return Object.values(db!)?.[key];
  }

  return db?.[key];
};
export const getDBRecordByParam = async <
  DBRecord = Record<string, any>,
  MappedRecord = Record<string, any>
>(
  params: GetDBRecordParam<DBRecord>[],
  options?: {
    valueMap?: Partial<Record<keyof DBRecord, string>>;
    valueMapTransformer?: Partial<Record<keyof DBRecord, (value: any) => any>>;
  }
): Promise<MappedRecord[]> => {
  if (db === null) {
    startStorageServices();
  }

  const dbRecords = Object.values(db!);
  const verifyParamsMatch = (
    currentParams: typeof params,
    currentRecord: any
  ) =>
    currentParams.every((param) => {
      const recordValue = currentRecord?.[param.paramName];

      return (
        !!recordValue &&
        (!!param.recordValueTransformer
          ? param.recordValueTransformer(recordValue) === param.paramValue
          : recordValue === param.paramValue)
      );
    });

  if (dbRecords.length) {
    if (!!options?.valueMap) {
      return dbRecords.flatMap((record) => {
        const hasParamsMatch = verifyParamsMatch(params, record);

        if (hasParamsMatch) {
          const mappedRecord = {} as any;

          for (const key in options.valueMap) {
            const mappedKey = options.valueMap[key];
            const valueTransformer = options.valueMapTransformer?.[key];
            const value = valueTransformer
              ? valueTransformer(record[key])
              : record[key];

            mappedRecord[mappedKey] = value;
          }

          return [mappedRecord];
        } else {
          return [];
        }
      });
    }

    return dbRecords.filter((record) => verifyParamsMatch(params, record));
  }

  return [];
};
export const uploadFile = async (
  base64File: string,
  displayName: FileMetadataResponse['displayName'],
  guid: string
) => {
  if (fileManager === null) startStorageServices();

  const tempFile = genTempFileFromBase64(base64File, guid);
  const uploadResponse = await fileManager!.uploadFile(tempFile.path, {
    mimeType: tempFile.mimeType,
    displayName,
  });

  console.log(
    `> [File manager] Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
  );

  return uploadResponse;
};
export const getFile = async (fileName: string) => {
  if (fileManager === null) startStorageServices();

  const getResponse = await fileManager!.getFile(fileName);

  return getResponse;
};
//helpers
export const genTempFileFromBase64 = (
  base64File: string,
  guid: string
): { path: string; mimeType: keyof typeof FileMIMEType } => {
  try {
    const mimeTypeStartParam = ':';
    const mimeTypeEndParam = ';';
    const match1 = base64File.match(
      new RegExp(`\\${mimeTypeStartParam}[a-z]*\/[a-z]*\\${mimeTypeEndParam}`)
    );
    const match2 = match1?.[0]?.match?.(new RegExp('[a-z]*/[a-z]*'));
    const mimeType = match2?.length
      ? (match2[0] as keyof typeof FileMIMEType)
      : FileMIMEType['image/jpeg'];
    const fileExtension = mimeType.split('/')[1];
    const tempFilePath = `temp-file-[${guid}].${fileExtension}`;
    const base64HeaderParam = `base64,`;
    const base64FileWithNoHeader = !!base64File.match(
      new RegExp(base64HeaderParam)
    )
      ? base64File.split(base64HeaderParam)[1].trimStart()
      : base64File;
    const base64ToBuffer = Buffer.from(base64FileWithNoHeader, 'base64');

    fs.writeFileSync(tempFilePath, base64ToBuffer);

    return {
      path: tempFilePath,
      mimeType,
    };
  } catch (err) {
    throw err;
  }
};
