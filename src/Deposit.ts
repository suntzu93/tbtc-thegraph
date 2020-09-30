import { BigInt, log, DataSourceContext, dataSource } from "@graphprotocol/graph-ts"


import {
    getOrCreateDeposit,
} from "./utils/helpers";

import {
    InitializeDepositCall
} from "../generated/templates/DepositContract/DepositContract"

import { toDecimalBtc } from "./utils/decimals";

export function handleInitializeDeposit(event: InitializeDepositCall): void {
    let context = dataSource.context();
    let owner = context.getString("depositAddress")
    let deposit = getOrCreateDeposit(owner);
    deposit.lotSize = toDecimalBtc(event.inputs._lotSizeSatoshis);
    deposit.state = "AWAITING_SIGNER_SETUP";
    deposit.save()
}