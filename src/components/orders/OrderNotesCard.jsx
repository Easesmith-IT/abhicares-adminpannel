import { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatInstant } from "@/utils/dateTime";
import usePostApiReq from "../../hooks/usePostApiReq";

export default function OrderNotesCard({
  orderId,
  initialSystemComment,
  orderNotes,
  onNoteAdded,
}) {
  const [newNote, setNewNote] = useState("");
  const [notes, setNotes] = useState([]);
  const { res, fetchData: addOrderNote, isLoading } = usePostApiReq();
  const onNoteAddedRef = useRef(onNoteAdded);

  const seededNotes = useMemo(() => {
    const normalized = Array.isArray(orderNotes)
      ? orderNotes.map((note, index) => ({
          id: note?._id || `${index}-${note?.createdAt || ""}`,
          author: note?.createdBy || "Admin",
          date: note?.createdAt || new Date().toISOString(),
          comment: note?.text || "",
          isSystem: false,
        }))
      : [];

    if (normalized.length > 0) {
      return normalized;
    }

    if (initialSystemComment) {
      return [
        {
          id: "system-comment",
          author: "System Event",
          date: new Date().toISOString(),
          comment:
            initialSystemComment === "Your oder has been placed"
              ? "Order registered in database."
              : initialSystemComment,
          isSystem: true,
        },
      ];
    }

    return [];
  }, [initialSystemComment, orderNotes]);

  useEffect(() => {
    setNotes(seededNotes);
  }, [seededNotes]);

  useEffect(() => {
    onNoteAddedRef.current = onNoteAdded;
  }, [onNoteAdded]);

  useEffect(() => {
    if (res?.status === 200) {
      const updated = Array.isArray(res.data?.data)
        ? res.data.data.map((note, index) => ({
            id: note?._id || `${index}-${note?.createdAt || ""}`,
            author: note?.createdBy || "Admin",
            date: note?.createdAt || new Date().toISOString(),
            comment: note?.text || "",
            isSystem: false,
          }))
        : [];

      setNotes(updated);
      setNewNote("");
      onNoteAddedRef.current?.();
    }
  }, [res]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newNote.trim() || !orderId) return;
    addOrderNote(`/admin/add-order-note/${orderId}`, {
      text: newNote.trim(),
    });
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-500" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-50">
            Internal Operations Notes
          </h3>
        </div>
        <span className="rounded bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-500 dark:bg-gray-900 dark:text-gray-400">
          Persisted
        </span>
      </div>

      <div className="mb-5 max-h-[300px] space-y-4 overflow-y-auto pr-1 scrollbar-thin">
        {notes.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">
            No support notes on this order yet.
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={`rounded-xl border p-3 text-sm ${
                note.isSystem
                  ? "border-gray-100 bg-gray-50/70 dark:border-gray-900 dark:bg-gray-900/45"
                  : "border-blue-50/50 bg-blue-50/30 dark:border-blue-950/20 dark:bg-blue-950/10"
              }`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span
                  className={`text-xs font-semibold ${
                    note.isSystem
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-blue-700 dark:text-blue-400"
                  }`}
                >
                  {note.author}
                </span>
                <span className="text-[10px] text-gray-400">
                  {formatInstant(note.date, "dd MMM yyyy, hh:mm aa")}
                </span>
              </div>
              <p className="break-words leading-relaxed text-gray-700 dark:text-gray-300">
                {note.comment}
              </p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          placeholder="Type an internal support note... (e.g. Customer requested technician after 6 PM)"
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
          className="min-h-[80px] rounded-xl border-gray-200 text-sm focus-visible:ring-blue-500 dark:border-gray-800"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={!newNote.trim() || isLoading}
            className="h-9 gap-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            <Send className="h-3.5 w-3.5" />
            {isLoading ? "Saving..." : "Add Note"}
          </Button>
        </div>
      </form>
    </div>
  );
}
