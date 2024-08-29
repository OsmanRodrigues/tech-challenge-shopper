import { it, describe } from 'node:test';
import assert from 'node:assert';
import { MeasureRegisterRequestDTO } from '../model/dto';
import { registerMeasureUseCase } from './register';

describe('Use case: register measure', undefined, () => {
  it('Should register a measure', async () => {
    const registerRequestPayload: MeasureRegisterRequestDTO = {
      customer_code: '1234',
      image: 'abcd',
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
