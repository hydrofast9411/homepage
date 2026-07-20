import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { historyEvents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { HistoryEventForm } from "@/components/admin/history-event-form";
import { updateHistoryEvent } from "../../actions";

export default async function EditHistoryEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [row] = await db.select().from(historyEvents).where(eq(historyEvents.id, id));
  if (!row) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">연혁 수정</h1>
      <HistoryEventForm action={updateHistoryEvent.bind(null, id)} initial={row} />
    </div>
  );
}
