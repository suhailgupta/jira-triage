import React, { useState } from "react";

type Props = {
    onRunId: (runId: string) => void;
};

export default function JiraAnalysisTab({ onRunId }: Props) {
    const [jiraId, setJiraId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleAnalyze() {
        setError(null);
        if (!jiraId.trim()) {
            setError("Please enter a Jira ID.");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ jiraId: jiraId.trim() }),
            });
            if (!res.ok) {
                const text = await res.text().catch(() => "");
                setError(text || `Server returned ${res.status}`);
                setLoading(false);
                return;
            }
            const json = await res.json();
            if (!json.runId) {
                setError("Server did not return runId");
                setLoading(false);
                return;
            }
            onRunId(json.runId);
        } catch (err: any) {
            setError(err?.message || "Network error");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold">🔎 Jira Analysis</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Enter the Jira ID to start analysis. The backend will return a runId.
            </p>

            <div className="mt-4">
                <input
                    value={jiraId}
                    onChange={(e) => setJiraId(e.target.value)}
                    placeholder="PROJECT-123"
                    className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none"
                    aria-label="Jira ID"
                />
            </div>

            {error && <div className="mt-2 text-sm text-red-400">{error}</div>}

            <div className="mt-4 flex gap-3">
                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:opacity-95 disabled:opacity-60 transition"
                >
                    {loading ? "Analyzing..." : "Analyze"}
                </button>

                <button
                    onClick={() => {
                        setJiraId("");
                        setError(null);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}