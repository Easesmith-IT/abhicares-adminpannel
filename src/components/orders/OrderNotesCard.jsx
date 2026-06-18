import { useState, useEffect } from "react";
import { format } from "date-fns";
import { MessageSquare, Send, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function OrderNotesCard({ orderId, initialSystemComment }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  // Key for local storage
  const storageKey = `abhicares_notes_${orderId}`;

  // Load notes on mount/change
  useEffect(() => {
    if (!orderId) return;

    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Failed to parse saved notes", e);
      }
    } else {
      // Seed with initial comment if exists
      const seedNotes = [];
      if (initialSystemComment && initialSystemComment !== "Your oder has been placed") {
        seedNotes.push({
          author: "System Event",
          date: new Date().toISOString(),
          comment: initialSystemComment,
          isSystem: true
        });
      } else if (initialSystemComment) {
        seedNotes.push({
          author: "System Event",
          date: new Date().toISOString(),
          comment: "Order registered in database.",
          isSystem: true
        });
      }
      setNotes(seedNotes);
      localStorage.setItem(storageKey, JSON.stringify(seedNotes));
    }
  }, [orderId, initialSystemComment]);

  // Handle Note Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const updatedNotes = [
      ...notes,
      {
        author: "Admin Support", // Simulated active admin
        date: new Date().toISOString(),
        comment: newNote.trim(),
        isSystem: false
      }
    ];

    setNotes(updatedNotes);
    localStorage.setItem(storageKey, JSON.stringify(updatedNotes));
    setNewNote("");
  };

  // Delete note
  const handleDeleteNote = (indexToDelete) => {
    const updatedNotes = notes.filter((_, idx) => idx !== indexToDelete);
    setNotes(updatedNotes);
    localStorage.setItem(storageKey, JSON.stringify(updatedNotes));
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-50">Internal Operations Notes</h3>
        </div>
        <span className="rounded bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-900 dark:text-gray-400">
          Admins Only
        </span>
      </div>

      {/* Notes log */}
      <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1 mb-5 scrollbar-thin">
        {notes.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No support notes on this order yet.</p>
        ) : (
          notes.map((note, index) => (
            <div 
              key={index}
              className={`rounded-xl p-3 text-sm transition-all duration-200 group relative
                ${note.isSystem 
                  ? "bg-gray-50/70 border border-gray-100 dark:bg-gray-900/45 dark:border-gray-900" 
                  : "bg-blue-50/30 border border-blue-50/50 dark:bg-blue-950/10 dark:border-blue-950/20"
                }
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-semibold ${note.isSystem ? "text-gray-500 dark:text-gray-400" : "text-blue-700 dark:text-blue-400"}`}>
                  {note.author}
                </span>
                <span className="text-[10px] text-gray-400">
                  {format(new Date(note.date), "dd MMM yyyy, hh:mm aa")}
                </span>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed break-words pr-6">
                {note.comment}
              </p>

              {/* Delete button (visible on hover for user added notes) */}
              {!note.isSystem && (
                <button
                  onClick={() => handleDeleteNote(index)}
                  className="absolute right-3 bottom-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Submit Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder="Type an internal support note... (e.g. 'Customer requested technician after 6 PM')"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="min-h-[80px] rounded-xl border-gray-200 text-sm focus-visible:ring-blue-500 dark:border-gray-800"
        />
        <div className="flex justify-end">
          <Button 
            type="submit" 
            size="sm" 
            disabled={!newNote.trim()}
            className="rounded-xl gap-1.5 h-9 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Send className="h-3.5 w-3.5" />
            Add Note
          </Button>
        </div>
      </form>
    </div>
  );
}
