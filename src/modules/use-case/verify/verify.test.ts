import { it, describe, before } from 'node:test';
import assert from 'node:assert';
import { verifyMeasureUseCase } from './verify';
import { startStorageServices } from '../../external/storage';
import { startAIServices } from '../../external/ai';

import type { VerifyMeasureRequestDTO } from 'src/modules/model/dto';
import { ErrorCode } from 'src/shared/constants';

describe('Use case: verify measure', undefined, () => {
  before(() => {
    startStorageServices();
    startAIServices();
  });

  it('Should verify a registered measure', async () => {
    const verifyRequestPayloadMock: VerifyMeasureRequestDTO = {
      confirmed_value: 78082,
      measure_uuid: '5241dac2-dde1-4c44-b6e3-14913ded71b3',
    };
    const verifyResponse = await verifyMeasureUseCase(verifyRequestPayloadMock);

    assert.ok(verifyResponse);
    assert.ok(verifyResponse.success);
  });
  it('Should throw invalid data error once request payload has wrong data', async () => {
    const wrongDataPayload = {
      confirmed_value: '1234',
      measure_uuid: 'abc1234',
    };
    try {
      const verifyResponse: any = await verifyMeasureUseCase(
        wrongDataPayload as any
      );
    } catch (err: any) {
      assert.deepStrictEqual(err.status, 400);
      assert.deepStrictEqual(err.error_code, ErrorCode.INVALID_DATA);
      assert.ok(err.error_description);
    }
  });
  it('Should throw not found error once a measure record not found', async () => {
    const wrongDataPayload = {
      confirmed_value: 12345,
      measure_uuid: '6029812c-3879-410c-a4e7-946d0941d15d',
    };
    try {
      const verifyResponse: any = await verifyMeasureUseCase(
        wrongDataPayload as any
      );
    } catch (err: any) {
      assert.deepStrictEqual(err.status, 404);
      assert.deepStrictEqual(err.error_code, ErrorCode.MEASURE_NOT_FOUND);
      assert.ok(err.error_description);
    }
  });
  it('Should throw confirmation duplicate error once a measure already verified', async () => {
    const dataPayload = {
      confirmed_value: 12345,
      measure_uuid: 'dae46f67-f39f-40f4-bdff-eb1cee28b03f',
    };
    try {
      const verifyResponse: any = await verifyMeasureUseCase(
        dataPayload as any
      );
    } catch (err: any) {
      assert.deepStrictEqual(err.status, 409);
      assert.deepStrictEqual(err.error_code, ErrorCode.CONFIRMATION_DUPLICATE);
      assert.ok(err.error_description);
    }
  });
});
