import { BigInt, log, DataSourceContext, dataSource } from "@graphprotocol/graph-ts"


import {
    getOrCreateDepositRedemption,
    getOrCreateTransaction,
    getOrCreateAllowNewDepositsUpdated,
    getOrCreateDepositLiquidation as getDepositLiquidation,
    getOrCreateDeposit,
    getTbtcTokenEntity
} from "./utils/helpers";

import {
    CreateNewDepositCall,
    InitializeCall
} from "../generated/templates/DepositContract/DepositContract"

export function handleCreateNewDeposit(event: CreateNewDepositCall): void {
    let context = dataSource.context();
    let owner = context.getString("depositAddress")
    let deposit = getOrCreateDeposit(owner);
    log.error("owner = {}, lotsize = {}" ,[owner,event.inputs._lotSizeSatoshis.toString()])
    deposit.lotSize = event.inputs._lotSizeSatoshis;
    deposit.state = "AWAITING_SIGNER_SETUP";
    deposit.save()
}