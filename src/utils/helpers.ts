import {
  Approval,
  Transfer,
  TokenHolder,
  TBTCToken,
  Transaction,
  Mint,
  Burn,
  DepositRedemption,
  AllowNewDepositsUpdated
} from "../../generated/schema";

import { DEFAULT_DECIMALS } from "./decimals";

import {
  ZERO_ADDRESS,
  BIGINT_ZERO,
  BIGINT_ONE,
  BIGDECIMAL_ZERO,
  TBTC_CONTRACT,
  BYTE_ZERO,
  MAX_SUPPLY
} from "./contants";
import { Bytes , Address} from "@graphprotocol/graph-ts";

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

export function getOrCreateApproval
  (id: string): Approval {
  let approval = Approval.load(id);
  if (approval == null) {
    approval = new Approval(id);
  }
  approval.value = BIGINT_ZERO;
  approval.timestamp = BIGINT_ZERO;
  let transaction = getOrCreateTransaction(id);
  approval.transaction = transaction.id;
  approval.save();
  return approval as Approval;
}

export function getOrCreateTransfer
  (id: string): Transfer {
  let transfer = Transfer.load(id);
  if (transfer == null) {
    transfer = new Transfer(id);
  }
  transfer.value = BIGDECIMAL_ZERO;
  transfer.timestamp = BIGINT_ZERO;
  let transaction = getOrCreateTransaction(id);
  transfer.transaction = transaction.id;
  transfer.save();
  return transfer as Transfer; 
}

export function getOrCreateTokenHolder(
  id: String,
  createIfNotFound: boolean = true,
  save: boolean = true
): TokenHolder {
  let tokenHolder = TokenHolder.load(id.toString());

  if (tokenHolder == null && createIfNotFound) {
    tokenHolder = new TokenHolder(id.toString());
    tokenHolder.tokenBalanceRaw = BIGINT_ZERO;
    tokenHolder.tokenBalance = BIGDECIMAL_ZERO;
    tokenHolder.totalTokensHeldRaw = BIGINT_ZERO;
    tokenHolder.totalTokensHeld = BIGDECIMAL_ZERO;

    if (id != ZERO_ADDRESS) {
      let governance = getTbtcTokenEntity();
      governance.totalTokenHolders = governance.totalTokenHolders.plus(BIGINT_ONE);
      governance.save();
    }

    if (save) {
      tokenHolder.save();
    }
  }

  return tokenHolder as TokenHolder;
}

export function getTbtcTokenEntity(): TBTCToken {
  let tBtcToken = TBTCToken.load("TBTCToken");

  if (tBtcToken == null) {
    tBtcToken = new TBTCToken("TBTCToken");
    tBtcToken.totalTokenHolders = BIGINT_ZERO;
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

export function getOrCreateMint(id: string): Mint {
  let mint = Mint.load(id);
  if (mint == null) {
    mint = new Mint(id);
  }
  mint.amount = BIGDECIMAL_ZERO;
  mint.timestamp = BIGINT_ZERO;
  let transaction = getOrCreateTransaction(id);
  mint.transaction = transaction.id
  return mint as Mint;
}

export function getOrCreateBurn(id: string): Burn {
  let burn = Burn.load(id);
  if (burn == null) {
    burn = new Burn(id);
  }
  burn.timestamp = BIGINT_ZERO;
  let transaction = getOrCreateTransaction(id);
  burn.transaction = transaction.id
  return burn as Burn;
}

export function getOrCreateAllowNewDepositsUpdated(): AllowNewDepositsUpdated {
  let id = "AllowNewDepositsUpdated";
  let allowNewDepositsUpdated = AllowNewDepositsUpdated.load(id);
  if (allowNewDepositsUpdated == null) {
    allowNewDepositsUpdated = new AllowNewDepositsUpdated(id);
  }
  allowNewDepositsUpdated.allowNewDepositsUpdated = true;
  return allowNewDepositsUpdated as AllowNewDepositsUpdated;
}
// id: ID!
// transaction: Transaction
// depositContractAddress: Bytes!,
// digest: Bytes!,
// outpoint : Bytes!,
// redeemerOutputScript: Bytes!,
// requestedFee : BigInt!,
// requester : Bytes!,
// utxoSize : BigInt!
export function getOrCreateDepositRedemption(id: string): DepositRedemption{
  let depositRedemp = DepositRedemption.load(id);
  if(depositRedemp == null){
    depositRedemp = new DepositRedemption(id);
  }
  let transaction = getOrCreateTransaction(id);
  depositRedemp.transaction = transaction.id
  depositRedemp.depositContractAddress = BYTE_ZERO;
  depositRedemp.digest = BYTE_ZERO;
  depositRedemp.outpoint = BYTE_ZERO;
  depositRedemp.redeemerOutputScript = BYTE_ZERO;
  depositRedemp.requestedFee = BIGINT_ZERO;
  depositRedemp.requester = BYTE_ZERO;
  depositRedemp.utxoSize = BIGINT_ZERO;
  return depositRedemp as DepositRedemption;
}