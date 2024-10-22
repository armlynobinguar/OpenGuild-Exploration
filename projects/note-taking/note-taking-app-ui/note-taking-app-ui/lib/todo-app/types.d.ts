// lib/noteTypes.ts

export type InkStorageLazyMapping = {};

export type NoteAppNote = { id: bigint; content: string; completed: boolean };

export type InkStorageTraitsImplsResolverKey = {};

export type InkStorageTraitsImplsAutoKey = {};

export type InkStorageTraitsImplsManualKey = {};

export type NoteApp = {
  notes: InkStorageLazyMapping;  // Changed from `todos` to `notes`
  counter: InkStorageLazyMapping;
};

export type InkPrimitivesLangError = "CouldNotReadInput";

export type InkEnvNoChainExtension = null;
