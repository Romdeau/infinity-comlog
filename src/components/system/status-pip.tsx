import * as React from "react"
import {
  CheckCircle2Icon,
  CircleDotIcon,
  CircleIcon,
  TriangleAlertIcon,
  OctagonAlertIcon,
  InfoIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export type StatusKind =
  | "complete"
  | "active"
  | "pending"
  | "warning"
  | "danger"
  | "info"

interface StatusConfig {
  token: string
  Icon: React.ComponentType<{ className?: string }>
  label: string
}

const STATUS_CONFIG: Record<StatusKind, StatusConfig> = {
  complete: { token: "text-status-complete", Icon: CheckCircle2Icon, label: "Complete" },
  active: { token: "text-status-active", Icon: CircleDotIcon, label: "Active" },
  pending: { token: "text-status-pending", Icon: CircleIcon, label: "Pending" },
  warning: { token: "text-status-warning", Icon: TriangleAlertIcon, label: "Warning" },
  danger: { token: "text-status-danger", Icon: OctagonAlertIcon, label: "Danger" },
  info: { token: "text-status-info", Icon: InfoIcon, label: "Info" },
}

export interface StatusPipProps {
  status: StatusKind
  /** Optional visible label; falls back to the status' default. */
  label?: string
  /** Hide the text label (icon-only); label is still exposed via aria-label. */
  iconOnly?: boolean
  className?: string
}

/**
 * Single source of truth for status color + icon + label. Never conveys
 * meaning through color alone: always pairs a token color with an icon and an
 * accessible label.
 */
export function StatusPip({ status, label, iconOnly, className }: StatusPipProps) {
  const { token, Icon, label: defaultLabel } = STATUS_CONFIG[status]
  const text = label ?? defaultLabel

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        token,
        className
      )}
      aria-label={iconOnly ? text : undefined}
      role={iconOnly ? "img" : undefined}
    >
      <Icon className="size-3.5 shrink-0" />
      {!iconOnly && <span>{text}</span>}
    </span>
  )
}
