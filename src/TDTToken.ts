import { BigInt ,log} from "@graphprotocol/graph-ts"
import {
  TDTContract,
  Approval,
  ApprovalForAll,
  Transfer
} from "../generated/TDTContract/TDTContract"

export function handleApproval(event: Approval): void {
  

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
  // - contract.approveAndCall(...)
  // - contract.balanceOf(...)
  // - contract.exists(...)
  // - contract.getApproved(...)
  // - contract.isApprovedForAll(...)
  // - contract.name(...)
  // - contract.ownerOf(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.tokenURI(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleTransfer(event: Transfer): void {
  
  log.warning("TDT handleTransfer\nFrom: {}\nTo:{}\nID:{}\nhash:{}\nvalue:{}",[
    event.params.from.toHexString(),
    event.params.to.toHexString(),
    event.params.tokenId.toHexString(),
    event.transaction.hash.toHexString(),
    event.transaction.value.toString()
  ])
}
