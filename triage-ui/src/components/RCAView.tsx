import React, { useEffect, useState } from "react";

type Props = {
    runId: string;
};

export default function RCAView({ runId }: Props) {
    const [rca, setRca] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setRca(null);
        if (!runId) return;
        let mounted = true;

        async function load() {
            setLoading(true);
            try {
                const res = await fetch(`/api/rca/${runId}`);
                if (!res.ok) {
                    const t = await res.text().catch(() => "");
                    setRca(`Error: ${t || res.status}`);
                    return;
                }
                const json = await res.json();
                if (mounted) setRca(json.rca || "(no RCA returned)");
            } catch (err: any) {
                if (mounted) setRca(err?.message || "Network error");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, [runId]);

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
            <h3 className="text-md font-semibold mb-3">Root Cause Analysis</h3>
            {loading && <div className="text-sm text-gray-500">Loading RCA…</div>}
            {!loading && <pre className="text-sm whitespace-pre-wrap">{rca || "RCA will appear here once ready."}</pre>}
        </div>
    );
}