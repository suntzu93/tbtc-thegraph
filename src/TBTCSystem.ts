import { BigInt,log } from "@graphprotocol/graph-ts"
import {
  TBTCSystemContract,
  AllowNewDepositsUpdated,
  CollateralizationThresholdsUpdateStarted,
  CollateralizationThresholdsUpdated,
  CourtesyCalled,
  Created,
  EthBtcPriceFeedAdded,
  EthBtcPriceFeedAdditionStarted,
  ExitedCourtesyCall,
  FraudDuringSetup,
  Funded,
  FunderAbortRequested,
  GotRedemptionSignature,
  KeepFactorySingleShotUpdateStarted,
  KeepFactorySingleShotUpdated,
  Liquidated,
  LotSizesUpdateStarted,
  LotSizesUpdated,
  OwnershipTransferred,
  Redeemed,
  RedemptionRequested,
  RegisteredPubkey,
  SetupFailed,
  SignerFeeDivisorUpdateStarted,
  SignerFeeDivisorUpdated,
  StartedLiquidation,
  LogCourtesyCalledCall
} from "../generated/TBTCSystemContract/TBTCSystemContract"

import {
  getOrCreateDepositRedemption,
  getOrCreateTransaction,
  getOrCreateBurn,
  getOrCreateAllowNewDepositsUpdated
} from "./utils/helpers";
// import { toDecimalBtc } from "./utils/decimals";

export function handleAllowNewDepositsUpdated(
  event: AllowNewDepositsUpdated
): void {
  let allowNewDepositsUpdated = getOrCreateAllowNewDepositsUpdated();
  allowNewDepositsUpdated.allowNewDepositsUpdated = event.params._allowNewDeposits;
  allowNewDepositsUpdated.save();
  
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.approvedToLog(...)
  // - contract.emergencyPauseNewDeposits(...)
  // - contract.fetchBitcoinPrice(...)
  // - contract.fetchRelayCurrentDifficulty(...)
  // - contract.fetchRelayPreviousDifficulty(...)
  // - contract.getAllowNewDeposits(...)
  // - contract.getAllowedLotSizes(...)
  // - contract.getGovernanceTimeDelay(...)
  // - contract.getInitialCollateralizedPercent(...)
  // - contract.getNewDepositFeeEstimate(...)
  // - contract.getPriceFeedGovernanceTimeDelay(...)
  // - contract.getRemainingCollateralizationThresholdsUpdateTime(...)
  // - contract.getRemainingEthBtcPriceFeedAdditionTime(...)
  // - contract.getRemainingKeepFactorySingleShotUpdateTime(...)
  // - contract.getRemainingLotSizesUpdateTime(...)
  // - contract.getRemainingPauseTerm(...)
  // - contract.getRemainingSignerFeeDivisorUpdateTime(...)
  // - contract.getSeverelyUndercollateralizedThresholdPercent(...)
  // - contract.getSignerFeeDivisor(...)
  // - contract.getUndercollateralizedThresholdPercent(...)
  // - contract.isAllowedLotSize(...)
  // - contract.isOwner(...)
  // - contract.owner(...)
  // - contract.priceFeed(...)
  // - contract.relay(...)
}

export function handleCollateralizationThresholdsUpdateStarted(
  event: CollateralizationThresholdsUpdateStarted
): void {}

export function handleCollateralizationThresholdsUpdated(
  event: CollateralizationThresholdsUpdated
): void {}

export function handleCourtesyCalled(event: CourtesyCalled): void {
  log.warning("handleCourtesyCalled _depositContractAddress = {} , _timestamp = {} ",[
    event.params._depositContractAddress.toHexString(),
    event.params._timestamp.toString()
  ])
}

export function handleCreated(event: Created): void {
  log.warning("handleCreated _depositContractAddress = {} , _keepAddress = {} , _timestamp = {} , hash = {}", [
    event.params._depositContractAddress.toHexString(),
    event.params._keepAddress.toHexString(),
    event.params._timestamp.toString(),
    event.transaction.hash.toHexString()
  ])
}

export function handleEthBtcPriceFeedAdded(event: EthBtcPriceFeedAdded): void {}

export function handleEthBtcPriceFeedAdditionStarted(
  event: EthBtcPriceFeedAdditionStarted
): void {}

export function handleExitedCourtesyCall(event: ExitedCourtesyCall): void {}

export function handleFraudDuringSetup(event: FraudDuringSetup): void {}

export function handleFunded(event: Funded): void {}

export function handleFunderAbortRequested(event: FunderAbortRequested): void {}

export function handleGotRedemptionSignature(
  event: GotRedemptionSignature
): void {
  log.warning("GotRedemptionSignature _depositContractAddress = {}, _digest = {} , _s = {}, _r = {} ,_timestamp = {}, hash {} ", 
    [
      event.params._depositContractAddress.toHexString(), 
      event.params._digest.toHexString(),
      event.params._s.toHexString(),
      event.params._r.toHexString(),
      event.params._timestamp.toString(),
      event.transaction.hash.toHexString()
    ])
}

export function handleKeepFactorySingleShotUpdateStarted(
  event: KeepFactorySingleShotUpdateStarted
): void {}

export function handleKeepFactorySingleShotUpdated(
  event: KeepFactorySingleShotUpdated
): void {}

export function handleLiquidated(event: Liquidated): void {
  log.warning("handleLiquidated _depositContractAddress = {} ,_timestamp = {} , txhash = {}",[
    event.params._depositContractAddress.toHexString(),
    event.params._timestamp.toString(),
    event.transaction.hash.toHexString()
  ])
}

export function handleLotSizesUpdateStarted(
  event: LotSizesUpdateStarted
): void {}

export function handleLotSizesUpdated(event: LotSizesUpdated): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleRedeemed(event: Redeemed): void {
  log.warning("handleRedeemed _depositContractAddress = {}, _txid = {} , _timestamp = {}, hash = {}", 
    [
      event.params._depositContractAddress.toHexString(), 
      event.params._txid.toHexString(),
      event.params._timestamp.toHexString(),
      event.transaction.hash.toHexString()
    ])
}

export function handleRedemptionRequested(event: RedemptionRequested): void {
  // let id =  event.transaction.hash.toHex();
  // //Transaction info
  // let transaction = getOrCreateTransaction(id)
  // transaction.timestamp = event.block.timestamp;
  // transaction.blockNumber = event.block.number;
  // //Burn info
  // let burn = getOrCreateBurn(id)
  // burn.timestamp = transaction.timestamp;
  // burn.transaction = transaction.id;
  // burn.amount = toDecimalBtc(event.params._utxoSize);
  // burn.from = event.params._requester;
  // transaction.burn.push(burn.id);
  // transaction.save()
  // burn.save()

  // //DepositRedemption Info
  // let depositRedemp = getOrCreateDepositRedemption(id);
  // depositRedemp.transaction = transaction.id;
  // depositRedemp.depositContractAddress = event.params._depositContractAddress;
  // depositRedemp.digest = event.params._digest;
  // depositRedemp.outpoint = event.params._outpoint;
  // depositRedemp.redeemerOutputScript = event.params._redeemerOutputScript;
  // depositRedemp.requestedFee = event.params._requestedFee;
  // depositRedemp.requester = event.params._requester;
  // depositRedemp.utxoSize = event.params._utxoSize;
  // depositRedemp.state = "AWAITING_WITHDRAWAL_SIGNATURE";
  // depositRedemp.save()

  log.warning("handleRedemptionRequested _depositContractAddress = {}, _digest = {} , _outpoint = {} , _redeemerOutputScript = {} , _requestedFee = {} , _requester = {}, _utxoSize = {}, hash = {}",[
    event.params._depositContractAddress.toHexString(),
    event.params._digest.toHexString(),
    event.params._outpoint.toHexString(),
    event.params._redeemerOutputScript.toHexString(),
    event.params._requestedFee.toString(),
    event.params._requester.toHexString(),
    event.params._utxoSize.toString(),
    event.transaction.hash.toHexString()
  ])
}

export function handleRegisteredPubkey(event: RegisteredPubkey): void {}

export function handleSetupFailed(event: SetupFailed): void {}

export function handleSignerFeeDivisorUpdateStarted(
  event: SignerFeeDivisorUpdateStarted
): void {}

export function handleSignerFeeDivisorUpdated(
  event: SignerFeeDivisorUpdated
): void {}

export function handleStartedLiquidation(event: StartedLiquidation): void {}
