"use client";
import React from "react";
import { useContractProvider } from "./ContractProvider";
import { InjectedAccount } from "@polkadot/extension-inject/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button"; // Ensure to import your button component
import { toast } from "sonner";
import { TableCell, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";

type Props = {
  id: bigint;
};

const NoteItem: React.FC<Props> = ({ id }) => {
  const { contract, signer, getActiveAccount } = useContractProvider();
  const [account, setAccount] = React.useState<InjectedAccount | undefined>(undefined);
  const queryClient = useQueryClient();

  // Fetch active account
  React.useEffect(() => {
    const fetchActiveAccount = async () => {
      const acc = await getActiveAccount?.();
      setAccount(acc);
    };
    fetchActiveAccount();
  }, [getActiveAccount]);

  // Fetch the note details
  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["get-note", id.toString()],
    queryFn: async () => {
      if (!account || !contract) return;
      const result = await contract.query.getNote(id, {
        caller: account.address,
      });
      return result?.data;
    },
    enabled: !!account && !!contract,
  });

  // Mutation for toggling the note status (or updating its content)
  const { mutateAsync: updateNote } = useMutation({
    mutationKey: ["update-note", id.toString()],
    mutationFn: async (updatedContent: string) => {
      if (!account || !contract) return;

      return new Promise((resolve, reject) =>
        contract.tx
          .updateNote(id, updatedContent)
          .signAndSend(
            account.address,
            { signer: signer },
            async ({ status }) => {
              if (
                status.type === "BestChainBlockIncluded" ||
                status.type === "Finalized"
              ) {
                resolve(id.toString());
              } else if (status.isError) {
                reject(new Error("Transaction failed"));
              }
            }
          )
      );
    },
  });

  // Handle updating the note
  const handleUpdate = async (newContent: string) => {
    try {
      await toast.promise(updateNote(newContent), {
        loading: "Updating note...",
        success: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["get-note", id.toString()],
          });
          return `Successfully updated note ${id.toString()}`;
        },
        error: "Failed to update note",
      });
    } catch (error) {
      console.error("Error updating note:", error);
      toast.error("Error updating note: " + error.message);
    }
  };

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [content, setContent] = React.useState(note?.content || "");

  const handleOpenDialog = () => {
    setContent(note?.content || "");
    setIsDialogOpen(true);
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{note?.id.toString()}</TableCell>
        <TableCell>{isLoading ? "Loading..." : isError ? "Error loading note" : note?.content}</TableCell>
        <TableCell className="text-right">
          <Button onClick={handleOpenDialog}>Edit</Button>
        </TableCell>
      </TableRow>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Edit your note here"
          />
          <div className="flex justify-end mt-4">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                handleUpdate(content);
                setIsDialogOpen(false);
              }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NoteItem;
