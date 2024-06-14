import * as api from '../api';
import * as main from '../index';

jest.mock('../../src/api');

describe('test 0', () => {
  test('test 0 1', () => {
    const mockApi = api as jest.Mocked<typeof api>;

    main.createMediajelTracker('sp1');

    expect(mockApi.createTracker).toHaveBeenCalled();
  });
});
