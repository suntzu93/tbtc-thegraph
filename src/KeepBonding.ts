import { BigInt, log } from "@graphprotocol/graph-ts";
import {
  KeepBondingContract,
  BondCreated,
  BondReassigned,
  BondReleased,
  BondSeized,
  UnbondedValueDeposited,
  UnbondedValueWithdrawn,
} from "../generated/KeepBondingContract/KeepBondingContract";

import {
  getOrCreateMemberLocked,
  getOrCreateKeepMember,
  getOrCreateTotalBondedECDSAKeep,
} from "./utils/helpers";
import { toDecimal } from "./utils/decimals";
import { BIGDECIMAL_ZERO, BIGINT_ZERO } from "./utils/contants";
import { MemberLocked } from "../generated/schema";

// - contract.authorizerOf(...)
// - contract.availableUnbondedValue(...)
// - contract.beneficiaryOf(...)
// - contract.bondAmount(...)
// - contract.hasSecondaryAuthorization(...)
// - contract.isAuthorizedForOperator(...)
// - contract.unbondedValue(...)

function generateMemberId(
  operator: string,
  referenceId: string
): string {
  return operator  + "_" + referenceId;
}

export function handleBondCreated(event: BondCreated): void {
  let totalBonded = getOrCreateTotalBondedECDSAKeep();
  totalBonded.totalAvailable = totalBonded.totalAvailable.minus(toDecimal(event.params.amount));
  totalBonded.totalBonded = totalBonded.totalBonded.plus(toDecimal(event.params.amount));
  totalBonded.save();

  let holderAddress = event.params.holder;
  let operatorAddress = event.params.operator;
  let referenceID = event.params.referenceID;

  let id = generateMemberId(operatorAddress.toHex(),referenceID.toString());
  let memberLocked = getOrCreateMemberLocked(id);
  memberLocked.holder = holderAddress;
  memberLocked.operator = operatorAddress;
  memberLocked.referenceID = referenceID;
  memberLocked.bonded = memberLocked.bonded.plus(toDecimal(event.params.amount));
  memberLocked.save();

  let member = getOrCreateKeepMember(event.params.operator.toHex());
  member.unboundAvailable = member.unboundAvailable.minus(toDecimal(event.params.amount));
  let memberLockes = member.memberLocks;
  memberLockes.push(memberLocked.id);
  member.memberLocks = memberLockes;
  member.authorizedSortitionPool = event.params.sortitionPool;
  member.save();
}

export function handleBondReassigned(event: BondReassigned): void {
  let operatorAddress = event.params.operator;
  let referenceID = event.params.referenceID;
  let newReferenceId = event.params.newReferenceID;
  const id = generateMemberId(operatorAddress.toHex(),referenceID.toString());
  let oldMemberLocked = MemberLocked.load(id);
  if (oldMemberLocked != null) {
    const newId = generateMemberId(
      operatorAddress.toHex(),
      newReferenceId.toString()
    );
    let newMemberLocked = getOrCreateMemberLocked(newId);
    newMemberLocked.holder = oldMemberLocked.holder;
    newMemberLocked.operator = oldMemberLocked.operator;
    newMemberLocked.referenceID = oldMemberLocked.referenceID;
    newMemberLocked.bonded = oldMemberLocked.bonded;
    newMemberLocked.save();

    let member = getOrCreateKeepMember(event.params.operator.toHex());
    let memberLockes = member.memberLocks;
    const index = memberLockes.indexOf(oldMemberLocked.id);
    memberLockes.splice(index, 1);
    memberLockes.push(oldMemberLocked.id);
    member.memberLocks = memberLockes;
    member.save();
  }
}

export function handleBondReleased(event: BondReleased): void {
  let operatorAddress = event.params.operator;
  let referenceID = event.params.referenceID;
  let id = generateMemberId(
    operatorAddress.toHex(),
    referenceID.toString()
  );
  let memberLocked = MemberLocked.load(id);
  if(memberLocked != null){
    let totalBonded = getOrCreateTotalBondedECDSAKeep();
    totalBonded.totalAvailable = totalBonded.totalAvailable.plus(memberLocked.bonded);
    totalBonded.totalBonded = totalBonded.totalBonded.minus(memberLocked.bonded);
    totalBonded.save();
  
    let member = getOrCreateKeepMember(event.params.operator.toHex());
    member.unboundAvailable = member.unboundAvailable.plus(memberLocked.bonded);
    member.save();
  
    //reset bonded value.
    memberLocked.bonded = BIGDECIMAL_ZERO;
    memberLocked.save();
  }else{
    log.error("handleBondReleased NULL id = {} , transaction = {}",[
      id,
      event.transaction.hash.toHex()
    ] )
  }
  
}

export function handleBondSeized(event: BondSeized): void {
  let operatorAddress = event.params.operator;
  let referenceID = event.params.referenceID;
  let id = generateMemberId(
    operatorAddress.toHex(),
    referenceID.toString()
  );
  let member = getOrCreateMemberLocked(id);
  member.bonded = member.bonded.minus(toDecimal(event.params.amount));
  member.save();

  let totalBonded = getOrCreateTotalBondedECDSAKeep();
  totalBonded.totalBonded = totalBonded.totalBonded.minus(toDecimal(event.params.amount));
  totalBonded.save();
}

export function handleUnbondedValueDeposited(
  event: UnbondedValueDeposited
): void {
  let totalBonded = getOrCreateTotalBondedECDSAKeep();
  totalBonded.totalAvailable = totalBonded.totalAvailable.plus(toDecimal(event.params.amount));
  totalBonded.save();

  let member = getOrCreateKeepMember(event.params.operator.toHex());
  member.unboundAvailable = member.unboundAvailable.plus(toDecimal(event.params.amount));
  member.beneficiary = event.params.beneficiary;
  member.save();
}

export function handleUnbondedValueWithdrawn(
  event: UnbondedValueWithdrawn
): void {
  let totalBonded = getOrCreateTotalBondedECDSAKeep();
  totalBonded.totalAvailable = totalBonded.totalAvailable.minus(
    toDecimal(event.params.amount)
  );
  totalBonded.save();

  let member = getOrCreateKeepMember(event.params.operator.toHex());
  member.unboundAvailable = member.unboundAvailable.minus(toDecimal(event.params.amount));
  member.save();
}
