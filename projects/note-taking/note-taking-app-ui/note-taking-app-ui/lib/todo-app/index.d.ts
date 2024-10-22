// lib/noteAppContractApi.ts

import type {
  VersionedGenericSubstrateApi,
  RpcVersion,
  RpcV2,
} from "dedot/types";
import type { GenericContractApi } from "dedot/contracts";
import type { SubstrateApi } from "dedot/chaintypes";
import type { InkPrimitivesLangError } from "./types";
import { NoteContractQuery } from "./noteQuery"; // Assuming this is your modified query file
import { NoteContractTx } from "./noteTx"; // Assuming this is your modified transaction file
import { ConstructorQuery } from "./constructor-query";
import { ConstructorTx } from "./constructor-tx";
import { NoteContractEvents } from "./noteEvents"; // Assuming this is your modified events file

export * from "./types";

export interface NoteAppContractApi<
  Rv extends RpcVersion = RpcV2,
  ChainApi extends VersionedGenericSubstrateApi = SubstrateApi,
> extends GenericContractApi<Rv, ChainApi> {
  query: NoteContractQuery<ChainApi[Rv]>; // Updated for note-related queries
  tx: NoteContractTx<ChainApi[Rv]>; // Updated for note-related transactions
  constructorQuery: ConstructorQuery<ChainApi[Rv]>;
  constructorTx: ConstructorTx<ChainApi[Rv]>;
  events: NoteContractEvents<ChainApi[Rv]>; // Updated for note-related events

  types: {
    LangError: InkPrimitivesLangError;
    ChainApi: ChainApi[Rv];
  };
}

