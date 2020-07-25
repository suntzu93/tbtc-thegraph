import { BigInt , log} from "@graphprotocol/graph-ts"
import {
  KeepBondingContract,
  BondCreated,
  BondReassigned,
  BondReleased,
  BondSeized,
  UnbondedValueDeposited,
  UnbondedValueWithdrawn
} from "../generated/KeepBondingContract/KeepBondingContract"

import {
  getOrCreateKeepBonding,
  getOrCreateKeepMember
} from "./utils/helpers";
import { toDecimal } from "./utils/decimals";
import { BIGDECIMAL_ZERO } from "./utils/contants";

export function handleBondCreated(event: BondCreated): void {
  let contract = KeepBondingContract.bind(event.address);
  let idKeepbonding = event.params.holder.toHex();
  let keepBonding = getOrCreateKeepBonding(idKeepbonding);
  keepBonding.holder =event.params.holder;
  keepBonding.referenceID = event.params.referenceID;
  keepBonding.sortitionPool = event.params.sortitionPool;
  keepBonding.lockedBond = keepBonding.lockedBond.plus(toDecimal(contract.bondAmount(event.params.operator,event.params.holder,event.params.referenceID)));
  keepBonding.bondedECDSAKeep =event.params.holder.toHex();
  keepBonding.save()

  let operator = getOrCreateKeepMember(event.params.operator.toHex());
  let keeps = operator.keeps;
  keeps.push(keepBonding.id);
  operator.keeps = keeps;
  operator.totalUnboundAvailable = operator.totalUnboundAvailable.plus(toDecimal(contract.unbondedValue(event.params.operator)));
  operator.save()

  // log.error("handleBondCreated holder = {},amount ={} ,operator = {}, referenceID = {}, sortitionPool = {}, txHash = {}, from = {}",[
  //   event.params.holder.toHex(),
  //   event.params.amount.toString(),
  //   event.params.operator.toHex(),
  //   event.params.referenceID.toString(),
  //   event.params.sortitionPool.toHex(),
  //   event.transaction.hash.toHex(),
  //   event.transaction.from.toHex()
  // ])
}

export function handleBondReassigned(event: BondReassigned): void {
  // log.error("handleBondReassigned holder = {},newReferenceID ={} ,operator = {}, referenceID = {}",[
  //   event.params.newHolder.toHex(),
  //   event.params.newReferenceID.toHex(),
  //   event.params.operator.toHex(),
  //   event.params.referenceID.toString()
  // ])
}

// Chuyển từ locked sang avalible.
export function handleBondReleased(event: BondReleased): void {
  let contract = KeepBondingContract.bind(event.address);
  let operator = getOrCreateKeepMember(event.params.operator.toHex());
  operator.totalUnboundAvailable = toDecimal(contract.unbondedValue(event.params.operator));
  operator.save()

  let idKeepbonding = event.params.referenceID.toString();
  let keepBonding = getOrCreateKeepBonding(idKeepbonding);
  keepBonding.lockedBond = BIGDECIMAL_ZERO;
  keepBonding.save()

  // log.error("handleBondReleased operator = {}, referenceID = {} , from = {}",[
  //   event.params.operator.toHex(),
  //   event.params.referenceID.toHex(),
  //   event.transaction.from.toHex()
  // ])
}

export function handleBondSeized(event: BondSeized): void {
  let operator = getOrCreateKeepMember(event.params.operator.toHex());
  operator.destination = event.params.destination;
  operator.seizeAmount = toDecimal(event.params.amount);
  operator.save()
}

export function handleUnbondedValueDeposited(
  event: UnbondedValueDeposited
): void {
  let contract = KeepBondingContract.bind(event.address);
  let operator = getOrCreateKeepMember(event.params.operator.toHex());
  operator.totalUnboundAvailable = toDecimal(contract.unbondedValue(event.params.operator));
  operator.save()

  // log.error("UnbondedValueDeposited operator = {}, amount = {} , from = {} , to {}",[
  //   event.params.operator.toHex(),
  //   toDecimal(event.params.amount).toString(),
  //   event.transaction.from.toHex(),
  //   event.transaction.to.toHex()
  // ])
}

// Rút 1 phần tiền từ bonding về ví cá nhân. Trừ của availible đi.
export function handleUnbondedValueWithdrawn(
  event: UnbondedValueWithdrawn
): void {
  let contract = KeepBondingContract.bind(event.address);
  let operator = getOrCreateKeepMember(event.params.operator.toHex());
  operator.totalUnboundAvailable = toDecimal(contract.unbondedValue(event.params.operator));
  operator.save()

  // log.error("UnbondedValueWithdrawn operator = {}, amount = {}",[
  //   event.params.operator.toHex(),
  //   toDecimal(event.params.amount).toString()
  // ])
}
