import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import fs from 'fs';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../utils/sessionManager.js', () => ({
  getSession: jest.fn(() => Promise.resolve('sid=123')),
}));

let downloadCsv;

beforeEach(async () => {
  process.env.API_BASE_URL = 'https://example.com/api';
  const mock = new MockAdapter(axios);
  mock.onPost('').reply(200, 'zipdata');
  jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
  ;({ action: downloadCsv } = await import('../commands/DownloadCsv.js'));
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('downloadCsv posts and saves file', async () => {
  await downloadCsv({ reportId: '1' });
  expect(fs.writeFileSync).toHaveBeenCalledWith('report.zip', 'zipdata');
});
