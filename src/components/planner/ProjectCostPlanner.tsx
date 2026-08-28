import { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Wrench,
  Boxes,
  Store,
  Coins,
  GraduationCap,
  ShieldAlert,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  Sparkles,
  Check,
  X,
  FileSpreadsheet,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fmtINR } from "@/lib/format"
import {
  BUDGET_CATEGORIES,
  BUSINESS_PRESETS,
  calculateCategoryTotals,
} from "@/lib/plannerPresets"
import { usePlannerStore } from "@/stores/plannerStore"
import type { BudgetCategoryKey, ProjectBudgetItem } from "@/types/planner"

const categoryIconMap: Record<BudgetCategoryKey, React.ComponentType<{ className?: string }>> = {
  equipment: Wrench,
  rawMaterials: Boxes,
  rent: Store,
  workingCapital: Coins,
  licenses: GraduationCap,
  contingency: ShieldAlert,
}

const categoryBadgeColorMap: Record<BudgetCategoryKey, string> = {
  equipment: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
  rawMaterials: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
  rent: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  workingCapital: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
  licenses: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20",
  contingency: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
}

export function ProjectCostPlanner() {
  const { t, i18n } = useTranslation()
  const isHindi = i18n.language?.startsWith("hi")
  const {
    items,
    activePresetId,
    projectTitle,
    addItem,
    updateItem,
    removeItem,
    loadPreset,
    resetToDefault,
    clearAll,
  } = usePlannerStore()

  // New item draft state
  const [newCategory, setNewCategory] = useState<BudgetCategoryKey>("equipment")
  const [newName, setNewName] = useState("")
  const [newAmount, setNewAmount] = useState("")
  const [formError, setFormError] = useState<string | null>(null)

  // Inline edit state
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editCategory, setEditCategory] = useState<BudgetCategoryKey>("equipment")
  const [editName, setEditName] = useState("")
  const [editAmount, setEditAmount] = useState("")

  const categoryTotals = calculateCategoryTotals(items)
  const totalCost = items.reduce((sum, item) => sum + Math.max(0, item.amount || 0), 0)

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) {
      setFormError(t("planner.errors.nameRequired", "Please provide a title for the expense."))
      return
    }
    const parsedAmount = Number(newAmount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError(t("planner.errors.amountRequired", "Please enter a valid expense amount greater than ₹0."))
      return
    }

    addItem({
      category: newCategory,
      name: newName.trim(),
      amount: parsedAmount,
    })

    setNewName("")
    setNewAmount("")
    setFormError(null)
  }

  const startEdit = (item: ProjectBudgetItem) => {
    setEditingItemId(item.id)
    setEditCategory(item.category)
    setEditName(item.name)
    setEditAmount(item.amount.toString())
  }

  const saveEdit = (id: string) => {
    const parsedAmount = Number(editAmount)
    if (!editName.trim() || isNaN(parsedAmount) || parsedAmount <= 0) return

    updateItem(id, {
      category: editCategory,
      name: editName.trim(),
      amount: parsedAmount,
    })
    setEditingItemId(null)
  }

  const cancelEdit = () => {
    setEditingItemId(null)
  }

  return (
    <div className="space-y-6">
      {/* Preset Templates Selector Bar */}
      <Card className="border-border shadow-xs bg-card">
        <CardHeader className="pb-3 border-b border-border/70">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <CardTitle className="text-sm sm:text-base font-semibold">
                {t("planner.presetsTitle", "One-Click Enterprise Starter Templates")}
              </CardTitle>
            </div>
            <span className="text-xs text-muted-foreground">
              {t("planner.presetsHelper", "Load authentic budget models tailored for Indian schemes")}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {BUSINESS_PRESETS.map((preset) => {
              const isSelected = activePresetId === preset.id
              const presetName = isHindi ? preset.defaultName.hi : preset.defaultName.en
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => loadPreset(preset, i18n.language)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-muted/40 hover:bg-muted text-foreground border-border"
                  }`}
                  aria-pressed={isSelected}
                >
                  <span>{presetName}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] px-1.5 py-0 ${
                      isSelected
                        ? "border-primary-foreground/30 bg-primary-foreground/20 text-white"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {preset.categoryTag}
                  </Badge>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Budget Items Builder Card */}
      <Card className="border-border shadow-xs bg-card">
        <CardHeader className="pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="size-5 text-primary" />
              <CardTitle className="text-base sm:text-lg font-semibold">
                {projectTitle}
              </CardTitle>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("planner.itemizedSubtext", "Itemize equipment, stock, lease, and working capital below.")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefault}
              className="text-xs min-h-[38px] cursor-pointer"
              title={t("planner.resetTitle", "Reset to standard template")}
            >
              <RotateCcw className="size-3.5 mr-1.5 text-muted-foreground" />
              {t("planner.reset", "Reset Template")}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs min-h-[38px] text-muted-foreground hover:text-destructive cursor-pointer"
              title={t("planner.clearAll", "Clear all items")}
            >
              {t("planner.clear", "Clear All")}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-6">
          {/* Add New Line Item Form */}
          <form
            onSubmit={handleAddItem}
            className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Plus className="size-3.5" />
                {t("planner.addNewItem", "Add Budget Expense Line Item")}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {t("planner.nonNegative", "All values in ₹ INR")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              {/* Category Select */}
              <div className="sm:col-span-4 space-y-1.5">
                <Label htmlFor="category-select" className="text-xs font-semibold">
                  {t("planner.categoryLabel", "Expense Category")}
                </Label>
                <Select
                  value={newCategory}
                  onValueChange={(val) => setNewCategory(val as BudgetCategoryKey)}
                >
                  <SelectTrigger id="category-select" className="h-10 text-xs bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_CATEGORIES.map((cat) => {
                      const Icon = categoryIconMap[cat.key]
                      const catName = isHindi ? cat.defaultName.hi : cat.defaultName.en
                      return (
                        <SelectItem key={cat.key} value={cat.key} className="text-xs">
                          <div className="flex items-center gap-2">
                            <Icon className="size-3.5 text-muted-foreground" />
                            <span>{catName}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Title / Description */}
              <div className="sm:col-span-5 space-y-1.5">
                <Label htmlFor="item-title" className="text-xs font-semibold">
                  {t("planner.itemTitleLabel", "Item Description / Asset Name")}
                </Label>
                <Input
                  id="item-title"
                  type="text"
                  placeholder={t(
                    "planner.itemPlaceholder",
                    "e.g. Industrial Sewing Machine or FMCG Stock",
                  )}
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value)
                    if (formError) setFormError(null)
                  }}
                  className="h-10 text-xs bg-background"
                />
              </div>

              {/* Amount */}
              <div className="sm:col-span-3 space-y-1.5">
                <Label htmlFor="item-amount" className="text-xs font-semibold">
                  {t("planner.amountLabel", "Estimated Cost (₹)")}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="item-amount"
                    type="number"
                    min="1"
                    placeholder="₹ 50,000"
                    value={newAmount}
                    onChange={(e) => {
                      setNewAmount(e.target.value)
                      if (formError) setFormError(null)
                    }}
                    className="h-10 text-xs bg-background tabular-nums"
                  />
                  <Button
                    type="submit"
                    className="h-10 px-4 shrink-0 font-semibold text-xs cursor-pointer"
                  >
                    <Plus className="size-4 mr-1" />
                    {t("planner.addBtn", "Add")}
                  </Button>
                </div>
              </div>
            </div>

            {formError && (
              <div className="flex items-center gap-1.5 text-xs text-destructive font-medium animate-in fade-in">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}
          </form>

          {/* Itemized List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <span>{t("planner.itemizedHeader", "Itemized Budget Items ({{count}})", { count: items.length })}</span>
              <span>{t("planner.totalExpenses", "Total: {{total}}", { total: fmtINR(totalCost) })}</span>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-10 px-4 border border-dashed border-border rounded-xl bg-muted/20 space-y-3">
                <FileSpreadsheet className="size-8 text-muted-foreground mx-auto" />
                <p className="text-sm font-semibold text-foreground">
                  {t("planner.noItemsTitle", "No line items added yet")}
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {t(
                    "planner.noItemsDesc",
                    "Add custom expense items above or click any starter template to pre-populate verified business estimates.",
                  )}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetToDefault}
                  className="mt-2 text-xs"
                >
                  <Sparkles className="size-3.5 mr-1.5 text-primary" />
                  {t("planner.loadStarterPreset", "Load Starter Kirana Template")}
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-background shadow-xs">
                {items.map((item, index) => {
                  const isEditing = editingItemId === item.id
                  const Icon = categoryIconMap[item.category] || Wrench
                  const categoryMeta = BUDGET_CATEGORIES.find((c) => c.key === item.category)
                  const categoryLabel = categoryMeta
                    ? isHindi
                      ? categoryMeta.defaultName.hi
                      : categoryMeta.defaultName.en
                    : item.category

                  if (isEditing) {
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 bg-muted/40 space-y-3 animate-in fade-in"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                          <div className="sm:col-span-4">
                            <Select
                              value={editCategory}
                              onValueChange={(val) => setEditCategory(val as BudgetCategoryKey)}
                            >
                              <SelectTrigger className="h-9 text-xs bg-background">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {BUDGET_CATEGORIES.map((cat) => {
                                  const CatIcon = categoryIconMap[cat.key]
                                  const cName = isHindi ? cat.defaultName.hi : cat.defaultName.en
                                  return (
                                    <SelectItem key={cat.key} value={cat.key} className="text-xs">
                                      <div className="flex items-center gap-2">
                                        <CatIcon className="size-3.5 text-muted-foreground" />
                                        <span>{cName}</span>
                                      </div>
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="sm:col-span-5">
                            <Input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="h-9 text-xs bg-background"
                            />
                          </div>

                          <div className="sm:col-span-3 flex gap-2">
                            <Input
                              type="number"
                              min="1"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              className="h-9 text-xs bg-background tabular-nums"
                            />
                            <Button
                              size="sm"
                              onClick={() => saveEdit(item.id)}
                              className="h-9 px-2.5 shrink-0"
                            >
                              <Check className="size-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelEdit}
                              className="h-9 px-2.5 shrink-0 text-muted-foreground"
                            >
                              <X className="size-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={item.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="text-xs text-muted-foreground font-mono mt-0.5 w-5 shrink-0">
                          #{index + 1}
                        </span>
                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-[11px] px-2 py-0.5 border ${categoryBadgeColorMap[item.category] || "border-border"}`}
                            >
                              <Icon className="size-3 mr-1 shrink-0" />
                              {categoryLabel}
                            </Badge>
                            <span className="font-semibold text-xs sm:text-sm text-foreground break-words">
                              {item.name}
                            </span>
                          </div>
                          {item.notes && (
                            <p className="text-[11px] text-muted-foreground line-clamp-1">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-8 sm:pl-0">
                        <span className="font-display font-bold text-sm sm:text-base text-foreground tabular-nums">
                          {fmtINR(item.amount)}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="p-1.5 text-muted-foreground hover:text-foreground rounded-md transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
                            aria-label={t("planner.editItem", "Edit item {{name}}", { name: item.name })}
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive rounded-md transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center cursor-pointer"
                            aria-label={t("planner.removeItem", "Delete item {{name}}", { name: item.name })}
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* 6 Category Summary Tiles */}
          <div className="space-y-2 pt-2 border-t border-border">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
              {t("planner.categoryBreakdownTitle", "Category Cost Allocation")}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {BUDGET_CATEGORIES.map((cat) => {
                const amount = categoryTotals[cat.key] || 0
                const pct = totalCost > 0 ? Math.round((amount / totalCost) * 100) : 0
                const Icon = categoryIconMap[cat.key]
                const catName = isHindi ? cat.defaultName.hi : cat.defaultName.en

                return (
                  <div
                    key={cat.key}
                    className="p-2.5 rounded-lg border border-border bg-card/60 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-1 text-[11px] font-medium text-muted-foreground">
                      <div className="flex items-center gap-1 truncate">
                        <Icon className="size-3 shrink-0" />
                        <span className="truncate">{catName}</span>
                      </div>
                      <span className="tabular-nums font-semibold shrink-0">{pct}%</span>
                    </div>
                    <div className="font-display font-bold text-xs sm:text-sm text-foreground tabular-nums">
                      {fmtINR(amount)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
