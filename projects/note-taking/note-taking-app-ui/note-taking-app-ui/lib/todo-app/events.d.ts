// lib/noteContractEvents.ts

import type { GenericSubstrateApi } from "dedot/types";
import type {
  GenericContractEvents,
  GenericContractEvent,
} from "dedot/contracts";

export interface NoteContractEvents<ChainApi extends GenericSubstrateApi>
  extends GenericContractEvents<ChainApi> {
  /**
   * Event emitted when a new note is created.
   */
  NoteCreated: GenericContractEvent<ChainApi>;

  /**
   * Event emitted when a note is updated.
   */
  NoteUpdated: GenericContractEvent<ChainApi>;

  /**
   * Event emitted when a note is deleted.
   */
  NoteDeleted: GenericContractEvent<ChainApi>;
}
