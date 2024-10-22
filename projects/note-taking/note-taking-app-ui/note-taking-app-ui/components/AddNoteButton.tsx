"use client";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Loader2, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "./ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useContractProvider } from "./ContractProvider";
import { InjectedAccount } from "@polkadot/extension-inject/types";

// Define props for the component
type Props = {};

// Define the form schema using Zod
const formSchema = z.object({
  content: z.string().min(3).max(500), // Increased max length for notes
});

// Infer the form schema type
type FormSchemaType = z.infer<typeof formSchema>;

const AddNoteButton: React.FC<Props> = () => {
  const { contract, signer, getActiveAccount } = useContractProvider();
  const [account, setAccount] = useState<InjectedAccount | undefined>(undefined);
  const queryClient = useQueryClient();
  
  // Dialog open state
  const [isOpen, setIsOpen] = useState(false);
  
  // Form setup using react-hook-form
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  // Mutation for adding a note
  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["add-note"],
    mutationFn: async (data: FormSchemaType) => {
      if (!account || !contract) return;
      const { raw } = await contract.query.addNote(data.content, {
        caller: account.address,
      });

      return new Promise((resolve) =>
        contract.tx
          .addNote(data.content, {
            gasLimit: raw.gasRequired,
          })
          .signAndSend(
            account.address,
            { signer },
            async ({ status }) => {
              if (status.type === "BestChainBlockIncluded" || status.type === "Finalized") {
                resolve(data);
              }
            }
          )
      );
    },
  });

  // Handle form submission
  const onSubmit = (values: FormSchemaType) => {
    toast.promise(mutateAsync(values), {
      loading: "Creating note...",
      success: async () => {
        await queryClient.invalidateQueries({ queryKey: ["get-note-list"] });
        setIsOpen(false);
        form.reset();
        return "Note created successfully";
      },
      error: "Failed to create note",
    });
  };

  // Fetch active account on component mount
  useEffect(() => {
    getActiveAccount?.().then(setAccount);
  }, [getActiveAccount]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="w-5 h-5 mr-2" />
          Add Note
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new note</DialogTitle>
          <DialogDescription>
            Input the content of your new note.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your note here..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 items-center">
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Close
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="animate-spin mr-2 w-5 h-5" />}
                Add
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteButton; // Updated export name
