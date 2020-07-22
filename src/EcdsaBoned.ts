import {
  KeepClosed,
  KeepTerminated
} from "../generated/ECDSABondedContract/ECDSABondedContract"

import {
  BondedECDSAKeep
} from "../generated/schema";

import {
  getOrCreateTotalBondedECDSAKeep
} from "./utils/helpers";

export function handleKeepClosed(event: KeepClosed): void {
    let ownerAddress = event.transaction.to.toHex();
    let bondedEcdsaKeep = BondedECDSAKeep.load(ownerAddress);
    if(bondedEcdsaKeep != null){
      bondedEcdsaKeep.state = "CLOSED";
      bondedEcdsaKeep.save()

      let totalBonded = getOrCreateTotalBondedECDSAKeep();
      totalBonded.totalAmount.minus(bondedEcdsaKeep.bondAmount);
      totalBonded.save();
    }
}

export function handleKeepTerminated(event: KeepTerminated): void {
  let ownerAddress = event.transaction.to.toHex();
  let bondedEcdsaKeep = BondedECDSAKeep.load(ownerAddress);
  if(bondedEcdsaKeep != null){
    bondedEcdsaKeep.state = "TERMINATED";
    bondedEcdsaKeep.save()

    let totalBonded = getOrCreateTotalBondedECDSAKeep();
    totalBonded.totalAmount.minus(bondedEcdsaKeep.bondAmount);
    totalBonded.save();
  }
}
