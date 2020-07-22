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
  getOrCreateOperator
} from "./utils/helpers";
import { toDecimal } from "./utils/decimals";


// type KeepBonding @entity{
//   id: ID!
//   holder: Bytes
//   operator: Bytes
//   referenceID: BigInt
//   sortitionPool: Bytes
//   totalDeposit: BigDecimal
//   unboundAvailable: BigDecimal
//   bondedECDSAKeep: BondedECDSAKeep
//   timestamp: BigInt
// }
export function handleBondCreated(event: BondCreated): void {
  // let sortitionPool = getOrCreateSortitionPool(event.params.sortitionPool.toHex());
  // sortitionPool.save()
  // let operator = getOrCreateKeepMember(event.params.operator.toHex());

  let keepBonding = getOrCreateKeepBonding(event.params.holder.toHex());
  keepBonding.holder =event.params.holder;
  keepBonding.referenceID = event.params.referenceID;
  keepBonding.sortitionPool = event.params.sortitionPool;
  keepBonding.unboundAvailable = keepBonding.unboundAvailable.plus(toDecimal(event.params.amount));
  keepBonding.totalDeposit = keepBonding.totalDeposit.plus(toDecimal(event.params.amount));
  keepBonding.bondedECDSAKeep =event.params.holder.toHex();
  keepBonding.save()

  let operator = getOrCreateOperator(event.params.operator.toHex());
  operator.referenceID = event.params.referenceID;
  let keeps = operator.keeps;
  keeps.push(keepBonding.id);
  operator.keeps = keeps;
  operator.totalUnboundAvailable = operator.totalUnboundAvailable.plus(toDecimal(event.params.amount));
  operator.save()

  log.error("handleBondCreated holder = {},amount ={} ,operator = {}, referenceID = {}, sortitionPool = {}",[
    event.params.holder.toHex(),
    event.params.amount.toString(),
    event.params.operator.toHex(),
    event.params.referenceID.toString(),
    event.params.sortitionPool.toHex()
  ])
  

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.availableUnbondedValue(...)
  // - contract.bondAmount(...)
  // - contract.hasSecondaryAuthorization(...)
  // - contract.unbondedValue(...)
}

export function handleBondReassigned(event: BondReassigned): void {
  log.error("handleBondReassigned holder = {},newReferenceID ={} ,operator = {}, referenceID = {}",[
    event.params.newHolder.toHex(),
    event.params.newReferenceID.toHex(),
    event.params.operator.toHex(),
    event.params.referenceID.toString()
  ])
}

export function handleBondReleased(event: BondReleased): void {
  log.error("handleBondReleased operator = {}, referenceID = {}",[
    event.params.operator.toHex(),
    event.params.referenceID.toHex()
  ])
}

export function handleBondSeized(event: BondSeized): void {
  log.error("handleBondSeized operator = {},referenceID ={} ,destination = {}, amount = {}",[
    event.params.operator.toHex(),
    event.params.referenceID.toHex(),
    event.params.destination.toHex(),
    event.params.amount.toString()
  ])
}

export function handleUnbondedValueDeposited(
  event: UnbondedValueDeposited
): void {
  log.error("UnbondedValueDeposited operator = {}, amount = {}",[
    event.params.operator.toHex(),
    toDecimal(event.params.amount).toString()
  ])
}

export function handleUnbondedValueWithdrawn(
  event: UnbondedValueWithdrawn
): void {
  log.error("UnbondedValueWithdrawn operator = {}, amount = {}",[
    event.params.operator.toHex(),
    toDecimal(event.params.amount).toString()
  ])
}
