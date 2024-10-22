"use client"; // This must be the first line

import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useContractProvider } from "./ContractProvider";
import { useQuery } from "@tanstack/react-query";
import { InjectedAccount } from "@polkadot/extension-inject/types";
import NoteItem from "./NoteItem"; 
import AddNoteButton from "./AddNoteButton"; 

const NoteList: React.FC = () => {
  const { isConnected, contract, getActiveAccount } = useContractProvider();
  const [account, setAccount] = React.useState<InjectedAccount | undefined>(undefined);

  const { data: noteCount, error, isLoading } = useQuery<number | undefined, Error>({
    queryKey: ["get-note-count"],
    queryFn: async () => {
      if (!account || !contract) return undefined;
      const result = await contract.query.getNoteCounter(account.address, {
        caller: account.address,
      });
      return result?.data || 0;
    },
    enabled: !!account && !!contract,
  });

  React.useEffect(() => {
    const fetchAccount = async () => {
      const acc = await getActiveAccount?.();
      setAccount(acc);
    };
    fetchAccount();
  }, [getActiveAccount]);

  if (!isConnected) return <p>Please connect your wallet.</p>;

  if (isLoading) return <p>Loading notes...</p>;

  if (error) return <p>Error fetching notes: {error.message}</p>;

  return (
    <div>
      <div className="w-full flex justify-end items-center">
        <AddNoteButton />
      </div>
      <Table>
        <TableCaption>A list of your notes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Content</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {noteCount && Array.from({ length: Number(noteCount) }).map((_, i) => (
            <NoteItem key={i} id={BigInt(i)} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NoteList;
