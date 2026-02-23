import React, { useState } from "react";
import DiffViewer from "react-diff-viewer-continued";

type Props = {
    runId: string;
};

type DiffFiles = Record<string, { changes: string }>;

export default function SuggestCodeChanges({ runId }: Props) {
    const [diffs, setDiffs] = useState<DiffFiles | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function requestChanges() {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`/api/suggest-changes/${runId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });
            if (!res.ok) {
                const t = await res.text().catch(() => "");
                setError(t || `Server returned ${res.status}`);
                setLoading(false);
                return;
            }
            const json = await res.json();
            setDiffs(json.files || null);
        } catch (err: any) {
            setError(err?.message || "Network error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-semibold">Suggest Code Changes</h3>
                <button onClick={requestChanges} className="px-3 py-1 rounded-md bg-primary text-white disabled:opacity-60" disabled={!runId || loading}>
                    {loading ? "Working…" : "Suggest Code Changes"}
                </button>
            </div>

            {error && <div className="text-sm text-red-400 mb-3">{error}</div>}

            {!diffs && <div className="text-sm text-gray-500">No suggested changes yet.</div>}

            {diffs &&
                Object.entries(diffs).map(([path, meta]) => {
                    // split meta.changes into old/new by simple heuristic if it's a unified diff; otherwise show as side-by-side raw
                    // We'll attempt to show old/new by splitting on lines prefixed +/-
                    const lines = meta.changes.split("\n");
                    const oldLines: string[] = [];
                    const newLines: string[] = [];
                    for (const l of lines) {
                        if (l.startsWith("+")) newLines.push(l.slice(1));
                        else if (l.startsWith("-")) oldLines.push(l.slice(1));
                        else {
                            oldLines.push(l);
                            newLines.push(l);
                        }
                    }
                    return (
                        <div key={path} className="mb-6">
                            <div className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">{path}</div>
                            <div className="mt-2">
                                <DiffViewer oldValue={oldLines.join("\n")} newValue={newLines.join("\n")} splitView={true} useDarkTheme={document.documentElement.classList.contains("dark")} />
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}