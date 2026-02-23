import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";
import ConfigureTab from "./components/ConfigureTab";
import JiraAnalysisTab from "./components/JiraAnalysisTab";
import EventStream from "./components/EventStream";
import RCAView from "./components/RCAView";
import SuggestCodeChanges from "./components/SuggestCodeChanges";

export default function App() {
    const [runId, setRunId] = useState<string | null>(null);

    return (
        <ThemeProvider>
            <div className="min-h-screen">
                <Header />
                <div className="max-w-7xl mx-auto p-6 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <ConfigureTab />
                        <JiraAnalysisTab onRunId={(id) => { setRunId(id); }} />
                    </div>

                    {runId && (
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <EventStream runId={runId} />
                            </div>
                            <div className="space-y-6">
                                <RCAView runId={runId} />
                                <SuggestCodeChanges runId={runId} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ThemeProvider>
    );
}