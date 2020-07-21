import { BigInt, log ,DataSourceContext} from "@graphprotocol/graph-ts"
import {
  DepositCloneCreated,
} from "../generated/DepositFactoryContract/DepositFactoryContract"

import {
  DepositContract
} from "../generated/templates"

export function handleDepositCloneCreated(event: DepositCloneCreated): void {
  let context = new DataSourceContext();
  context.setString("depositAddress", event.params.depositCloneAddress.toHex())
  DepositContract.createWithContext(event.params.depositCloneAddress,context);
  
  log.debug("handleDepositCloneCreated owner = {}",[event.params.depositCloneAddress.toHex()])
}
