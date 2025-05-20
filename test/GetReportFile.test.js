import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import fs from 'fs';
import { jest } from '@jest/globals';

jest.unstable_mockModule('../utils/sessionManager.js', () => ({
  getSession: jest.fn(() => Promise.resolve('sid=123')),
}));

let getReportFile;

beforeEach(async () => {
  process.env.API_BASE_URL = 'https://example.com/api';
  const mock = new MockAdapter(axios);
  mock.onPost('').reply(200, 'filedata', {
    'content-disposition': 'attachment; filename="sample.pdf"',
  });
  jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
  ;({ action: getReportFile } = await import('../commands/GetReportFile.js'));
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('getReportFile posts and saves file', async () => {
  await getReportFile({ fileType: 'pdf', report: '1' });
  expect(fs.writeFileSync).toHaveBeenCalledWith('sample.pdf', 'filedata');
});
