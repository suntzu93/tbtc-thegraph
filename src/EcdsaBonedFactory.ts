import { BigInt , log} from "@graphprotocol/graph-ts"
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
  getOrCreateTotalBondedECDSAKeep,
  getOrCreateKeepBonding
} from "./utils/helpers";
import { toDecimal  } from "./utils/decimals";
import { BIGINT_ONE } from "./utils/contants";

export function handleBondedECDSAKeepCreated(
  event: BondedECDSAKeepCreated
): void {
  
  let transaction = getOrCreateTransaction(event.transaction.hash.toHex());
  transaction.timestamp = event.block.timestamp;
  transaction.blockNumber = event.block.number;
  transaction.from = event.transaction.from;
  transaction.to = event.transaction.to;
  transaction.save();
  
  let contract = ECDSABondedContractFactory.bind(event.address)
  let ownerAdds = event.params.owner.toHex();
  let keepAddress = event.params.keepAddress.toHex();
  let ecdsaBonedKeepFactory = getOrCreateEcdsaBonedKeep(keepAddress);
  let deposit = getOrCreateDeposit(ownerAdds);
  deposit.keepAddress = event.params.keepAddress;
  ecdsaBonedKeepFactory.owner = event.params.owner;
  ecdsaBonedKeepFactory.honestThreshold = event.params.honestThreshold;
  ecdsaBonedKeepFactory.timestamp = event.block.timestamp;
  ecdsaBonedKeepFactory.transaction = transaction.id;
  ecdsaBonedKeepFactory.keepAddress = event.params.keepAddress;
  ecdsaBonedKeepFactory.openKeepFeeEstimate = toDecimal(contract.openKeepFeeEstimate());
  ecdsaBonedKeepFactory.state = "ACTIVE";
  ecdsaBonedKeepFactory.deposit = deposit.id;
  deposit.save()
  ecdsaBonedKeepFactory.save();

  let members = event.params.members;
  for(let  i = 0; i< members.length;i++){
    var memberAddress = members[i].toHex();
    let keepMember = getOrCreateKeepMember(memberAddress);
    let keeps = keepMember.bondedECDSAKeeps
    keeps.push(ecdsaBonedKeepFactory.id)
    keepMember.bondedECDSAKeeps = keeps
    keepMember.save()
  }

  let totalBonded = getOrCreateTotalBondedECDSAKeep();
  totalBonded.totalKeepActive  =  totalBonded.totalKeepActive + BIGINT_ONE;
  totalBonded.totalKeepOpened = totalBonded.totalKeepOpened + BIGINT_ONE;
  totalBonded.save()
}

export function handleSortitionPoolCreated(event: SortitionPoolCreated): void {

}

