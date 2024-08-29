import type { FileMetadataResponse } from '@google/generative-ai/dist/server/server';

type MeasureType = 'WATER' | 'GAS';
type MeasureEntity = {
  id: string;
  type: MeasureType;
  value?: number;
};
export type MeasureValueStatus = 'INVALID' | 'VALID';
export type MeasureRecord = MeasureEntity & {
  createdAt?: string;
  collectedAt?: string;
  customerCode?: string;
  fileMetadata?: Pick<FileMetadataResponse, 'name' | 'uri'>;
  measureValueStatus?: MeasureValueStatus;
};
