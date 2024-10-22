// lib/noteConstructorTx.ts

import type { GenericSubstrateApi } from "dedot/types";
import type {
  GenericConstructorTx,
  GenericConstructorTxCall,
  ConstructorTxOptions,
  GenericInstantiateSubmittableExtrinsic,
} from "dedot/contracts";

export interface NoteConstructorTx<ChainApi extends GenericSubstrateApi>
  extends GenericConstructorTx<ChainApi> {
  /**
   * Create a new note transaction.
   *
   * @param {ConstructorTxOptions} options - Options for the transaction.
   * @returns {GenericInstantiateSubmittableExtrinsic<ChainApi>} - The submittable extrinsic for the note creation.
   * @selector 0x9bae9d5e
   */
  createNote: GenericConstructorTxCall<
    ChainApi,
    (
      options: ConstructorTxOptions,
    ) => GenericInstantiateSubmittableExtrinsic<ChainApi>
  >;
}
