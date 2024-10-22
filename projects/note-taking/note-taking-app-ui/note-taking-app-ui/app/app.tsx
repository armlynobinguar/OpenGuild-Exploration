"use client"; // This must be the first line

import { useState } from "react";
import NoteList from "@/components/NoteList"; // Ensure NoteList is also a client component

export default function Home() {
  const [notes, setNotes] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const handleAddNote = () => {
    if (note) {
      setNotes([...notes, note]);
      setNote("");
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold">Your Notes</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write a note..."
          className="border border-gray-300 rounded p-2 flex-1"
        />
        <button
          onClick={handleAddNote}
          className="bg-blue-500 text-white rounded p-2"
        >
          Add Note
        </button>
      </div>
      <NoteList />
    </div>
  );
}
