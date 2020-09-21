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
  getOrCreateKeepMember,
  getOrCreateTotalBondedECDSAKeep,
} from "./utils/helpers";
import { toDecimal } from "./utils/decimals";
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from "./utils/contants";

  // - contract.authorizerOf(...)
  // - contract.availableUnbondedValue(...)
  // - contract.beneficiaryOf(...)
  // - contract.bondAmount(...)
  // - contract.hasSecondaryAuthorization(...)
  // - contract.isAuthorizedForOperator(...)
  // - contract.unbondedValue(...)

export function handleBondCreated(event: BondCreated): void {
  let totalBonded = getOrCreateTotalBondedECDSAKeep();
  totalBonded.totalAvailable  = totalBonded.totalAvailable.minus(toDecimal(event.params.amount));
  totalBonded.totalBonded  = totalBonded.totalBonded.plus(toDecimal(event.params.amount));
  totalBonded.save()

  let contract = KeepBondingContract.bind(event.address);
  let idKeepbonding = event.params.holder.toHex();
  let keepBonding = getOrCreateKeepBonding(idKeepbonding);
  keepBonding.holder =event.params.holder;
  keepBonding.referenceID = event.params.referenceID;
  keepBonding.sortitionPool = event.params.sortitionPool;
  keepBonding.bondedECDSAKeep =event.params.holder.toHex();
  keepBonding.save()

  let operator = getOrCreateKeepMember(event.params.operator.toHex());
  let keeps = operator.keeps;
  keeps.push(keepBonding.id);
  operator.keeps = keeps;
  operator.totalUnboundAvailable = operator.totalUnboundAvailable.minus(toDecimal(event.params.amount));
  operator.totalBonded = operator.totalBonded.plus(toDecimal(event.params.amount));
  operator.save()
}

export function handleBondReassigned(event: BondReassigned): void {
}

export function handleBondReleased(event: BondReleased): void {
  let operator = getOrCreateKeepMember(event.params.operator.toHex());
  let totalBonded = getOrCreateTotalBondedECDSAKeep();
  totalBonded.totalAvailable  = totalBonded.totalAvailable.plus(operator.totalBonded);
  totalBonded.totalBonded = totalBonded.totalBonded.minus(operator.totalBonded);
  totalBonded.save()

  operator.totalUnboundAvailable = operator.totalUnboundAvailable.plus(operator.totalBonded);
  operator.totalBonded = BIGDECIMAL_ZERO;
  operator.save()
}

export function handleBondSeized(event: BondSeized): void {
  let operator = getOrCreateKeepMember(event.params.operator.toHex());
  operator.destination = event.params.destination;
  operator.seizeAmount = toDecimal(event.params.amount);
  operator.totalBonded = operator.totalBonded.minus(toDecimal(event.params.amount));
  operator.save()  

  let totalBonded = getOrCreateTotalBondedECDSAKeep();
  totalBonded.totalBonded = totalBonded.totalBonded.minus(toDecimal(event.params.amount));
  totalBonded.save()
}

export function handleUnbondedValueDeposited(
  event: UnbondedValueDeposited
): void {
  let totalBonded = getOrCreateTotalBondedECDSAKeep();
  totalBonded.totalAvailable  = totalBonded.totalAvailable.plus(toDecimal(event.params.amount));
  totalBonded.save()

  let operator = getOrCreateKeepMember(event.params.operator.toHex());
  operator.totalUnboundAvailable = operator.totalUnboundAvailable.plus(toDecimal(event.params.amount));
  operator.save()
}

export function handleUnbondedValueWithdrawn(
  event: UnbondedValueWithdrawn
): void {
  let totalBonded = getOrCreateTotalBondedECDSAKeep();
  totalBonded.totalAvailable  = totalBonded.totalAvailable.minus(toDecimal(event.params.amount));
  totalBonded.save()

  let operator = getOrCreateKeepMember(event.params.operator.toHex());
  operator.totalUnboundAvailable = operator.totalUnboundAvailable.minus(toDecimal(event.params.amount));
  operator.save()
}
