import { Injectable } from '@angular/core';
import { Operation} from '../types';
import {BehaviorSubject, map} from 'rxjs';
import { create, all } from 'mathjs';

const math = create(all);


const mathOperations = [Operation.ADD, Operation.SUBTRACT, Operation.DIVIDE, Operation.MULTIPLY]
const errorStates: string[] = ['Infinity', '-Infinity', 'ERROR']

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {

  private tokens$ = new BehaviorSubject<string[]>([]);
  public history$ = new BehaviorSubject<string[][]>([]);

  private isResultState: boolean = false;

  public currentInput$ = this.tokens$.asObservable().pipe(
    map(tokens => tokens.length ? tokens.join('') : '0')
  );

  public lastOperation$ = new BehaviorSubject<string>('');

  private addToHistory(tokens: string[]) {
    const history = this.history$.value;
    this.history$.next([...history, [...tokens]]);
  }

  loadFromHistory(index: number) {
    const history = this.history$.value;
    const tokens = history[index];
    if (tokens) {
      this.tokens$.next([...tokens]);
    }
  }

  get history() {
    return this.history$.asObservable();
  }


  handleInput(input: string | Operation) {
    if (typeof input === 'string' && /^[0-9]$/.test(input)) {
      this.appendNumber(input);
    } else {
      switch (input) {
        case Operation.ADD:
        case Operation.SUBTRACT:
        case Operation.MULTIPLY:
        case Operation.DIVIDE:
          this.appendOperator(input);
          break;
        case Operation.DECIMAL:
          this.appendDecimal();
          break;
        case Operation.TOGGLE_SIGN:
          this.toggleSign();
          break;
        case Operation.PERCENTAGE:
          this.percentage();
          break;
        case Operation.EQUAL:
          this.evaluate();
          break;
        case Operation.CLEAR:
          this.clear();
          break;
        case Operation.BACKSPACE:
          this.backspace();
          break;
      }
    }
  }

  private appendNumber(num: string) {
    let tokens = [...this.tokens$.value];
    if (this.shouldStartNewExpression) {
      tokens = [num];
    } else {
      const last = tokens[tokens.length - 1];
      if (this.isLastElementNumber && !last.endsWith('%')) {
        tokens[tokens.length - 1] = last + num;
      } else {
        tokens.push(num);
      }
    }
    this.isResultState = false;
    this.tokens$.next(tokens);
  }

  private appendOperator(op: Operation) {
    const tokens = [...this.tokens$.value];
    const last = tokens[tokens.length - 1];
    if (!last) return;

    if (this.isOperator(last)) {
      tokens[tokens.length - 1] = op;
    } else {
      tokens.push(op);
    }

    this.tokens$.next(tokens);
    this.isResultState = false;
  }

  private appendDecimal() {
    const tokens = [...this.tokens$.value];
    const last = tokens[tokens.length - 1];

    if (this.shouldStartNewExpression) {
      tokens.push('0.');
    } else if (this.isLastElementNumber && !last.includes('.') && !last.endsWith('%')) {
      tokens[tokens.length - 1] = last + '.';
    } else if (!this.isLastElementNumber) {
      tokens.push('0.');
    }

    this.isResultState = false;
    this.tokens$.next(tokens);
  }

  private toggleSign() {
    if (errorStates.includes(this.lastElement)) return;
    const last = this.lastElement
    if (!last || this.isOperator(last)){
      return;
    }
    const tokens = [...this.tokens$.value];
    let core = last;

    let isNegative = core.startsWith('(-') && core.endsWith(')');
    if (isNegative) {
      core = core.replace(/^\(-(.+)\)$/, '$1');
    }

    let newToken = isNegative ? core : `(-${core})`;
    tokens.pop();
    tokens.push(newToken);
    this.tokens$.next(tokens);
    this.isResultState = false;
  }


  private percentage() {
    if (errorStates.includes(this.lastElement)) return;
    if (!this.isLastElementNumber && !this.lastElement?.endsWith('%')) return;

    const tokens = [...this.tokens$.value];
    const last = this.lastElement!;

    let updated: string;
    if (last.endsWith('%')) {
      updated = `(${last})%`;
    } else {
      updated = `${last}%`;
    }

    tokens.pop();
    tokens.push(updated);
    this.tokens$.next(tokens);
    this.isResultState = false;
  }


  private evaluate() {
    if (this.isOperator(this.lastElement) || this.tokens$.value.length < 2) {
      return;
    }
    try {
      const displayExpr =  this.tokens$.value.join('');
      const expr = displayExpr.replace(/×/g, '*').replace(/÷/g, '/');
      const result = math.evaluate(expr);
      this.lastOperation$.next(displayExpr);
      this.addToHistory(this.tokens$.value);
      this.tokens$.next([result.toString()]);
    } catch (e) {
      this.tokens$.next(['ERROR']);
    } finally {
      this.isResultState = true;
    }
  }

  private clear() {
    this.tokens$.next([]);
    this.lastOperation$.next('');
  }

  private backspace() {
    let tokens = [...this.tokens$.value];
    if (!tokens.length) return;

    let last = this.lastElement;

    if (
      this.isOperator(last)
      || errorStates.includes(last)
      || /^\(.+\)%$/.test(last)
      || /^\(.+\)$/.test(last)
      || /^[0-9]+%$/.test(last)
    ) {
      tokens.pop();
    } else {
      last = last.slice(0, -1);
      if (last === '') {
        tokens.pop();
      }
      else tokens[tokens.length - 1] = last;
    }

    this.tokens$.next(tokens);
  }

  private isOperator(token: string): boolean {
    return mathOperations.includes(token as Operation);
  }

  private parseNumber(str: string | null): number | null {
    if (!str) return null;
    const clean = str.replace(/[()]/g, '').replace(/%/g, '');
    return isNaN(Number(clean)) ? null : Number(clean);
  }

  get shouldStartNewExpression() {
    return  this.tokens$.value.length === 0 || errorStates.includes(this.lastElement)  || this.isResultState
  }

  get lastElement(): string {
    return this.tokens$.value.at(-1) || ''
  }


  get isLastElementNumber() {
    return this.parseNumber(this.lastElement) !== null;
  }
}
