import { BigDecimal, BigInt, Bytes, Address, Value } from "@graphprotocol/graph-ts";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const TBTC_CONTRACT = "0x1bbe271d15bb64df0bc6cd28df9ff322f2ebd847";
export let BIGINT_ZERO = BigInt.fromI32(0);
export let BIGINT_ONE = BigInt.fromI32(1);
export let BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export let MAX_SUPPLY = BigInt.fromI32(21000000);