import {
  KeepClosed,
  KeepTerminated
} from "../generated/ECDSABondedContract/ECDSABondedContract"

import {
  BondedECDSAKeep,
  Deposit
} from "../generated/schema";

import {
  getOrCreateTotalBondedECDSAKeep,
  getOrCreateTransaction
} from "./utils/helpers";

export function handleKeepClosed(event: KeepClosed): void {
  let ownerAddress = event.transaction.to.toHex();
  let deposit = Deposit.load(ownerAddress);
  if (deposit != null && deposit.keepAddress != null) {
    let bondedEcdsaKeep = BondedECDSAKeep.load(deposit.keepAddress.toHex());
    if (bondedEcdsaKeep != null) {
      let transaction = getOrCreateTransaction(event.transaction.hash.toHex());
      transaction.timestamp = event.block.timestamp;
      transaction.blockNumber = event.block.number;
      transaction.from = event.transaction.from;
      transaction.to = event.transaction.to;
      transaction.save();

      bondedEcdsaKeep.state = "CLOSED";
      bondedEcdsaKeep.transaction = transaction.id;
      bondedEcdsaKeep.save()
    }
  }
}

export function handleKeepTerminated(event: KeepTerminated): void {
  let ownerAddress = event.transaction.to.toHex();
  let deposit = Deposit.load(ownerAddress);
  if (deposit != null && deposit.keepAddress != null) {
    let bondedEcdsaKeep = BondedECDSAKeep.load(deposit.keepAddress.toHex());
    if (bondedEcdsaKeep != null) {
      let transaction = getOrCreateTransaction(event.transaction.hash.toHex());
      transaction.timestamp = event.block.timestamp;
      transaction.blockNumber = event.block.number;
      transaction.from = event.transaction.from;
      transaction.to = event.transaction.to;
      transaction.save();

      bondedEcdsaKeep.state = "TERMINATED";
      bondedEcdsaKeep.save()
    }
  }
}
