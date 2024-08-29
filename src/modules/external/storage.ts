import fs from 'node:fs';
import {
  GoogleAIFileManager,
  FileMetadataResponse,
} from '@google/generative-ai/server';

const fileManagerKey = process.env?.GEMINI_API_KEY;
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
    if (!fileManagerKey) throw new Error('File manager API key not provided.');

    fileManager = new GoogleAIFileManager(fileManagerKey);
  }
};
export const setDBItem = (key: string, value: any) => {
  if (db === null) startStorageServices();

  if (typeof db === 'object') {
    db![key] = value;
    fs.writeFileSync(dbFileName, JSON.stringify(db));
    db = JSON.parse(fs.readFileSync(dbFileName).toString());
  }
};
export const getDBItem = (key: string | number) => {
  if (db === null) {
    startStorageServices();
  }

  if (typeof key === 'number') {
    return Object.values(db!)?.[key];
  }

  return db?.[key];
};
export const uploadFile = async (
  filePath: string,
  mimeType: FileMetadataResponse['mimeType'],
  displayName: FileMetadataResponse['displayName']
) => {
  if (fileManager === null) startStorageServices();

  const uploadResponse = await fileManager!.uploadFile(filePath, {
    mimeType,
    displayName,
  });

  console.log(
    `> Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
  );

  setDBItem(uploadResponse.file.name, { ...uploadResponse.file });

  return uploadResponse;
};
export const getFile = async (fileName: string) => {
  if (fileManager === null) startStorageServices();

  const getResponse = await fileManager!.getFile(fileName);

  return getResponse;
};
