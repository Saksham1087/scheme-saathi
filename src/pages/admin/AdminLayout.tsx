import { useTranslation } from "react-i18next"
import { Link, Outlet, useLocation } from "react-router-dom"
import { BarChart3, FileText, LayoutDashboard, MapPin, Settings, Shield } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { key: "schemes", icon: FileText, href: "/admin/schemes" },
  { key: "partners", icon: MapPin, href: "/admin/partners" },
  { key: "analytics", icon: BarChart3, href: "/admin/analytics" },
  { key: "users", icon: Shield, href: "/admin/users" },
]

export default function AdminLayout() {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-foreground text-background p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8 px-2">
          <LayoutDashboard className="size-5" />
          <span className="font-display font-bold text-lg">Admin</span>
          <Badge variant="secondary" className="ml-auto text-[10px]">
            {t("admin.roleBadge")}
          </Badge>
        </div>
        <nav className="space-y-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.key}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-background/10 text-background"
                    : "text-background/60 hover:bg-background/5 hover:text-background",
                )}
              >
                <item.icon className="size-4" />
                {t(`admin.nav.${item.key}`)}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-background/20 pt-4 mt-4">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-background/60 hover:bg-background/5 hover:text-background"
          >
            <Settings className="size-4" />
            {t("admin.backToApp")}
          </Link>
        </div>
      </aside>
      <main className="flex-1 bg-muted/30">
        <Outlet />
      </main>
    </div>
  )
}
