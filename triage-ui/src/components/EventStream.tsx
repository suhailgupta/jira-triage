import React, { useEffect, useRef, useState } from "react";
import type { StreamEvent } from "../types/api";

type Props = {
    runId: string;
};

export default function EventStream({ runId }: Props) {
    const [events, setEvents] = useState<StreamEvent[]>([]);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const esRef = useRef<EventSource | null>(null);

    useEffect(() => {
        setEvents([]);
        if (!runId) return;

        // Ensure an existing EventSource is closed first
        if (esRef.current) {
            esRef.current.close();
            esRef.current = null;
        }

        const es = new EventSource(`/api/events/${runId}/stream`);
        esRef.current = es;

        es.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data) as StreamEvent;
                setEvents((prev) => [...prev, data]);
            } catch {
                setEvents((prev) => [...prev, { type: "raw", text: e.data }]);
            }
        };

        es.onerror = () => {
            // optional: push a system message
            setEvents((prev) => [...prev, { type: "system", text: "Connection closed." }]);
            es.close();
        };

        return () => {
            es.close();
        };
    }, [runId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [events]);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 h-80 overflow-auto">
            <h3 className="text-md font-semibold mb-3">Event Stream</h3>
            <div className="flex flex-col gap-3">
                {events.map((ev, i) => (
                    <div key={i} className={`p-3 rounded-lg ${ev.type === "error" ? "bg-red-50 dark:bg-red-900/30" : "bg-gray-50 dark:bg-gray-800"}`}>
                        <div className="text-sm whitespace-pre-wrap">{ev.text}</div>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}