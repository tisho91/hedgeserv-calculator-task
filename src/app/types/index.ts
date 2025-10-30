
export enum Operation {
  ADD = '+',
  SUBTRACT = '-',
  MULTIPLY = '×',
  DIVIDE = '÷',

  CLEAR = 'CLEAR',
  REMOVE_LAST = 'REMOVE_LAST',
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
