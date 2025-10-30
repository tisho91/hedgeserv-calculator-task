import {Button, Operation} from "../types";

export const keyboardMap: Record<string, Operation | string> = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '+': Operation.ADD,
  '-': Operation.SUBTRACT,
  '*': Operation.MULTIPLY,
  '/': Operation.DIVIDE,
  'Enter': Operation.EQUAL,
  '=': Operation.EQUAL,
  'Backspace': Operation.BACKSPACE,
  'c': Operation.CLEAR,
  '.': Operation.DECIMAL,
  '%': Operation.PERCENTAGE
};


export const calculatorButtons: Button[][]  = [
  [{
    label: '⌫',
    value: Operation.BACKSPACE,
    type: 'operator',
  }, {
    label: 'AC', type: 'operator', value: Operation.CLEAR
  }, {
    label: '%',
    type: 'operator',
    value: Operation.PERCENTAGE
  }, {
    label: '÷',
    type: 'mathOperation',
    value: Operation.DIVIDE
  }],
  [{label: '7', type: 'number', value: '7'}, {label: '8', type: 'number', value: '8'}, {
    label: '9',
    type: 'number',
    value: '9'
  }, {
    label: '×',
    type: 'mathOperation',
    value: Operation.MULTIPLY
  }],
  [{label: '4', type: 'number', value: '4'}, {label: '5', type: 'number', value: '5'}, {
    label: '6',
    type: 'number',
    value: '6'
  }, {
    label: '-',
    type: 'mathOperation',
    value: Operation.SUBTRACT
  }],
  [{label: '1', type: 'number', value: '1'}, {label: '2', type: 'number', value: '2'}, {
    label: '3',
    type: 'number',
    value: '3'
  }, {
    label: '+',
    type: 'mathOperation',
    value: Operation.ADD
  }],
  [{label: '+/-', type: 'operator', value: Operation.TOGGLE_SIGN}, {label: '0', type: 'number', value: '0'}, {
    label: ',',
    type: 'operator',
    value: Operation.DECIMAL
  }, {
    label: '=',
    type: 'equal',
    value: Operation.EQUAL
  }],
]
