import { describe, expect, it } from 'vitest';
import { formatTagsInput, parseTagsInput } from '../noteTags';

describe('noteTags', () => {
  it('parses comma-separated tags', () => {
    expect(parseTagsInput('grâce, prière, étude')).toEqual(['grâce', 'prière', 'étude']);
  });

  it('normalizes case and trims whitespace', () => {
    expect(parseTagsInput('  Grâce ,PRIÈRE ')).toEqual(['grâce', 'prière']);
  });

  it('removes duplicates and empty entries', () => {
    expect(parseTagsInput('grâce,,grâce, ,Grâce')).toEqual(['grâce']);
    expect(parseTagsInput('')).toEqual([]);
  });

  it('formats tags back to an input value', () => {
    expect(formatTagsInput(['grâce', 'prière'])).toBe('grâce, prière');
    expect(formatTagsInput(undefined)).toBe('');
  });
});
