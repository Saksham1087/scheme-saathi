import { Route, Routes, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { AppShell } from "@/components/layout/AppShell"
import Home from "@/pages/Home"
import CalculatorPage from "@/pages/CalculatorPage"
import PartnersPage from "@/pages/PartnersPage"
import PartnerDetail from "@/pages/PartnerDetail"
import HowItWorks from "@/pages/HowItWorks"
import TrackApplication from "@/pages/TrackApplication"
import Login from "@/pages/Login"
import Schemes from "@/pages/Schemes"
import SchemeDetail from "@/pages/SchemeDetail"
import Recommend from "@/pages/Recommend"
import Compare from "@/pages/Compare"
import Application from "@/pages/Application"
import Dashboard from "@/pages/Dashboard"
import Assistant from "@/pages/Assistant"
import AdminLayout from "@/pages/admin/AdminLayout"
import AdminSchemes from "@/pages/admin/AdminSchemes"
import AdminPartners from "@/pages/admin/AdminPartners"
import AdminAnalytics from "@/pages/admin/AdminAnalytics"

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/schemes/:slug" element={<SchemeDetail />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/find-schemes" element={<Navigate to="/recommend" replace />} />
          <Route path="/results" element={<Navigate to="/recommend" replace />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/application/:id" element={<Application />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminSchemes />} />
            <Route path="schemes" element={<AdminSchemes />} />
            <Route path="partners" element={<AdminPartners />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/partners/:id" element={<PartnerDetail />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/track" element={<TrackApplication />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
      <Toaster position="top-center" />
    </>
  )
}
