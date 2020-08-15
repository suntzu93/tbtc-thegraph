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
}

export function handleBondReassigned(event: BondReassigned): void {
}

export function handleBondReleased(event: BondReleased): void {
  let contract = KeepBondingContract.bind(event.address);
  let operator = getOrCreateKeepMember(event.params.operator.toHex());
  operator.totalUnboundAvailable = toDecimal(contract.unbondedValue(event.params.operator));
  operator.save()

  let idKeepbonding = event.params.referenceID.toString();
  let keepBonding = getOrCreateKeepBonding(idKeepbonding);
  keepBonding.lockedBond = BIGDECIMAL_ZERO;
  keepBonding.save()
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
}

export function handleUnbondedValueWithdrawn(
  event: UnbondedValueWithdrawn
): void {
  let contract = KeepBondingContract.bind(event.address);
  let operator = getOrCreateKeepMember(event.params.operator.toHex());
  operator.totalUnboundAvailable = toDecimal(contract.unbondedValue(event.params.operator));
  operator.save()
}
