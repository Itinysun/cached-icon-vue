import { describe, it, expect } from 'vitest'
import { generateIconPath, parseIconName, legacyIconNameToFileName } from '../../src/utils/iconPath'

describe('iconPath utilities', () => {
  describe('parseIconName', () => {
    it('should parse icon names with colon separator', () => {
      expect(parseIconName('mdi:home')).toEqual({
        library: 'mdi',
        name: 'home',
      })

      expect(parseIconName('heroicons:heart-20-solid')).toEqual({
        library: 'heroicons',
        name: 'heart-20-solid',
      })
    })

    it('should parse icon names with dash separator', () => {
      expect(parseIconName('mdi-home')).toEqual({
        library: 'mdi',
        name: 'home',
      })

      expect(parseIconName('fa-user')).toEqual({
        library: 'fa',
        name: 'user',
      })

      expect(parseIconName('heroicons-heart-20-solid')).toEqual({
        library: 'heroicons',
        name: 'heart-20-solid',
      })
    })

    it('should handle unknown library names', () => {
      expect(parseIconName('unknown-icon-name')).toEqual({
        library: 'custom',
        name: 'unknown-icon-name',
      })

      expect(parseIconName('some-custom-icon')).toEqual({
        library: 'custom',
        name: 'some-custom-icon',
      })
    })

    it('should handle empty or invalid names', () => {
      expect(parseIconName('')).toEqual({
        library: 'unknown',
        name: 'unknown',
      })
    })

    it('should handle single part names', () => {
      expect(parseIconName('icon')).toEqual({
        library: 'custom',
        name: 'icon',
      })
    })
  })

  describe('generateIconPath', () => {
    it('should generate flat paths by default', () => {
      const result = generateIconPath('mdi:home')

      expect(result).toEqual({
        library: 'mdi',
        name: 'home',
        fileName: 'home.svg',
        fullPath: '/icons/mdi-home.svg',
      })
    })

    it('should generate organized paths when organizeByLibrary is true', () => {
      const result = generateIconPath('mdi:home', {
        organizeByLibrary: true,
      })

      expect(result).toEqual({
        library: 'mdi',
        name: 'home',
        fileName: 'home.svg',
        fullPath: '/icons/mdi/home.svg',
      })
    })

    it('should use custom icon path prefix', () => {
      const result = generateIconPath('mdi:home', {
        iconPathPrefix: '/assets/icons',
      })

      expect(result).toEqual({
        library: 'mdi',
        name: 'home',
        fileName: 'home.svg',
        fullPath: '/assets/icons/mdi-home.svg',
      })
    })

    it('should sanitize unsafe characters in file names', () => {
      const result = generateIconPath('test:icon/with:unsafe<chars>', {
        organizeByLibrary: true,
      })

      expect(result).toEqual({
        library: 'test',
        name: 'icon/with:unsafe<chars>',
        fileName: 'icon-with-unsafe-chars.svg',
        fullPath: '/icons/test/icon-with-unsafe-chars.svg',
      })
    })

    it('should handle complex icon names', () => {
      const result = generateIconPath('heroicons:outline/heart-20-solid')

      expect(result).toEqual({
        library: 'heroicons',
        name: 'outline/heart-20-solid',
        fileName: 'outline-heart-20-solid.svg',
        fullPath: '/icons/heroicons-outline-heart-20-solid.svg',
      })
    })

    it('should handle organized structure with complex names', () => {
      const result = generateIconPath('heroicons:outline/heart-20-solid', {
        organizeByLibrary: true,
      })

      expect(result).toEqual({
        library: 'heroicons',
        name: 'outline/heart-20-solid',
        fileName: 'outline-heart-20-solid.svg',
        fullPath: '/icons/heroicons/outline-heart-20-solid.svg',
      })
    })

    it('should handle custom library names', () => {
      const result = generateIconPath('my-custom-icon', {
        organizeByLibrary: true,
      })

      expect(result).toEqual({
        library: 'custom',
        name: 'my-custom-icon',
        fileName: 'my-custom-icon.svg',
        fullPath: '/icons/custom/my-custom-icon.svg',
      })
    })
  })

  describe('legacyIconNameToFileName', () => {
    it('should replace colons with dashes for backward compatibility', () => {
      expect(legacyIconNameToFileName('mdi:home')).toBe('mdi-home')
      expect(legacyIconNameToFileName('heroicons:heart-20-solid')).toBe('heroicons-heart-20-solid')
      expect(legacyIconNameToFileName('fa:solid:user')).toBe('fa-solid-user')
    })

    it('should handle names without colons', () => {
      expect(legacyIconNameToFileName('mdi-home')).toBe('mdi-home')
      expect(legacyIconNameToFileName('icon')).toBe('icon')
    })
  })
})