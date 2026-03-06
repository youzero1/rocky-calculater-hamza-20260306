export interface ICalculation {
  id: number;
  expression: string;
  result: string;
  createdAt: Date | string;
}

export const CalculationEntity = {
  name: 'Calculation',
  tableName: 'calculations',
  columns: {
    id: {
      primary: true,
      type: 'integer',
      generated: true,
    },
    expression: {
      type: 'varchar',
    },
    result: {
      type: 'varchar',
    },
    createdAt: {
      type: 'datetime',
      createDate: true,
    },
  },
};
