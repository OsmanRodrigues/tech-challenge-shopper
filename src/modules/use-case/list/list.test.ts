import { it, describe, before } from 'node:test';
import assert from 'node:assert';
import { listMeasuresUseCase } from './list';
import { startStorageServices } from '../../external/storage';
import { startAIServices } from '../../external/ai';
import { ErrorCode } from '../../../shared/constants';
import { MeasureType } from '../../model/measure.entity';

import type { ListMeasureRequestDTO } from 'src/modules/model/dto';

describe('Use case: list measures', undefined, () => {
  before(() => {
    startStorageServices();
    startAIServices();
  });

  it('Should list measures given customer code and measure type', async () => {
    const listRequestPayloadMock: ListMeasureRequestDTO = {
      customer_code: '1234',
      measure_type: MeasureType.GAS,
    };
    const listResponse = await listMeasuresUseCase(listRequestPayloadMock);

    assert.ok(listResponse);
    assert.ok(listResponse.customer_code);
    assert.ok(listResponse.measures);
  });
});
