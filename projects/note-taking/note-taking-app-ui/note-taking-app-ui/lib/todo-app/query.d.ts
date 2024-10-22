// lib/noteContractQuery.ts

import type { GenericSubstrateApi } from "dedot/types";
import type { Result, AccountId32Like } from "dedot/codecs";
import type {
  GenericContractQuery,
  GenericContractQueryCall,
  ContractCallOptions,
  GenericContractCallResult,
  ContractCallResult,
} from "dedot/contracts";
import type { InkPrimitivesLangError, NoteAppNote } from "./types"; // Update to reflect your note type

export interface NoteContractQuery<ChainApi extends GenericSubstrateApi>
  extends GenericContractQuery<ChainApi> {
  /**
   *
   * @param {string} content
   * @param {ContractCallOptions} options
   *
   * @selector 0xbc42c980
   **/
  addNote: GenericContractQueryCall<
    ChainApi,
    (
      content: string,
      options: ContractCallOptions,
    ) => Promise<GenericContractCallResult<[], ContractCallResult<ChainApi>>>
  >;

  /**
   *
   * @param {bigint} id
   * @param {ContractCallOptions} options
   *
   * @selector 0x7561f746
   **/
  toggleNote: GenericContractQueryCall<
    ChainApi,
    (
      id: bigint,
      options: ContractCallOptions,
    ) => Promise<
      GenericContractCallResult<boolean, ContractCallResult<ChainApi>>
    >
  >;

  /**
   *
   * @param {bigint} id
   * @param {ContractCallOptions} options
   *
   * @selector 0x770698cf
   **/
  getNote: GenericContractQueryCall<
    ChainApi,
    (
      id: bigint,
      options: ContractCallOptions,
    ) => Promise<
      GenericContractCallResult<
        NoteAppNote | undefined,
        ContractCallResult<ChainApi>
      >
    >
  >;

  /**
   *
   * @param {AccountId32Like} accountId
   * @param {ContractCallOptions} options
   *
   * @selector 0x8100e7b8
   **/
  getNoteCounter: GenericContractQueryCall<
    ChainApi,
    (
      accountId: AccountId32Like,
      options: ContractCallOptions,
    ) => Promise<
      GenericContractCallResult<bigint, ContractCallResult<ChainApi>>
    >
  >;
}
