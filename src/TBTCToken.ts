import { BigInt , log} from "@graphprotocol/graph-ts"
import {tBTCTokenContract, Approval, Transfer } from "../generated/tBTCTokenContract/tBTCTokenContract"

import {
  ZERO_ADDRESS,
  BIGINT_ONE,
  BIGINT_ZERO,
  BIGDECIMAL_ZERO
} from "./utils/contants";

import {
  getOrCreateApproval,
  getOrCreateTransfer,
  getOrCreateTokenHolder,
  getTbtcTokenEntity,
  getOrCreateTransaction,
  getOrCreateMint,
  getOrCreateBurn
} from "./utils/helpers";
import { toDecimal } from "./utils/decimals";


export function handleApproval(event: Approval): void {
  let id = event.transaction.hash.toHex()
  let approval = getOrCreateApproval(id)
  let transaction = getOrCreateTransaction(approval.id)
  approval.owner = event.params.owner
  approval.spender = event.params.spender
  approval.value = event.params.value
  transaction.timestamp = event.block.timestamp
  transaction.blockNumber = event.block.number
  approval.transaction = transaction.id;
  approval.timestamp = transaction.timestamp;
  transaction.save()
  approval.save()
}

export function handleTransfer(event: Transfer): void {
  let id = event.transaction.hash.toHex()
  let transfer = getOrCreateTransfer(id)
  let transaction = getOrCreateTransaction(transfer.id)
  let fromHolder = getOrCreateTokenHolder(event.params.from.toHexString());
  let toHolder = getOrCreateTokenHolder(event.params.to.toHexString());
  let tBtcToken = getTbtcTokenEntity();

  //Transfer
  transaction.blockNumber = event.block.number;
  transaction.timestamp = event.block.timestamp;
  transfer.transaction = transaction.id;
  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.value = toDecimal(event.params.value);
  transfer.timestamp = transaction.timestamp;
  transfer.gasPrice = event.transaction.gasPrice;
  transfer.gasUsed = event.transaction.gasUsed;
  transaction.save()
  transfer.save()

  // fromHolder
  if (event.params.from.toHexString() != ZERO_ADDRESS) {
    let fromHolderPreviousBalance = fromHolder.tokenBalanceRaw;
    fromHolder.tokenBalanceRaw =
    fromHolder.tokenBalanceRaw.minus(event.params.value);
    fromHolder.tokenBalance = toDecimal(fromHolder.tokenBalanceRaw);

    if (fromHolder.tokenBalanceRaw < BIGINT_ZERO) {
      log.error("Negative balance on holder {} with balance {}", [
        fromHolder.id,
        fromHolder.tokenBalanceRaw.toString()
      ]);
    }

    let contract = tBTCTokenContract.bind(event.address)
    tBtcToken.totalSupply = toDecimal(contract.totalSupply());
    if ( fromHolder.tokenBalanceRaw == BIGINT_ZERO && fromHolderPreviousBalance > BIGINT_ZERO) {
      tBtcToken.currentTokenHolders = tBtcToken.currentTokenHolders.minus(BIGINT_ONE);
    } else if ( fromHolder.tokenBalanceRaw > BIGINT_ZERO && fromHolderPreviousBalance == BIGINT_ZERO) {
      tBtcToken.currentTokenHolders = tBtcToken.currentTokenHolders.plus(BIGINT_ONE);
    }
    fromHolder.save();
  }else {
    //Increase total Mint
    tBtcToken.totalMint = tBtcToken.totalMint.plus(toDecimal(event.params.value));
    //Save mint transaction
    let mint = getOrCreateMint(id);
    mint.to = event.params.to;
    mint.transaction = transaction.id;
    mint.amount = toDecimal(event.params.value);
    mint.timestamp = transaction.timestamp;
    mint.save();
    transaction.burn.push(mint.id);
    transaction.save()
  }
  // toHolder
  let toHolderPreviousBalance = toHolder.tokenBalanceRaw;
  toHolder.tokenBalanceRaw = toHolder.tokenBalanceRaw.plus(event.params.value);
  toHolder.tokenBalance = toDecimal(toHolder.tokenBalanceRaw);
  toHolder.totalTokensHeldRaw = toHolder.totalTokensHeldRaw.plus(event.params.value);
  toHolder.totalTokensHeld = toDecimal(toHolder.totalTokensHeldRaw);

  //Calculate total burn
  if (event.params.to.toHexString() == ZERO_ADDRESS) {
    tBtcToken.totalBurn = tBtcToken.totalBurn.plus(toDecimal(event.params.value));
    //Save burn transaction
    let burn = getOrCreateBurn(id);
    burn.from = event.params.from;
    burn.transaction = transaction.id;
    burn.amount = toDecimal(event.params.value);
    burn.timestamp = transaction.timestamp;
    burn.save();
    transaction.burn.push(burn.id);
    transaction.save()
  }
  if (toHolder.tokenBalanceRaw == BIGINT_ZERO && toHolderPreviousBalance > BIGINT_ZERO ) {
    tBtcToken.currentTokenHolders = tBtcToken.currentTokenHolders.minus(BIGINT_ONE);
  } else if (
    toHolder.tokenBalanceRaw > BIGINT_ZERO &&
    toHolderPreviousBalance == BIGINT_ZERO
  ) {
    tBtcToken.currentTokenHolders = tBtcToken.currentTokenHolders.plus(BIGINT_ONE);
  }
  tBtcToken.save();
  toHolder.save();
}