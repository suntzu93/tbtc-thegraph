import {
  KeepClosed,
  KeepTerminated
} from "../generated/ECDSABondedContract/ECDSABondedContract"

import {
  BondedECDSAKeep
} from "../generated/schema";

import {
  getOrCreateTransaction
} from "./utils/helpers";

export function handleKeepClosed(event: KeepClosed): void {
  let ownerAddress = event.transaction.to.toHex();
  let bondedEcdsaKeep = BondedECDSAKeep.load(ownerAddress);
  if (bondedEcdsaKeep != null) {
    let transaction = getOrCreateTransaction(event.transaction.hash.toHex());
    transaction.timestamp = event.block.timestamp;
    transaction.blockNumber = event.block.number;
    transaction.save();
  
    bondedEcdsaKeep.state = "CLOSED";
    bondedEcdsaKeep.transaction = transaction.id;
    bondedEcdsaKeep.save()
  }
}

export function handleKeepTerminated(event: KeepTerminated): void {
  let ownerAddress = event.transaction.to.toHex();
  let bondedEcdsaKeep = BondedECDSAKeep.load(ownerAddress);
  if (bondedEcdsaKeep != null) {
    let transaction = getOrCreateTransaction(event.transaction.hash.toHex());
    transaction.timestamp = event.block.timestamp;
    transaction.blockNumber = event.block.number;
    transaction.save();
  
    bondedEcdsaKeep.state = "TERMINATED";
    bondedEcdsaKeep.save()
  }
}
