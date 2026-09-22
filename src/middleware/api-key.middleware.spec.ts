import { ApiKeyMiddleware } from './api-key.middleware.js';

describe('ApiKeyMiddleware', () => {
  const originalApiKey = process.env.API_KEY;

  afterEach(() => {
    process.env.API_KEY = originalApiKey;
  });

  it('should be defined', () => {
    expect(new ApiKeyMiddleware()).toBeDefined();
  });

  it('allows a request with the configured API key', () => {
    process.env.API_KEY = 'test-api-key';
    const next = vi.fn();
    const request = { headers: { 'x-api-key': 'test-api-key' } } as never;

    new ApiKeyMiddleware().use(request, {} as never, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it('rejects a request with an invalid API key', () => {
    process.env.API_KEY = 'test-api-key';
    const next = vi.fn();
    const request = { headers: { 'x-api-key': 'wrong-key' } } as never;

    expect(() =>
      new ApiKeyMiddleware().use(request, {} as never, next),
    ).toThrow('Invalid API key');
    expect(next).not.toHaveBeenCalled();
  });
});
