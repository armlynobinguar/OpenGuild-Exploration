// lib/noteConstructor.ts

import type { GenericSubstrateApi } from "dedot/types";
import type { Result } from "dedot/codecs";
import type {
  GenericConstructorQuery,
  GenericConstructorQueryCall,
  GenericConstructorCallResult,
  ConstructorCallOptions,
  ContractInstantiateResult,
} from "dedot/contracts";
import type { InkPrimitivesLangError } from "./types";

export interface NoteConstructorQuery<ChainApi extends GenericSubstrateApi>
  extends GenericConstructorQuery<ChainApi> {
  /**
   * Create a new note instance.
   *
   * @param {ConstructorCallOptions} options - Options for constructing the note.
   * @returns {Promise<GenericConstructorCallResult<[], ContractInstantiateResult<ChainApi>>>}
   * @selector 0x9bae9d5e
   */
  createNote: GenericConstructorQueryCall<
    ChainApi,
    (
      options: ConstructorCallOptions,
    ) => Promise<
      GenericConstructorCallResult<[], ContractInstantiateResult<ChainApi>>
    >
  >;

  /**
   * Retrieve an existing note instance.
   *
   * @param {string} noteId - The ID of the note to retrieve.
   * @returns {Promise<Result<NoteDetails, InkPrimitivesLangError>>}
   */
  getNote: (noteId: string) => Promise<Result<NoteDetails, InkPrimitivesLangError>>;
}

// Define NoteDetails interface
export interface NoteDetails {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
