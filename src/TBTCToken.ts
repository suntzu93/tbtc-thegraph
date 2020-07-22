import { BigInt , log} from "@graphprotocol/graph-ts"
import {TBTCTokenContract, Approval, Transfer } from "../generated/TBTCTokenContract/TBTCTokenContract"

import {
  Mint
} from "../generated/schema";

import {
  ZERO_ADDRESS,
  BIGINT_ONE,
  BIGINT_ZERO,
  BIGDECIMAL_ZERO
} from "./utils/contants";

import {
  getOrCreateTransfer,
  getOrCreateTokenHolder,
  getTbtcTokenEntity,
  getOrCreateTransaction
} from "./utils/helpers";
import { toDecimal } from "./utils/decimals";


export function handleTransfer(event: Transfer): void {
  let id = event.transaction.hash.toHex()
  let transfer = getOrCreateTransfer(id)
  let transaction = getOrCreateTransaction(transfer.id)
  let fromHolder = getOrCreateTokenHolder(event.params.from.toHexString());
  let toHolder = getOrCreateTokenHolder(event.params.to.toHexString());
  let tBtcToken = getTbtcTokenEntity();

  //Transfer
  transfer.blockNumber = event.block.number;
  transfer.from = event.params.from;
  transfer.to = event.params.to;
  transfer.value = toDecimal(event.params.value);
  transfer.timestamp = transaction.timestamp;
  transfer.gasPrice = event.transaction.gasPrice;
  transfer.gasUsed = event.transaction.gasUsed;
  transfer.save()

  // fromHolder
  if (event.params.from.toHexString() != ZERO_ADDRESS) {
    let fromHolderPreviousBalance = fromHolder.tokenBalanceRaw;
    fromHolder.tokenBalanceRaw = fromHolder.tokenBalanceRaw.minus(event.params.value);
    fromHolder.tokenBalance = toDecimal(fromHolder.tokenBalanceRaw);
    fromHolder.tbtcToken = tBtcToken.id;

    if (fromHolder.tokenBalanceRaw < BIGINT_ZERO) {
      log.error("Negative balance on holder {} with balance {}", [
        fromHolder.id,
        fromHolder.tokenBalanceRaw.toString()
      ]);
    }

    let contract = TBTCTokenContract.bind(event.address)
    tBtcToken.totalSupply = toDecimal(contract.totalSupply());
    if ( fromHolder.tokenBalanceRaw == BIGINT_ZERO && fromHolderPreviousBalance > BIGINT_ZERO) {
      tBtcToken.currentTokenHolders = tBtcToken.currentTokenHolders.minus(BIGINT_ONE);
    } else if ( fromHolder.tokenBalanceRaw > BIGINT_ZERO && fromHolderPreviousBalance == BIGINT_ZERO) {
      tBtcToken.currentTokenHolders = tBtcToken.currentTokenHolders.plus(BIGINT_ONE);
    }
    fromHolder.save();
  } else {
    //Increase total Mint
    tBtcToken.totalMint = tBtcToken.totalMint.plus(toDecimal(event.params.value));
    transaction.timestamp = event.block.timestamp;
    transaction.blockNumber = event.block.number;
    transaction.from = event.transaction.from;
    transaction.to = event.transaction.to;
    transaction.save()

    //Save mint transaction
    var index = event.transaction.index;
    var hash = id + "-" + index.toString();
    let mint = Mint.load(hash);
    if(mint != null){
      index = index.plus(BIGINT_ONE);
      hash = id + "-" + index.toString();
      mint = new Mint(hash);
    }
    mint = new Mint(hash);
    mint.to = event.params.to;
    mint.transaction = transaction.id;
    mint.amount = toDecimal(event.params.value);
    mint.timestamp = event.block.timestamp;
    mint.save();
  }
  // toHolder
  if (event.params.to.toHexString() == ZERO_ADDRESS) {
    tBtcToken.totalBurn = tBtcToken.totalBurn.plus(toDecimal(event.params.value));
  }else{
    let toHolderPreviousBalance = toHolder.tokenBalanceRaw;
    toHolder.tokenBalanceRaw = toHolder.tokenBalanceRaw.plus(event.params.value);
    toHolder.tokenBalance = toDecimal(toHolder.tokenBalanceRaw);
    toHolder.totalTokensHeldRaw = toHolder.totalTokensHeldRaw.plus(event.params.value);
    toHolder.totalTokensHeld = toDecimal(toHolder.totalTokensHeldRaw);
    toHolder.tbtcToken = tBtcToken.id;

    if (toHolder.tokenBalanceRaw == BIGINT_ZERO && toHolderPreviousBalance > BIGINT_ZERO ) {
      tBtcToken.currentTokenHolders = tBtcToken.currentTokenHolders.minus(BIGINT_ONE);
    } else if ( toHolder.tokenBalanceRaw > BIGINT_ZERO && toHolderPreviousBalance == BIGINT_ZERO) {
      tBtcToken.currentTokenHolders = tBtcToken.currentTokenHolders.plus(BIGINT_ONE);
    }
    toHolder.save();
  }
  tBtcToken.save();
}