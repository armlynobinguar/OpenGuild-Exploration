"use client";
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
import NoteItem from "./NoteItem"; // Update this import
import AddNoteButton from "./AddNoteButton"; // Change to your add note component

type Props = {};

const NoteList: React.FC<Props> = ({}) => {
  const { isConnected, contract, getActiveAccount } = useContractProvider();
  const [account, setAccount] = React.useState<InjectedAccount | undefined>(
    undefined
  );

  const { data: noteCount } = useQuery({
    queryKey: ["get-note-list"], // Change query key to reflect notes
    queryFn: async () => {
      if (!account) return;
      const result = await contract?.query.getNoteCounter(account.address, { // Update this function to fetch notes
        caller: account.address,
      });

      return result?.data || 0;
    },
    enabled: !!account && !!contract,
  });

  React.useEffect(() => {
    getActiveAccount?.().then((acc) => {
      setAccount(acc);
    });
  }, [getActiveAccount]);

  if (!isConnected) return null;

  return (
    <div>
      <div className="w-full flex justify-end items-center">
        <AddNoteButton /> {/* Update button for adding notes */}
      </div>
      <Table>
        <TableCaption>A list of your notes.</TableCaption> {/* Update caption */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Content</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {noteCount &&
            Array.from({ length: Number(noteCount) }).map((_, i) => (
              <NoteItem key={i} id={BigInt(i)} /> // Update to use NoteItem
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default NoteList;
