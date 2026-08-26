import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fmtINR } from "@/lib/format"

export type CostCategory =
  | "equipment"
  | "raw_materials"
  | "rent"
  | "working_capital"
  | "other"

export interface CostItem {
  id: string
  category: CostCategory
  description: string
  amount: number
}

interface ProjectCostPlannerProps {
  items: CostItem[]
  onChange: (items: CostItem[]) => void
}

const categoryKeys: CostCategory[] = [
  "equipment",
  "raw_materials",
  "rent",
  "working_capital",
  "other",
]

let nextId = 1
function generateId(): string {
  return `item-${Date.now()}-${nextId++}`
}

function emptyItem(): CostItem {
  return { id: generateId(), category: "equipment", description: "", amount: 0 }
}

function CostItemRow({
  item,
  onUpdate,
  onRemove,
  canRemove,
  t,
}: {
  item: CostItem
  onUpdate: (updates: Partial<CostItem>) => void
  onRemove: () => void
  canRemove: boolean
  t: (key: string) => string
}) {
  return (
    <div className="grid grid-cols-[140px_1fr_120px_36px] gap-2 items-end">
      <div>
        <Label className="text-xs">{t("planner.category")}</Label>
        <Select
          value={item.category}
          onValueChange={(v) => onUpdate({ category: v as CostCategory })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categoryKeys.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {t(`planner.categories.${cat}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs">{t("planner.description")}</Label>
        <Input
          value={item.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder={t("planner.descriptionPlaceholder")}
          className="mt-1"
        />
      </div>
      <div>
        <Label className="text-xs">{t("planner.amount")}</Label>
        <Input
          type="number"
          min={0}
          value={item.amount || ""}
          onChange={(e) => onUpdate({ amount: Number(e.target.value) || 0 })}
          placeholder="₹"
          className="mt-1"
        />
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 p-0 text-destructive"
        onClick={onRemove}
        disabled={!canRemove}
        aria-label={t("planner.removeItem")}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  )
}

export function ProjectCostPlanner({ items, onChange }: ProjectCostPlannerProps) {
  const { t } = useTranslation()

  const total = items.reduce((sum, item) => sum + item.amount, 0)

  const addItem = useCallback(() => {
    onChange([...items, emptyItem()])
  }, [items, onChange])

  const updateItem = useCallback(
    (id: string, updates: Partial<CostItem>) => {
      onChange(items.map((item) => (item.id === id ? { ...item, ...updates } : item)))
    },
    [items, onChange],
  )

  const removeItem = useCallback(
    (id: string) => {
      if (items.length <= 1) return
      onChange(items.filter((item) => item.id !== id))
    },
    [items, onChange],
  )

  return (
    <Card className="border-border">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-lg">{t("planner.title")}</h3>
          <span className="text-sm text-muted-foreground">
            {items.length} {t("planner.items")}
          </span>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <CostItemRow
              key={item.id}
              item={item}
              onUpdate={(u) => updateItem(item.id, u)}
              onRemove={() => removeItem(item.id)}
              canRemove={items.length > 1}
              t={t}
            />
          ))}
        </div>

        <Button variant="outline" size="sm" onClick={addItem}>
          <Plus className="size-4 mr-1.5" />
          {t("planner.addItem")}
        </Button>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-sm font-medium">{t("planner.total")}</span>
          <span className="font-display font-bold text-xl text-primary">
            {fmtINR(total)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
