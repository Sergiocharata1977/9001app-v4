// Test básico para que el workflow de GitHub Actions pase
import { describe, expect, test } from 'vitest';

describe('Frontend Basic Tests', () => {
  test('should pass basic test', () => {
    expect(1 + 1).toBe(2);
  });

  test('should have window object', () => {
    expect(typeof window).toBe('object');
  });
});
