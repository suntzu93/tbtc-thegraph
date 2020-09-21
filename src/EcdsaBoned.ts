import { BigInt , log} from "@graphprotocol/graph-ts"
import {
  KeepClosed,
  KeepTerminated
} from "../generated/templates/ECDSABondedContract/ECDSABondedContract"

import {
  BondedECDSAKeep,
  Deposit
} from "../generated/schema";

import {
  getOrCreateTotalBondedECDSAKeep,
  getOrCreateTransaction
} from "./utils/helpers";
import { BIGINT_ONE } from "./utils/contants";

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

      let totalBonded = getOrCreateTotalBondedECDSAKeep();
      totalBonded.totalKeepActive  =  totalBonded.totalKeepActive - BIGINT_ONE;
      totalBonded.save()

      log.error("handleKeepClosed = transaction {}",[
        event.transaction.hash.toHex()
      ])
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

      let totalBonded = getOrCreateTotalBondedECDSAKeep();
      totalBonded.totalKeepActive  =  totalBonded.totalKeepActive - BIGINT_ONE;
      totalBonded.save()

      log.error("handleKeepTerminated = transaction {}",[
        event.transaction.hash.toHex()
      ])
    }
  }
}
