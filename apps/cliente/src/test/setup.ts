import '@testing-library/jest-dom/vitest'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { vi } from 'vitest'

afterEach(() => {
  cleanup()
})

beforeAll(() => {
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-service-role-key')
  vi.stubEnv('INTERNAL_ALLOWED_EMAILS', 'admin@test.com')
  vi.stubEnv('INTERNAL_ALLOWED_DOMAINS', '')
  vi.stubEnv('NEXT_PUBLIC_ENABLE_INTERNAL_DEMO_LOGIN', 'false')
})