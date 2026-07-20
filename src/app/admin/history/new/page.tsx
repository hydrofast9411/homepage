import { HistoryEventForm } from "@/components/admin/history-event-form";
import { createHistoryEvent } from "../actions";

export default function NewHistoryEventPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">연혁 추가</h1>
      <HistoryEventForm action={createHistoryEvent} />
    </div>
  );
}
