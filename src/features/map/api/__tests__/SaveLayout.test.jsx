import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { saveLayout, useSaveLayout } from '../SaveLayout';
import { api } from '@/lib/apiClient';

describe('saveLayout API', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls POST /coconuts/layout with payload', async () => {
    const payload = { layout: [{ x: 1, z: 2, coconut_id: 10 }] };
    const postSpy = vi
      .spyOn(api, 'post')
      .mockResolvedValueOnce({ data: { ok: true } });

    const resp = await saveLayout(payload);

    expect(postSpy).toHaveBeenCalledWith('/coconuts/layout', payload);
    expect(resp).toEqual({ data: { ok: true } });
  });
});
