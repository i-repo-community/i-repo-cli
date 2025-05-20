import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../utils/sessionManager.js', () => ({
  getSession: jest.fn(() => Promise.resolve('sid=123')),
}));

let getReportDetail;

beforeEach(async () => {
  process.env.API_BASE_URL = 'https://example.com/api';
  const mock = new MockAdapter(axios);
  mock.onPost('').reply(200, '<xml></xml>');
  ;({ action: getReportDetail } = await import('../commands/GetReportDetail.js'));
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('getReportDetail posts and returns data', async () => {
  const data = await getReportDetail('1');
  expect(data).toBe('<xml></xml>');
});
