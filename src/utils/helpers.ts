import {
  Transfer,
  TokenHolder,
  TBTCToken,
  Transaction,
  Mint,
  DepositRedemption,
  DepositLiquidation,
  AllowNewDepositsUpdated,
  BondedECDSAKeep,
  Member,
  Deposit
} from "../../generated/schema";

import { DEFAULT_DECIMALS } from "./decimals";

import {
  ZERO_ADDRESS,
  BIGINT_ZERO,
  BIGINT_ONE,
  BIGDECIMAL_ZERO,
  TBTC_CONTRACT,
  MAX_SUPPLY
} from "./contants";
import { Bytes , Address, log} from "@graphprotocol/graph-ts";

export function getOrCreateTransaction(id: string): Transaction{
  let transaction = Transaction.load(id);
  if(transaction == null){
    transaction = new Transaction(id);
    transaction.id = id;
    transaction.timestamp = BIGINT_ZERO;
    transaction.blockNumber = BIGINT_ZERO;
  }
  return transaction as Transaction;
}

export function getOrCreateTransfer
  (id: string): Transfer {
  let transfer = Transfer.load(id);
  if (transfer == null) {
    transfer = new Transfer(id);
    transfer.value = BIGDECIMAL_ZERO;
    transfer.timestamp = BIGINT_ZERO;
    let transaction = getOrCreateTransaction(id);
    transfer.transaction = transaction.id;
  }
  return transfer as Transfer; 
}

export function getOrCreateTokenHolder(
  id: String
): TokenHolder {
  let tokenHolder = TokenHolder.load(id.toString());

  if (tokenHolder == null) {
    tokenHolder = new TokenHolder(id.toString());
    tokenHolder.tokenBalanceRaw = BIGINT_ZERO;
    tokenHolder.tokenBalance = BIGDECIMAL_ZERO;
    tokenHolder.totalTokensHeldRaw = BIGINT_ZERO;
    tokenHolder.totalTokensHeld = BIGDECIMAL_ZERO;
  }

  return tokenHolder as TokenHolder;
}

export function getTbtcTokenEntity(): TBTCToken {
  let tBtcToken = TBTCToken.load("TBTCToken");

  if (tBtcToken == null) {
    tBtcToken = new TBTCToken("TBTCToken");
    tBtcToken.currentTokenHolders = BIGINT_ZERO;
    tBtcToken.decimals = DEFAULT_DECIMALS;
    tBtcToken.name = "tBTC Network";
    tBtcToken.symbol = "TBTC";
    tBtcToken.totalSupply = BIGDECIMAL_ZERO;
    tBtcToken.totalMint = BIGDECIMAL_ZERO;
    tBtcToken.totalBurn = BIGDECIMAL_ZERO;
    tBtcToken.maxSupply = MAX_SUPPLY;
    tBtcToken.address = Address.fromString(TBTC_CONTRACT);
  }

  return tBtcToken as TBTCToken;
}

export function getOrCreateAllowNewDepositsUpdated(): AllowNewDepositsUpdated {
  let id = "AllowNewDepositsUpdated";
  let allowNewDepositsUpdated = AllowNewDepositsUpdated.load(id);
  if (allowNewDepositsUpdated == null) {
    allowNewDepositsUpdated = new AllowNewDepositsUpdated(id);
    allowNewDepositsUpdated.allowNewDepositsUpdated = true;
    allowNewDepositsUpdated.save()
  }
  return allowNewDepositsUpdated as AllowNewDepositsUpdated;
}

export function getOrCreateDeposit(id: string) : Deposit{
  let deposit = Deposit.load(id);
  if (deposit == null){
    deposit = new Deposit(id);
    deposit.timestamp = BIGINT_ZERO;
    deposit.signerFeeDivisor = BIGINT_ZERO;
    deposit.state = "AWAITING_SIGNER_SETUP";
    deposit.lotSize = [];
    deposit.initialCollateralizedPercent = BIGINT_ZERO;
    deposit.undercollateralizedThresholdPercent = BIGINT_ZERO;
    deposit.severelyUndercollateralizedThresholdPercent = BIGINT_ZERO;
    deposit.remainingPauseTerm = BIGINT_ZERO;
    deposit.tbtcToken = getTbtcTokenEntity().id;
  }
  return deposit as Deposit;
}

export function getOrCreateDepositRedemption(id: string): DepositRedemption{
  let depositRedemp = DepositRedemption.load(id);
  if(depositRedemp == null){
    depositRedemp = new DepositRedemption(id);
    let transaction = getOrCreateTransaction(id);
    depositRedemp.transaction = transaction.id
    depositRedemp.requestedFee = BIGINT_ZERO;
    depositRedemp.utxoSize = BIGINT_ZERO;
    depositRedemp.timestamp = BIGINT_ZERO;
  }
  return depositRedemp as DepositRedemption;
}

export function getOrCreateDepositLiquidation(id: string): DepositLiquidation{
  let depositLiquidation = DepositLiquidation.load(id);
  if(depositLiquidation == null){
    depositLiquidation = new DepositLiquidation(id);
    let transaction = getOrCreateTransaction(id);
    depositLiquidation.transaction = transaction.id
    depositLiquidation.timestamp = BIGINT_ZERO;
  }
  return depositLiquidation as DepositLiquidation;
}

export function getOrCreateEcdsaBonedKeep(id: string): BondedECDSAKeep{
  let ecdsaBonedKeep = BondedECDSAKeep.load(id);
  if(ecdsaBonedKeep == null){
    ecdsaBonedKeep = new BondedECDSAKeep(id);
    let transaction = getOrCreateTransaction(id);
    ecdsaBonedKeep.transaction = transaction.id
    ecdsaBonedKeep.timestamp = BIGINT_ZERO;
    ecdsaBonedKeep.bondAmount = BIGDECIMAL_ZERO;
  }
  return ecdsaBonedKeep as BondedECDSAKeep;
}

export function getOrCreateKeepMember(id: string): Member{
  let member = Member.load(id);
  if(member == null){
    member = new Member(id);
  }
  return member as Member;
}