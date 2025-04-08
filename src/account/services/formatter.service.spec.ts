import { FormatterService } from './formatter.service';

describe('FormatterService', () => {
  let service: FormatterService;

  beforeEach(() => {
    service = new FormatterService();
  });

  describe('formatCurrency', () => {
    it('should format a number as ARS currency', () => {
      const result = service.formatCurrency(1234.56);
      expect(result).toBe('$ 1.234,56');
    });
  });

  describe('formatPercentage', () => {
    it('should format a number as percentage', () => {
      const result = service.formatPercentage(45.6789);
      expect(result).toBe('45,68%');
    });
  });
});
