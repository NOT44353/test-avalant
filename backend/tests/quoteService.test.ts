import { QuoteService } from '../src/services/QuoteService';

describe('QuoteService', () => {
  let quoteService: QuoteService;

  beforeEach(() => {
    quoteService = new QuoteService();
  });

  describe('getSnapshot', () => {
    it('should return quotes for requested symbols', () => {
      const symbols = ['AAPL', 'MSFT'];
      const snapshot = quoteService.getSnapshot(symbols);
      
      expect(snapshot).toBeDefined();
      expect(Object.keys(snapshot)).toEqual(expect.arrayContaining(symbols));
    });

    it('should return valid quote structure', () => {
      const symbols = ['AAPL'];
      const snapshot = quoteService.getSnapshot(symbols);
      
      const quote = snapshot['AAPL'];
      expect(quote).toHaveProperty('symbol', 'AAPL');
      expect(quote).toHaveProperty('price');
      expect(quote).toHaveProperty('ts');
      expect(typeof quote.price).toBe('number');
      expect(typeof quote.ts).toBe('string');
    });
  });

  describe('getSymbols', () => {
    it('should return available symbols', () => {
      const symbols = quoteService.getSymbols();
      
      expect(Array.isArray(symbols)).toBe(true);
      expect(symbols.length).toBeGreaterThan(0);
    });
  });

  describe('addSymbol and removeSymbol', () => {
    it('should add new symbol', () => {
      const newSymbol = 'TEST';
      quoteService.addSymbol(newSymbol);
      
      const symbols = quoteService.getSymbols();
      expect(symbols).toContain(newSymbol);
    });

    it('should remove symbol', () => {
      const symbolToRemove = 'AAPL';
      quoteService.removeSymbol(symbolToRemove);
      
      const symbols = quoteService.getSymbols();
      expect(symbols).not.toContain(symbolToRemove);
    });
  });

  describe('startUpdates and stopUpdates', () => {
    it('should start and stop updates', () => {
      expect(() => quoteService.startUpdates(10)).not.toThrow();
      expect(() => quoteService.stopUpdates()).not.toThrow();
    });
  });
});
