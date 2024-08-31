import { FileMetadataResponse } from '@google/generative-ai/server';

export enum MeasureType {
  WATER = 'WATER',
  GAS = 'GAS',
}
export enum MeasureValueStatus {
  INVALID = 'INVALID',
  VALID = 'VALID',
}
type MeasureEntity = {
  id: string;
  type: keyof typeof MeasureType;
  value?: number;
};
export type MeasureRecord = MeasureEntity & {
  createdAt?: string;
  collectedAt?: string;
  customerCode?: string;
  fileMetadata?: Pick<FileMetadataResponse, 'name' | 'uri'>;
  measureValueStatus?: keyof typeof MeasureValueStatus;
};
