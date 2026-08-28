import { Route, Routes } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { AppShell } from "@/components/layout/AppShell"
import Home from "@/pages/Home"
import SchemesCatalog from "@/pages/SchemesCatalog"
import SchemeDetailsPage from "@/pages/SchemeDetailsPage"
import ComparePage from "@/pages/ComparePage"
import IntakeWizard from "@/pages/IntakeWizard"
import Results from "@/pages/Results"
import CalculatorPage from "@/pages/CalculatorPage"
import PlannerPage from "@/pages/PlannerPage"
import PartnersPage from "@/pages/PartnersPage"
import HowItWorks from "@/pages/HowItWorks"
import TrackApplication from "@/pages/TrackApplication"
import DocumentsPage from "@/pages/DocumentsPage"
import AssistantPage from "@/pages/AssistantPage"
import Login from "@/pages/Login"

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/schemes" element={<SchemesCatalog />} />
          <Route path="/schemes/:id" element={<SchemeDetailsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/find-schemes" element={<IntakeWizard />} />
          <Route path="/recommend" element={<IntakeWizard />} />
          <Route path="/results" element={<Results />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/track" element={<TrackApplication />} />
          <Route path="/application/:id" element={<TrackApplication />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </>
  )
}
