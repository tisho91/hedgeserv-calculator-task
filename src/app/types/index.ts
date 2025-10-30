
export enum Operation {
  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '×',
  DIVIDE = '÷',

  CLEAR = 'CLEAR',
  BACKSPACE = 'BACKSPACE',
  TOGGLE_SIGN = 'TOGGLE_SIGN',
  PERCENTAGE = '%',
  DECIMAL = '.',
  EQUAL = '='
}


export interface Button {
  label: string ;
  value: Operation| string ;
  type: 'number' | 'operator' | 'mathOperation' | 'equal';
}
