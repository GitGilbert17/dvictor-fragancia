/**
 * Serializador seguro para Prisma (convierte BigInt a Number/String y Decimal a Number)
 */

export function serializeItem<T = any>(data: any): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === 'bigint') {
    return Number(data) as any;
  }

  // Objeto Decimal de Prisma (tiene método .toNumber())
  if (data && typeof data === 'object' && typeof data.toNumber === 'function') {
    return data.toNumber();
  }

  if (data instanceof Date) {
    return data.toISOString() as any;
  }

  if (Array.isArray(data)) {
    return data.map((item) => serializeItem(item)) as any;
  }

  if (typeof data === 'object') {
    const copy: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      copy[key] = serializeItem(value);
    }
    return copy as T;
  }

  return data;
}

// Parche global para evitar que JSON.stringify lance TypeError si encuentra un BigInt
if (typeof (BigInt.prototype as any).toJSON !== 'function') {
  (BigInt.prototype as any).toJSON = function () {
    return Number(this.toString());
  };
}
