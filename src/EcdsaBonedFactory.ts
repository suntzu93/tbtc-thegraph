import {
  ECDSABondedContractFactory,
  BondedECDSAKeepCreated,
  SortitionPoolCreated
} from "../generated/ECDSABondedContractFactory/ECDSABondedContractFactory"

import {
  getOrCreateEcdsaBonedKeep,
  getOrCreateTransaction,
  getOrCreateKeepMember
} from "./utils/helpers";
import { toDecimal } from "./utils/decimals";

export function handleBondedECDSAKeepCreated(
  event: BondedECDSAKeepCreated
): void {
  let transaction = getOrCreateTransaction(event.transaction.hash.toHex());
  transaction.timestamp = event.block.timestamp;
  transaction.blockNumber = event.block.number;
  transaction.save();
  
  let contract = ECDSABondedContractFactory.bind(event.address)
  let ownerAdds = event.params.owner.toHex();
  let ecdsaBonedKeepFactory = getOrCreateEcdsaBonedKeep(ownerAdds);
  ecdsaBonedKeepFactory.honestThreshold = event.params.honestThreshold;
  ecdsaBonedKeepFactory.timestamp = event.block.timestamp;
  ecdsaBonedKeepFactory.transaction = transaction.id;
  ecdsaBonedKeepFactory.bondAmount = toDecimal(event.transaction.value);
  ecdsaBonedKeepFactory.keepAddress = event.params.keepAddress;
  ecdsaBonedKeepFactory.openKeepFeeEstimate = toDecimal(contract.openKeepFeeEstimate());
  ecdsaBonedKeepFactory.state = "ACTIVE";
  ecdsaBonedKeepFactory.save();

  let members = event.params.members;
  for(let  i = 0; i< members.length;i++){
    var memberAddress = members[i].toHex();
    let memberEntity = getOrCreateKeepMember(memberAddress);
    let keeps = memberEntity.bondedECDSAKeep
    keeps.push(ecdsaBonedKeepFactory.id)
    memberEntity.bondedECDSAKeep = keeps
    memberEntity.save()
  }
}

export function handleSortitionPoolCreated(event: SortitionPoolCreated): void {}

