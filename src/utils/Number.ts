export class Number {
  static isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  static distBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
}
