import { CalculatorService } from './calculator-service';
import { Operation } from '../types';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    service = new CalculatorService();
  });

  it('should start with empty tokens and history', () => {
    expect((service as any).tokens$.value).toEqual([]);
    expect((service as any).history$.value).toEqual([]);
  });

  it('should append numbers correctly', () => {
    service.handleInput('1');
    service.handleInput('2');
    expect((service as any).tokens$.value).toEqual(['12']);
  });

  it('should append operators correctly', () => {
    service.handleInput('1');
    service.handleInput(Operation.ADD);
    expect((service as any).tokens$.value).toEqual(['1', Operation.ADD]);
  });

  it('should replace last operator if two entered consecutively', () => {
    service.handleInput('1');
    service.handleInput(Operation.ADD);
    service.handleInput(Operation.MULTIPLY);
    expect((service as any).tokens$.value).toEqual(['1', Operation.MULTIPLY]);
  });

  it('should handle decimal points properly', () => {
    service.handleInput('3');
    service.handleInput(Operation.DECIMAL);
    service.handleInput('5');
    expect((service as any).tokens$.value).toEqual(['3.5']);
  });

  it('should toggle sign', () => {
    service.handleInput('8');
    service.handleInput(Operation.TOGGLE_SIGN);
    expect((service as any).tokens$.value).toEqual(['(-8)']);
    service.handleInput(Operation.TOGGLE_SIGN);
    expect((service as any).tokens$.value).toEqual(['8']);
  });

  it('should apply percentage properly', () => {
    service.handleInput('5');
    service.handleInput(Operation.PERCENTAGE);
    expect((service as any).tokens$.value).toEqual(['5%']);
  });

  it('should evaluate simple expressions', () => {
    service.handleInput('2');
    service.handleInput(Operation.ADD);
    service.handleInput('3');
    service.handleInput(Operation.EQUAL);

    expect((service as any).tokens$.value).toEqual(['5']);
    expect((service as any).lastOperation$.value).toBe('2+3');
    expect((service as any).history$.value.length).toBe(1);
  });

  it('should handle invalid expressions gracefully', () => {
    service.handleInput(Operation.ADD);
    service.handleInput(Operation.EQUAL);
    expect((service as any).tokens$.value).toEqual([]);
  });

  it('should clear tokens and lastOperation', () => {
    service.handleInput('2');
    service.handleInput(Operation.ADD);
    service.handleInput('3');
    service.handleInput(Operation.CLEAR);
    expect((service as any).tokens$.value).toEqual([]);
    expect((service as any).lastOperation$.value).toBe('');
  });

  it('should remove last input on backspace', () => {
    service.handleInput('9');
    service.handleInput('9');
    service.handleInput(Operation.BACKSPACE);
    expect((service as any).tokens$.value).toEqual(['9']);
  });

  it('should not backspace when empty', () => {
    service.handleInput(Operation.BACKSPACE);
    expect((service as any).tokens$.value).toEqual([]);
  });

  it('should add evaluated expression to history', () => {
    service.handleInput('4');
    service.handleInput(Operation.MULTIPLY);
    service.handleInput('2');
    service.handleInput(Operation.EQUAL);
    expect((service as any).history$.value.length).toBe(1);
  });

  it('should load from history', () => {
    const history = [['1', '+', '2']];
    (service as any).history$.next(history);
    service.loadFromHistory(0);
    expect((service as any).tokens$.value).toEqual(['1', '+', '2']);
  });

  it('should not load history if index invalid', () => {
    (service as any).history$.next([]);
    service.loadFromHistory(0);
    expect((service as any).tokens$.value).toEqual([]);
  });

  it('should start new expression after result', () => {
    service.handleInput('1');
    service.handleInput(Operation.ADD);
    service.handleInput('1');
    service.handleInput(Operation.EQUAL);
    service.handleInput('2');
    expect((service as any).tokens$.value).toEqual(['2']);
  });

  it('should replace operator if result followed by operator', () => {
    service.handleInput('3');
    service.handleInput(Operation.ADD);
    service.handleInput('3');
    service.handleInput(Operation.EQUAL);
    service.handleInput(Operation.MULTIPLY);
    expect((service as any).tokens$.value).toEqual(['6', Operation.MULTIPLY]);
  });

  it('should handle multiple percent expressions safely', () => {
    service.handleInput('1');
    service.handleInput(Operation.PERCENTAGE);
    service.handleInput(Operation.PERCENTAGE);
    expect((service as any).tokens$.value[0]).toEqual('(1%)%');
  });
});
