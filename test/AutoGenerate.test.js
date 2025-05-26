import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import fs from 'fs';
import { jest } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';

jest.unstable_mockModule('../utils/sessionManager.js', () => ({
  getSession: jest.fn(() => Promise.resolve('sid=123')),
}));

let autoGenerate;

beforeEach(async () => {
  process.env.API_BASE_URL = 'https://example.com';
  const mock = new MockAdapter(axios);
  mock.onPost('https://example.com/ConMasAPI/Rests/APIExecute.aspx').reply(200, 'ok');
  jest.spyOn(fs, 'createReadStream').mockReturnValue({});
  jest.spyOn(axios, 'post');
  ;({ action: autoGenerate } = await import('../commands/AutoGenerate.js'));
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('autoGenerate posts form data', async () => {
  const tmp = path.join(path.dirname(fileURLToPath(import.meta.url)), 'tmp.txt');
  fs.writeFileSync(tmp, 'data');
  await autoGenerate({ type: 'csv', dataFile: tmp, encoding: 'utf8' });
  expect(axios.post).toHaveBeenCalled();
  fs.unlinkSync(tmp);
});
