import { it, describe, before } from 'node:test';
import assert from 'node:assert';
import { verifyMeasureUseCase } from './verify';
import { startStorageServices } from '../../external/storage';
import { startAIServices } from '../../external/ai';

import type { VerifyMeasureRequestDTO } from 'src/modules/model/dto';

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
});
