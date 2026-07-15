import { Crosshair, Eye, EyeSlash, Monitor } from "@phosphor-icons/react";
import type { SensorState, SiteState } from "@/lib/types";
import { SENSOR_STATUS_DETAILS } from "./qcms-utils";
import { StatusBadge } from "./status-badge";

type SiteItemProps = {
  site: SiteState;
  visualizedSensorIds: ReadonlySet<string>;
  visualizationLimitReached: boolean;
  rangeRingEnabled: boolean;
  onToggleVisualization: (site: SiteState, sensor: SensorState) => void;
  onToggleRangeRing: (site: SiteState) => void;
  onOpenSensor: (sensor: SensorState, trigger: HTMLButtonElement) => void;
};

type SensorPanelProps = {
  site: SiteState;
  label: "A" | "B";
  sensor: SensorState | null;
  isVisualized: boolean;
  visualizationLimitReached: boolean;
  onToggleVisualization: SiteItemProps["onToggleVisualization"];
  onOpenSensor: SiteItemProps["onOpenSensor"];
};

function SensorPanel({
  site,
  label,
  sensor,
  isVisualized,
  visualizationLimitReached,
  onToggleVisualization,
  onOpenSensor,
}: SensorPanelProps) {
  if (!sensor) {
    return (
      <div className="rounded border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-4 text-center">
        <p className="text-sm font-semibold text-[#475569]">Sensor {label}</p>
        <p className="mt-2 text-xs text-[#64748b]">Không cấu hình</p>
      </div>
    );
  }

  const toggleDisabled = visualizationLimitReached && !isVisualized;
  const statusLabel = SENSOR_STATUS_DETAILS[sensor.status].label;

  return (
    <div className="min-w-0 rounded border border-[#cbd5e1] bg-white p-4 shadow-[0_1px_2px_rgb(15_23_42/0.04)]">
      <button
        type="button"
        onClick={(event) => onOpenSensor(sensor, event.currentTarget)}
        className="group w-full rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
        aria-label={`Mở giám sát Sensor ${label} tại ${site.name}, trạng thái ${statusLabel}`}
      >
        <span className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-[#172033]">
            <Monitor aria-hidden size={18} weight="regular" />
            Sensor {label}
          </span>
          <span className="text-xs font-semibold text-[var(--accent)] group-hover:underline">
            Terminal
          </span>
        </span>
        <span className="mt-2 block">
          <StatusBadge status={sensor.status} compact={false} />
        </span>
      </button>

      <button
        type="button"
        onClick={() => onToggleVisualization(site, sensor)}
        disabled={toggleDisabled}
        aria-pressed={isVisualized}
        aria-label={`${isVisualized ? "Dừng hiển thị" : "Hiển thị"} Sensor ${label} tại ${site.name}`}
        title={
          toggleDisabled
            ? "Đã đạt giới hạn 4 cảm biến đang hiển thị"
            : undefined
        }
        className={`mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded border px-2 text-sm font-semibold transition-[background-color,border-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none ${
          isVisualized
            ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent-active)]"
            : "border-[#cbd5e1] bg-white text-[#334155] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        }`}
      >
        {isVisualized ? (
          <Eye aria-hidden size={16} weight="fill" />
        ) : (
          <EyeSlash aria-hidden size={16} weight="regular" />
        )}
        {label === "A" ? "VA" : "VB"}
      </button>
    </div>
  );
}

export function SiteItem({
  site,
  visualizedSensorIds,
  visualizationLimitReached,
  rangeRingEnabled,
  onToggleVisualization,
  onToggleRangeRing,
  onOpenSensor,
}: SiteItemProps) {
  const sensorAVisualized = Boolean(
    site.sensorA && visualizedSensorIds.has(site.sensorA.id),
  );
  const sensorBVisualized = Boolean(
    site.sensorB && visualizedSensorIds.has(site.sensorB.id),
  );
  const hasVisualizedSensor = sensorAVisualized || sensorBVisualized;
  const configuredSensorCount =
    Number(site.sensorA !== null) + Number(site.sensorB !== null);

  return (
    <article className="min-w-0 rounded-lg border border-[#b8c4ce] bg-[#eef3f6] p-4 shadow-[0_2px_6px_rgb(15_23_42/0.08)]">
      <div className="flex items-center justify-between gap-3 border-b border-[#cbd5e1] pb-3">
        <h3 className="truncate text-base font-bold text-[#172033]" title={site.name}>
          {site.name}
        </h3>
        <span className="font-mono text-xs tabular-nums text-[#475569]">
          {Number(sensorAVisualized) + Number(sensorBVisualized)}/{configuredSensorCount} hiển thị
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <SensorPanel
          site={site}
          label="A"
          sensor={site.sensorA}
          isVisualized={sensorAVisualized}
          visualizationLimitReached={visualizationLimitReached}
          onToggleVisualization={onToggleVisualization}
          onOpenSensor={onOpenSensor}
        />
        <SensorPanel
          site={site}
          label="B"
          sensor={site.sensorB}
          isVisualized={sensorBVisualized}
          visualizationLimitReached={visualizationLimitReached}
          onToggleVisualization={onToggleVisualization}
          onOpenSensor={onOpenSensor}
        />
      </div>

      <button
        type="button"
        onClick={() => onToggleRangeRing(site)}
        disabled={!hasVisualizedSensor}
        aria-pressed={rangeRingEnabled}
        aria-label={`${rangeRingEnabled ? "Tắt" : "Bật"} vòng cự ly cho ${site.name}`}
        className={`mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded border px-3 text-sm font-semibold transition-[background-color,border-color,color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-[#d4d4d8] disabled:bg-[#f4f4f5] disabled:text-[#71717a] motion-reduce:transition-none ${
          rangeRingEnabled
            ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent-active)]"
            : "border-[#cbd5e1] bg-white text-[#334155] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        }`}
      >
        <Crosshair aria-hidden size={16} weight={rangeRingEnabled ? "bold" : "regular"} />
        RR
      </button>
    </article>
  );
}
