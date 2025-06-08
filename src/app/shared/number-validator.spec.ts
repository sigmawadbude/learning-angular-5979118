import { FormControl } from '@angular/forms';
import { NumberValidators } from './number.validator';

describe('NumberValidators', () => {
  describe('range', () => {
    const validator = NumberValidators.range(1, 5);

    it('should return null for value within range', () => {
      const control = new FormControl(3);
      expect(validator(control)).toBeNull();
    });

    it('should return error object for value below range', () => {
      const control = new FormControl(0);
      expect(validator(control)).toEqual({ range: true });
    });

    it('should return error object for value above range', () => {
      const control = new FormControl(6);
      expect(validator(control)).toEqual({ range: true });
    });

    it('should return error object for non-numeric value', () => {
      const control = new FormControl('abc');
      expect(validator(control)).toEqual({ range: true });
    });

    it('should return null for null or empty string', () => {
      const nullControl = new FormControl(null);
      const emptyControl = new FormControl('');
      expect(validator(nullControl)).toBeNull();
      expect(validator(emptyControl)).toBeNull();
    });
  });
});
