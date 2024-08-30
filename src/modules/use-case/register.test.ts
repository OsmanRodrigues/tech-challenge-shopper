import { it, describe, before } from 'node:test';
import assert from 'node:assert';
import { MeasureRegisterRequestDTO } from '../model/dto';
import { registerMeasureUseCase } from './register';
import { startStorageServices } from '../external/storage';
import { startAIServices } from '../external/ai';
import fs from 'node:fs';

const base64Mock = fs.readFileSync('test-sample.jpg', 'base64');

describe('Use case: register measure', undefined, () => {
  before(() => {
    startStorageServices();
    startAIServices();
  });

  it('Should register a measure', async () => {
    const registerRequestPayload: MeasureRegisterRequestDTO = {
      customer_code: '1234',
      image: base64Mock,
      measure_datetime: '2024-08-29T00:09:52.312315Z',
      measure_type: 'GAS',
    };
    const registerResponse = await registerMeasureUseCase(
      registerRequestPayload
    );

    assert.ok(registerResponse);
    assert.ok(registerResponse.image_url);
    assert.ok(registerResponse.measure_uuid);
    assert.ok(registerResponse.measure_value);
  });
});
