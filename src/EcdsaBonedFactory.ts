import {
  ECDSABondedContractFactory,
  BondedECDSAKeepCreated,
  SortitionPoolCreated
} from "../generated/ECDSABondedContractFactory/ECDSABondedContractFactory"

import {
  getOrCreateDeposit,
  getOrCreateEcdsaBonedKeep,
  getOrCreateTransaction,
  getOrCreateKeepMember,
  getOrCreateTotalBondedECDSAKeep
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
  //Update keepAddress for deposit
  let deposit = getOrCreateDeposit(ownerAdds);
  deposit.keepAddress = event.params.keepAddress;
  deposit.save()
  ecdsaBonedKeepFactory.honestThreshold = event.params.honestThreshold;
  ecdsaBonedKeepFactory.timestamp = event.block.timestamp;
  ecdsaBonedKeepFactory.transaction = transaction.id;
  ecdsaBonedKeepFactory.bondAmount = toDecimal(event.transaction.value);
  ecdsaBonedKeepFactory.keepAddress = event.params.keepAddress;
  ecdsaBonedKeepFactory.openKeepFeeEstimate = toDecimal(contract.openKeepFeeEstimate());
  ecdsaBonedKeepFactory.state = "ACTIVE";
  ecdsaBonedKeepFactory.deposit = deposit.id;
  ecdsaBonedKeepFactory.save();

  let members = event.params.members;
  for(let  i = 0; i< members.length;i++){
    var memberAddress = members[i].toHex();
    let memberEntity = getOrCreateKeepMember(memberAddress);
    let keeps = memberEntity.bondedECDSAKeeps
    keeps.push(ecdsaBonedKeepFactory.id)
    memberEntity.bondedECDSAKeeps = keeps
    memberEntity.save()
  }

  let totalBonded = getOrCreateTotalBondedECDSAKeep();
  totalBonded.totalAmount  = totalBonded.totalAmount.plus(toDecimal(event.transaction.value));
  totalBonded.save()
}

export function handleSortitionPoolCreated(event: SortitionPoolCreated): void {}

