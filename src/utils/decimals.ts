import { BigDecimal, BigInt } from '@graphprotocol/graph-ts'

export const DEFAULT_DECIMALS = 18
export const DEFAULT_DECIMALS_BTC = 8

export function pow(base: BigDecimal, exponent: number): BigDecimal {
  let result = base

  if (exponent == 0) {
    return BigDecimal.fromString('1')
  }

  for (let i = 2; i <= exponent; i++) {
    result = result.times(base)
  }

  return result
}

export function toDecimal(value: BigInt, decimals: number = DEFAULT_DECIMALS): BigDecimal {
  let precision = BigInt.fromI32(10)
    .pow(<u8>decimals)
    .toBigDecimal()

  return value.divDecimal(precision)
}

export function toDecimalBtc(value: BigInt, decimals: number = DEFAULT_DECIMALS_BTC): BigDecimal {
  return toDecimal(value,DEFAULT_DECIMALS_BTC);
}