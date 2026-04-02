export const startOfUtcDay = (value: string): Date => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
};

export const endOfUtcDay = (value: string): Date => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));
};
