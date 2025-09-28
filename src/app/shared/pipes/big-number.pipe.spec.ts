import { BigNumberPipe } from './big-number.pipe';

describe('BigNumberPipe', () => {
  let pipe: BigNumberPipe;

  beforeEach(() => {
    pipe = new BigNumberPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null as any)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined as any)).toBe('');
  });

  it('should return empty string for empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should format small numbers without separator', () => {
    expect(pipe.transform('123')).toBe('123');
  });

  it('should format string with default separator (dot)', () => {
    expect(pipe.transform('1000')).toBe('1.000');
    expect(pipe.transform('1234567')).toBe('1.234.567');
  });

  it('should format bigint with default separator (dot)', () => {
    expect(pipe.transform(1234567n)).toBe('1.234.567');
  });

  it('should format with custom separator (comma)', () => {
    expect(pipe.transform('1234567', ',')).toBe('1,234,567');
  });
});
