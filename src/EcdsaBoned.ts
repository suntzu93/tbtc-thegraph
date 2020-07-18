import {
  KeepClosed,
  KeepTerminated
} from "../generated/ECDSABondedContract/ECDSABondedContract"

import {
  BondedECDSAKeep
} from "../generated/schema";

export function handleKeepClosed(event: KeepClosed): void {
    let ownerAddress = event.transaction.to.toHex();
    let bondedEcdsaKeep = BondedECDSAKeep.load(ownerAddress);
    if(bondedEcdsaKeep != null){
      bondedEcdsaKeep.state = "CLOSED";
      bondedEcdsaKeep.save()
    }
}

export function handleKeepTerminated(event: KeepTerminated): void {
  let ownerAddress = event.transaction.to.toHex();
  let bondedEcdsaKeep = BondedECDSAKeep.load(ownerAddress);
  if(bondedEcdsaKeep != null){
    bondedEcdsaKeep.state = "TERMINATED";
    bondedEcdsaKeep.save()
  }
}
