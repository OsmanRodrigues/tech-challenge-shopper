import { it, describe, before } from 'node:test';
import assert from 'node:assert';
import { MeasureRegisterRequestDTO } from '../model/dto';
import { registerMeasureUseCase } from './register';
import { startStorageServices } from '../external/storage';
import { startAIServices } from '../external/ai';
import fs from 'node:fs';

//NOTE comment test image file or base64 for select base64 mock consume
// const base64Mock = fs.readFileSync('test-sample.jpeg', 'base64');
const base64Mock = fs.readFileSync('test-sample-base64', 'utf8');

describe('Use case: register measure', undefined, () => {
  before(() => {
    startStorageServices();
    startAIServices();
  });

  it('Should register a measure', async () => {
    const registerRequestPayload: MeasureRegisterRequestDTO = {
      customer_code: '12345',
      image: base64Mock,
      measure_datetime: '2024-08-29T00:09:52.312315Z',
      measure_type: 'WATER',
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
