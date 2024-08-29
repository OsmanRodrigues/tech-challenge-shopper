import { test } from 'node:test';
import assert from 'node:assert';
import { sum } from './test-fn';

test('sum', () => {
  assert.deepStrictEqual(sum(1, 2), 4);
});
