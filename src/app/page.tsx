"use client";

import React from "react";
import { SimulationProvider, useSimulation } from "../context/SimulationContext";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";
import { LiveFeedView } from "../components/feed/LiveFeedView";
import { TrajectoryView } from "../components/trajectory/TrajectoryView";
import { AnomalyView } from "../components/anomalies/AnomalyView";
import { AnalyticsView } from "../components/analytics/AnalyticsView";
import { FusionInspectorModal } from "../components/feed/FusionInspectorModal";
import { RedAlertBanner } from "../components/common/RedAlertBanner";
import { HotCacheDrawer } from "../components/cache/HotCacheDrawer";

function DashboardContent() {
  const {
    activeView,
    activeRedAlert,
    dismissRedAlert,
    isHotCacheDrawerOpen,
    setIsHotCacheDrawerOpen,
  } = useSimulation();

  return (
    <div className="flex h-screen overflow-hidden bg-[#080d1a]">
      {/* Emergency Red Alert Top Banner */}
      <RedAlertBanner alert={activeRedAlert} onDismiss={dismissRedAlert} />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Command Header */}
        <Header />

        {/* Dynamic Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {activeView === "feed" && <LiveFeedView />}
          {activeView === "trajectory" && <TrajectoryView />}
          {activeView === "anomalies" && <AnomalyView />}
          {activeView === "analytics" && <AnalyticsView />}
        </main>
      </div>

      {/* Global Modals */}
      <FusionInspectorModal />

      {/* L1 Hot Cache Drawer */}
      <HotCacheDrawer
        isOpen={isHotCacheDrawerOpen}
        onClose={() => setIsHotCacheDrawerOpen(false)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <SimulationProvider>
      <DashboardContent />
    </SimulationProvider>
  );
}
