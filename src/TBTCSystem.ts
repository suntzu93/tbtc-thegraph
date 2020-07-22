import { BigInt, log } from "@graphprotocol/graph-ts"
import {
  TBTCSystemContract,
  GotRedemptionSignature,
  Liquidated,
  CourtesyCalled,
  Redeemed,
  RedemptionRequested,
  StartedLiquidation,
  Created,
  SetupFailed,
  AllowNewDepositsUpdated,
  RegisteredPubkey
} from "../generated/TBTCSystemContract/TBTCSystemContract"

import {
  getOrCreateDepositRedemption,
  getOrCreateTransaction,
  getOrCreateAllowNewDepositsUpdated,
  getOrCreateDepositLiquidation as getDepositLiquidation,
  getOrCreateDeposit,
  getTbtcTokenEntity
} from "./utils/helpers";

export function handleCreated (event: Created): void {
  let depositContractAddress = event.params._depositContractAddress.toHex();
  let deposit = getOrCreateDeposit(depositContractAddress);
  let tbtcToken = getTbtcTokenEntity();
  deposit.tbtcToken = tbtcToken.id;
  deposit.timestamp = event.block.timestamp;

  let systemContract = TBTCSystemContract.bind(event.address);
  deposit.initialCollateralizedPercent =  BigInt.fromI32(systemContract.getInitialCollateralizedPercent());
  deposit.remainingPauseTerm = systemContract.try_getRemainingPauseTerm() as BigInt;
  deposit.signerFeeDivisor = BigInt.fromI32(systemContract.getSignerFeeDivisor());
  deposit.lotSize = systemContract.getAllowedLotSizes();
  deposit.severelyUndercollateralizedThresholdPercent = BigInt.fromI32(systemContract.getSeverelyUndercollateralizedThresholdPercent());
  deposit.undercollateralizedThresholdPercent = BigInt.fromI32(systemContract.getUndercollateralizedThresholdPercent());
  deposit.state = "AWAITING_SIGNER_SETUP";
  deposit.save()
}

export function handleSetupFailed (event: SetupFailed): void {
  let deposit = getOrCreateDeposit(event.params._depositContractAddress.toHex());
  deposit.state = "SETUP_FAILED";
  deposit.save()
}

export function handleCourtesyCalled(event: CourtesyCalled): void {
  let depositLiquidation = getDepositLiquidation(event.params._depositContractAddress.toHex());
  depositLiquidation.timestamp = event.block.timestamp;
  depositLiquidation.state = "COURTESY_CALL";
  depositLiquidation.save();
}

export function handleRedemptionRequested(event: RedemptionRequested): void {
  let id =  event.transaction.hash.toHex();
  //Transaction info
  let transaction = getOrCreateTransaction(id)
  transaction.timestamp = event.block.timestamp;
  transaction.blockNumber = event.block.number;

  //Save deposit 
  let deposit = getOrCreateDeposit(event.params._depositContractAddress.toHex());
  let tbtcToken = getTbtcTokenEntity();
  deposit.tbtcToken = tbtcToken.id;
  deposit.timestamp = event.block.timestamp;
  let systemContract = TBTCSystemContract.bind(event.address);
  deposit.initialCollateralizedPercent =  BigInt.fromI32(systemContract.getInitialCollateralizedPercent());
  deposit.remainingPauseTerm = systemContract.try_getRemainingPauseTerm() as BigInt;
  deposit.signerFeeDivisor = BigInt.fromI32(systemContract.getSignerFeeDivisor());
  deposit.lotSize = systemContract.getAllowedLotSizes();
  deposit.severelyUndercollateralizedThresholdPercent = BigInt.fromI32(systemContract.getSeverelyUndercollateralizedThresholdPercent());
  deposit.undercollateralizedThresholdPercent = BigInt.fromI32(systemContract.getUndercollateralizedThresholdPercent());
  deposit.state = "AWAITING_SIGNER_SETUP";
  deposit.save()

  //DepositRedemption Info
  let depositRedemp = getOrCreateDepositRedemption(event.params._depositContractAddress.toHex());
  depositRedemp.transaction = transaction.id;
  depositRedemp.depositContractAddress = event.params._depositContractAddress;
  depositRedemp.digest = event.params._digest;
  depositRedemp.outpoint = event.params._outpoint;
  depositRedemp.redeemerOutputScript = event.params._redeemerOutputScript;
  depositRedemp.requestedFee = event.params._requestedFee;
  depositRedemp.requester = event.params._requester;
  depositRedemp.utxoSize = event.params._utxoSize;
  depositRedemp.state = "AWAITING_WITHDRAWAL_SIGNATURE";
  depositRedemp.timestamp = event.block.timestamp;
  depositRedemp.deposit = deposit.id;
  depositRedemp.save()
}

export function handleGotRedemptionSignature(
  event: GotRedemptionSignature
): void {
  let depositRedemp = getOrCreateDepositRedemption(event.params._depositContractAddress.toHex());
  depositRedemp.state = "AWAITING_WITHDRAWAL_PROOF";
  depositRedemp.digest = event.params._digest;
  depositRedemp.timestamp = event.block.timestamp;
  depositRedemp.save();
}

export function handleRedeemed(event: Redeemed): void {
  let depositRedemp = getOrCreateDepositRedemption(event.params._depositContractAddress.toHex());
  let deposit = getOrCreateDeposit(depositRedemp.id);
  deposit.state = "REDEEMED";
  deposit.save();

  depositRedemp.state = "REDEEMED";
  depositRedemp.txid = event.params._txid;
  depositRedemp.timestamp = event.block.timestamp
  depositRedemp.deposit = deposit.id;
  depositRedemp.save();
}

export function handleStartedLiquidation(event: StartedLiquidation): void {
  let depositLiquidation = getDepositLiquidation(event.params._depositContractAddress.toHex());
  let deposit = getOrCreateDeposit(depositLiquidation.id);
  depositLiquidation.deposit = deposit.id;
  depositLiquidation.timestamp = event.block.timestamp
  depositLiquidation.wasFraud = event.params._wasFraud;
  if(depositLiquidation.wasFraud){
    depositLiquidation.state = "FRAUD_LIQUIDATION_IN_PROGRESS";
  }else {
    depositLiquidation.state = "LIQUIDATION_IN_PROGRESS";
  }
  depositLiquidation.save();
}

export function handleLiquidated(event: Liquidated): void {
  let depositRedemp = getOrCreateDepositRedemption(event.params._depositContractAddress.toHex());
  depositRedemp.state = "REDEEMED_ERROR_MOVE_TO_LIQUIDATION";
  depositRedemp.save();

  let deposit = getOrCreateDeposit(depositRedemp.id);
  deposit.state = "LIQUIDATED";
  deposit.save();

  let depositLiquidation = getDepositLiquidation(event.params._depositContractAddress.toHex());
  let transaction = getOrCreateTransaction(event.transaction.hash.toHex());
  transaction.timestamp = event.block.timestamp;
  transaction.blockNumber = event.block.number;
  depositLiquidation.transaction = transaction.id;
  depositLiquidation.timestamp = event.block.timestamp
  depositLiquidation.state = "LIQUIDATED";
  depositLiquidation.deposit = deposit.id;
  transaction.save();
  depositLiquidation.save();
}

export function handleAllowNewDepositsUpdated(event: AllowNewDepositsUpdated): void{
  let depositAllowStateEntity = getOrCreateAllowNewDepositsUpdated();
  depositAllowStateEntity.allowNewDepositsUpdated = event.params._allowNewDeposits;
  depositAllowStateEntity.save()
}
