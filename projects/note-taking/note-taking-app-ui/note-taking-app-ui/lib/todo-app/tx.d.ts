// lib/noteContractTx.ts

import type { GenericSubstrateApi } from "dedot/types";
import type {
  GenericContractTx,
  GenericContractTxCall,
  ContractTxOptions,
  ContractSubmittableExtrinsic,
} from "dedot/contracts";

export interface NoteContractTx<ChainApi extends GenericSubstrateApi>
  extends GenericContractTx<ChainApi> {
  /**
   *
   * @param {string} content
   * @param {ContractTxOptions} options
   *
   * @selector 0xbc42c980
   **/
  addNote: GenericContractTxCall<
    ChainApi,
    (
      content: string,
      options: ContractTxOptions,
    ) => ContractSubmittableExtrinsic<ChainApi>
  >;

  /**
   *
   * @param {bigint} id
   * @param {ContractTxOptions} options
   *
   * @selector 0x7561f746
   **/
  toggleNote: GenericContractTxCall<
    ChainApi,
    (
      id: bigint,
      options: ContractTxOptions,
    ) => ContractSubmittableExtrinsic<ChainApi>
  >;
}
