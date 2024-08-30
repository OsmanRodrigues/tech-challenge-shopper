import { it, describe, before, todo } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import { registerMeasureUseCase } from './register';
import { startStorageServices } from '../external/storage';
import { startAIServices } from '../external/ai';
import { ErrorCode } from '../../shared/constants';

import type { MeasureRegisterRequestDTO } from '../model/dto';

//NOTE comment test image file or base64 for select base64 mock consume
// const base64Mock = fs.readFileSync('test-sample.jpeg', 'base64');
const base64Mock = fs.readFileSync('test-sample-base64', 'utf8');

const registerRequestPayloadMock: MeasureRegisterRequestDTO = {
  customer_code: '12345',
  image: base64Mock,
  measure_datetime: '2024-05-29T00:09:52.312315Z',
  measure_type: 'WATER',
};

describe('Use case: register measure', undefined, () => {
  before(() => {
    startStorageServices();
    startAIServices();
  });

  it('Should register a measure', async () => {
    const registerResponse = await registerMeasureUseCase(
      registerRequestPayloadMock
    );

    assert.ok(registerResponse);
    assert.ok(registerResponse.image_url);
    assert.ok(registerResponse.measure_uuid);
    assert.ok(registerResponse.measure_value);
  });
  it('Should throw invalid data error once request payload has wrong data', async () => {
    const wrongDataPayload = {
      customer_code: 12345,
      image: null,
      measure_datetime: '29/08/2024',
      measure_type: 'agua',
    };
    try {
      const registerResponse: any = await registerMeasureUseCase(
        wrongDataPayload as any
      );
    } catch (err: any) {
      assert.deepStrictEqual(err.status, 400);
      assert.deepStrictEqual(err.error_code, ErrorCode.INVALID_DATA);
      assert.ok(err.error_description);
    }
  });
  it('Should throw double report error once already exist a measure for the current month', async () => {
    try {
      const registerResponse = await registerMeasureUseCase(
        registerRequestPayloadMock
      );
    } catch (err: any) {
      assert.deepStrictEqual(err.status, 409);
      assert.deepStrictEqual(err.error_code, ErrorCode.DOUBLE_REPORT);
      assert.ok(err.error_description);
    }
  });
});
