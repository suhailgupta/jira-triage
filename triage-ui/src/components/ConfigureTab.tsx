import React, { useState } from "react";
import { Check, Save, Eye, EyeOff } from "lucide-react";

type SaveStatus = null | "saving" | "saved" | "error";

export default function ConfigureTab() {
    const [username, setUsername] = useState<string>("");
    const [apiKey, setApiKey] = useState<string>("");
    const [showKey, setShowKey] = useState<boolean>(false);
    const [status, setStatus] = useState<SaveStatus>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleSave() {
        setErrorMessage(null);

        if (!username.trim() || !apiKey.trim()) {
            setErrorMessage("Username and API Key are required.");
            setStatus("error");
            return;
        }

        try {
            setStatus("saving");
            const res = await fetch("/api/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username.trim(), apiKey: apiKey.trim() }),
            });

            if (!res.ok) {
                const text = await res.text().catch(() => "");
                setErrorMessage(text || `Server returned ${res.status}`);
                setStatus("error");
                return;
            }

            setStatus("saved");
            // small visual confirmation
            setTimeout(() => setStatus(null), 2000);
        } catch (err: any) {
            setErrorMessage(err?.message || "Network error");
            setStatus("error");
        }
    }

    function renderStatus() {
        if (status === "saving") {
            return <span className="text-sm text-gray-500">Saving…</span>;
        }
        if (status === "saved") {
            return (
                <span className="flex items-center gap-2 text-sm text-green-500">
          <Check size={14} /> Saved
        </span>
            );
        }
        if (status === "error") {
            return <span className="text-sm text-red-400">{errorMessage}</span>;
        }
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold">⚙ Jira Configuration</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Configure credentials used by the backend to call Jira APIs. Keys are stored server-side only.
                    </p>
                </div>
                <div>{renderStatus()}</div>
            </div>

            <div className="mt-4 space-y-4">
                <label className="block">
                    <div className="text-sm font-medium mb-1">Jira Username</div>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="your@company.com"
                        className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        aria-label="Jira Username"
                    />
                </label>

                <label className="block">
                    <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">Jira API Key</div>
                        <div className="text-xs text-gray-400">(kept on the server)</div>
                    </div>

                    <div className="relative">
                        <input
                            type={showKey ? "text" : "password"}
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="••••••••••••"
                            className="w-full rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 pr-10"
                            aria-label="Jira API Key"
                        />
                        <button
                            type="button"
                            onClick={() => setShowKey((s) => !s)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label={showKey ? "Hide API key" : "Show API key"}
                        >
                            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </label>

                {errorMessage && status === "error" && (
                    <div className="text-sm text-red-400">{errorMessage}</div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={status === "saving"}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white hover:opacity-95 disabled:opacity-60 transition"
                    >
                        <Save size={16} />
                        Save
                    </button>

                    <button
                        onClick={() => {
                            setUsername("");
                            setApiKey("");
                            setErrorMessage(null);
                            setStatus(null);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                    >
                        Reset
                    </button>
                </div>

                <div className="text-xs text-gray-400">
                    Note: Never store API keys in client-side code. This UI sends them to the backend which should store them securely.
                </div>
            </div>
        </div>
    );
}