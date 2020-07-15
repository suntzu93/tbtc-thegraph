import { BigInt , log} from "@graphprotocol/graph-ts"
import {VendingContract, SetExternalAddressesCall,TbtcToBtcCall ,TdtToTbtcCall, TbtcToTdtCall } from "../generated/VendingContract/VendingContract"
import { 
  Approval  as ApprovalEvent,
  Transfer as TransferEvent , 
  TBTCToken, 
  TokenHolder} from "../generated/schema"

import {
  ZERO_ADDRESS,
  BIGINT_ONE,
  BIGINT_ZERO
} from "./utils/contants";

import {
  getOrCreateApproval,
  getOrCreateTransfer,
  getOrCreateTokenHolder,
  getTbtcTokenEntity,
  getOrCreateMint
} from "./utils/helpers";
import { toDecimal } from "./utils/decimals";

export function handleSetExternalAddresses(event : SetExternalAddressesCall): void{
  // log.warning("handleSetExternalAddresses . _feeRebateToken = {},_tbtcDepositToken = {}, _tbtcToken = {}",
  // [
  //   event.inputs._feeRebateToken.toHexString(),
  //   event.inputs._tbtcDepositToken.toHexString(),
  //   event.inputs._tbtcToken.toHexString()
  // ])
}

// Redeems a Deposit by purchasing a TDT with TBTC for _finalRecipient,
// and using the TDT to redeem corresponding Deposit as _finalRecipient.
// This function will revert if the Deposit is not in ACTIVE state.
export function handleTbtcToBtc(event : TbtcToBtcCall): void{
  log.warning("handleTbtcToBtc. _depositAddress = {} , _finalRecipient = {} , _outputValueBytes = {}, _redeemerOutputScript = {}",[
    event.inputs._depositAddress.toHexString(),
    event.inputs._finalRecipient.toHexString(),
    event.inputs._outputValueBytes.toHexString(),
    event.inputs._redeemerOutputScript.toHexString(),
  ])
}

// Burns TBTC and transfers the tBTC Deposit Token to the caller as long as it is qualified.
export function handleTbtcToTdt(event : TbtcToTdtCall): void{
  // log.warning("handleTbtcToTdt. _tdtId = {}",[
  //   event.inputs._tdtId.toHexString(),
  //   event.transaction.value.toString()
  // ])
}

// Transfer the tBTC Deposit Token and mint TBTC.
export function handleTdtToTbtc(event : TdtToTbtcCall): void{
  // log.warning("handleTdtToTbtc. _tdtId = {} , value = {}",[
  //   event.inputs._tdtId.toHexString(),
  //   event.transaction.value.toString()
  // ])
}
