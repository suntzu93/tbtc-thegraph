import { BigInt , log} from "@graphprotocol/graph-ts"
import {DepositContract, 
CreateNewDepositCall, 
TransferAndRequestRedemptionCall,
RequestRedemptionCall,
ProvideRedemptionProofCall,
ProvideRedemptionSignatureCall } 
from "../generated/DepositContract/DepositContract"


export function handleCreateNewDeposit (event: CreateNewDepositCall): void{
  log.warning("handleCreateNewDeposit \
  _feeRebateToken = {},\
  _lotSizeSatoshis = {},\
  _tbtcDepositToken = {},\
  _tbtcSystem = {},\
  _tbtcToken = {},\
  _vendingMachineAddress = {},\
  txHash ={} \
  ",[
    event.inputs._feeRebateToken.toHexString(),
    event.inputs._lotSizeSatoshis.toString(),

    event.inputs._tbtcDepositToken.toHexString(),
    event.inputs._tbtcSystem.toHexString(),
    event.inputs._tbtcToken.toHexString(),
    event.inputs._vendingMachineAddress.toHexString(),
    event.transaction.hash.toHexString()
  ])
}

export function handleTransferAndRequestRedemption(event: TransferAndRequestRedemptionCall): void{
  log.warning("handleTransferAndRequestRedemption \
  _finalRecipient = {},\
  _outputValueBytes = {},\
  _redeemerOutputScript = {},\
  txHash ={} \
  ",[
    event.inputs._finalRecipient.toHexString(),
    event.inputs._outputValueBytes.toHexString(),
    event.inputs._redeemerOutputScript.toHexString(),
    event.transaction.hash.toHexString()
  ])
}

export function handleRequestRedemption(event: RequestRedemptionCall): void{
  log.warning("handleRequestRedemption \
  _redeemerOutputScript = {},\
  _outputValueBytes = {},\
  value0 = {},\
  txHash ={} \
  ",[
    event.inputs._redeemerOutputScript.toHexString(),
    event.inputs._outputValueBytes.toHexString(),
    `${event.outputs.value0}`,
    event.transaction.hash.toHexString()
  ])
}

export function handleProvideRedemptionSignature(event: ProvideRedemptionSignatureCall): void{
  let v = BigInt.fromI32(event.inputs._v);
  log.warning("provideRedemptionSignature \
  _r = {},\
  _s = {},\
  v = {},\
  txHash ={} \
  ",[
    event.inputs._r.toHexString(),
    event.inputs._s.toHexString(),
    v.toString(),
    event.transaction.hash.toHexString()
  ])
}


export function handleProvideRedemptionProof(event: ProvideRedemptionProofCall): void{
  log.warning("provideRedemptionProof \
  _bitcoinHeaders = {},\
  _merkleProof = {},\
  _txIndexInBlock = {},\
  _txInputVector = {},\
  _txLocktime = {},\
  _txVersion = {},\
  _txOutputVector = {},\
  txHash ={} \
  ",[
    event.inputs._bitcoinHeaders.toHexString(),
    event.inputs._merkleProof.toHexString(),
    event.inputs._txIndexInBlock.toHexString(),
    event.inputs._txInputVector.toHexString(),
    event.inputs._txLocktime.toHexString(),
    event.inputs._txOutputVector.toHexString(),
    event.inputs._txVersion.toHexString(),
    event.transaction.hash.toHexString()
  ])
}