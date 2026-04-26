import { describe, it, expect, vi, afterEach } from 'vitest'
import { isInternalEmail, isInternalDemoEnabled, hasDemoInternalSession } from '../internal-access'

vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')
vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-service-role-key')
vi.stubEnv('INTERNAL_ALLOWED_EMAILS', '')
vi.stubEnv('INTERNAL_ALLOWED_DOMAINS', '')
vi.stubEnv('NEXT_PUBLIC_ENABLE_INTERNAL_DEMO_LOGIN', 'false')

describe('internal-access', () => {
  describe('isInternalEmail', () => {
    it('should return false for null/undefined/empty email', () => {
      expect(isInternalEmail(null)).toBe(false)
      expect(isInternalEmail(undefined)).toBe(false)
      expect(isInternalEmail('')).toBe(false)
    })

    it('should return true for email in INTERNAL_ALLOWED_EMAILS', () => {
      vi.stubEnv('INTERNAL_ALLOWED_EMAILS', 'admin@muga.dev,test@muga.dev')
      vi.stubEnv('INTERNAL_ALLOWED_DOMAINS', '')
      
      expect(isInternalEmail('admin@muga.dev')).toBe(true)
      expect(isInternalEmail('test@muga.dev')).toBe(true)
      expect(isInternalEmail('other@muga.dev')).toBe(false)
    })

    it('should return true for domain in INTERNAL_ALLOWED_DOMAINS', () => {
      vi.stubEnv('INTERNAL_ALLOWED_EMAILS', '')
      vi.stubEnv('INTERNAL_ALLOWED_DOMAINS', 'muga.dev,company.com')
      
      expect(isInternalEmail('user@muga.dev')).toBe(true)
      expect(isInternalEmail('anyone@company.com')).toBe(true)
      expect(isInternalEmail('user@other.com')).toBe(false)
    })

    it('should handle case insensitive matching', () => {
      vi.stubEnv('INTERNAL_ALLOWED_EMAILS', 'Admin@Muga.dev')
      vi.stubEnv('INTERNAL_ALLOWED_DOMAINS', '')
      
      expect(isInternalEmail('ADMIN@MUGA.DEV')).toBe(true)
      expect(isInternalEmail('admin@muga.dev')).toBe(true)
    })

    it('should handle comma-separated lists', () => {
      vi.stubEnv('INTERNAL_ALLOWED_EMAILS', '  admin@muga.dev , test@company.com , manager@org.net  ')
      vi.stubEnv('INTERNAL_ALLOWED_DOMAINS', '')
      
      expect(isInternalEmail('admin@muga.dev')).toBe(true)
      expect(isInternalEmail('test@company.com')).toBe(true)
      expect(isInternalEmail('manager@org.net')).toBe(true)
    })

    afterEach(() => {
      vi.stubEnv('INTERNAL_ALLOWED_EMAILS', '')
      vi.stubEnv('INTERNAL_ALLOWED_DOMAINS', '')
    })
  })

  describe('isInternalDemoEnabled', () => {
    it('should return false when env is not set', () => {
      vi.stubEnv('ENABLE_INTERNAL_DEMO_LOGIN', '')
      vi.stubEnv('NEXT_PUBLIC_ENABLE_INTERNAL_DEMO_LOGIN', '')
      
      expect(isInternalDemoEnabled()).toBe(false)
    })

    it('should return true for "true"', () => {
      vi.stubEnv('ENABLE_INTERNAL_DEMO_LOGIN', 'true')
      vi.stubEnv('NEXT_PUBLIC_ENABLE_INTERNAL_DEMO_LOGIN', '')
      
      expect(isInternalDemoEnabled()).toBe(true)
    })

    it('should return true for "1"', () => {
      vi.stubEnv('ENABLE_INTERNAL_DEMO_LOGIN', '')
      vi.stubEnv('NEXT_PUBLIC_ENABLE_INTERNAL_DEMO_LOGIN', '1')
      
      expect(isInternalDemoEnabled()).toBe(true)
    })

    it('should return true for "yes"', () => {
      vi.stubEnv('ENABLE_INTERNAL_DEMO_LOGIN', '')
      vi.stubEnv('NEXT_PUBLIC_ENABLE_INTERNAL_DEMO_LOGIN', 'yes')
      
      expect(isInternalDemoEnabled()).toBe(true)
    })
  })

  describe('hasDemoInternalSession', () => {
    it('should return false when demo is not enabled', () => {
      vi.stubEnv('ENABLE_INTERNAL_DEMO_LOGIN', 'false')
      vi.stubEnv('NEXT_PUBLIC_ENABLE_INTERNAL_DEMO_LOGIN', 'false')
      
      expect(hasDemoInternalSession('1')).toBe(false)
      expect(hasDemoInternalSession(null)).toBe(false)
    })

    it('should return true only when demo enabled and cookie is "1"', () => {
      vi.stubEnv('ENABLE_INTERNAL_DEMO_LOGIN', 'true')
      vi.stubEnv('NEXT_PUBLIC_ENABLE_INTERNAL_DEMO_LOGIN', 'false')
      
      expect(hasDemoInternalSession('1')).toBe(true)
      expect(hasDemoInternalSession('true')).toBe(false)
      expect(hasDemoInternalSession(null)).toBe(false)
      expect(hasDemoInternalSession(undefined)).toBe(false)
    })
  })
})
