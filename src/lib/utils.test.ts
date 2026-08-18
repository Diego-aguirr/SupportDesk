import { describe, it, expect } from 'vitest';
import { cn, formatDate } from './utils';

describe('cn', () => {
  it('merges class names', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const result = cn('base', false && 'hidden', 'end');
    expect(result).toBe('base end');
  });

  it('deduplicates conflicting Tailwind classes', () => {
    const result = cn('px-4', 'px-8');
    expect(result).toBe('px-8');
  });
});

describe('formatDate', () => {
  it('formats ISO string to readable date', () => {
    const result = formatDate('2026-01-15T10:30:00.000Z');
    expect(result).toContain('2026');
    expect(result).toContain('Jan');
  });

  it('handles different ISO formats', () => {
    const result = formatDate('2025-12-25T00:00:00.000Z');
    expect(result).toContain('2025');
    expect(result).toContain('Dec');
  });
});
