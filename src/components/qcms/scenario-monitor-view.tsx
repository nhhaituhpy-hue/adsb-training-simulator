"use client";

import Link from "next/link";
import { ArrowLeft, Warning, WarningCircle } from "@phosphor-icons/react";
import { useEffect } from "react";
import { useScenarioStore } from "@/stores/scenario-store";
import { DIFFICULTY_DETAILS } from "./qcms-utils";
import { ElapsedTimer } from "./elapsed-timer";
import { ScenarioMonitorLoading } from "./student-loading";
import { SiteMonitor } from "./site-monitor";

type ScenarioMonitorViewProps = {
  scenarioId: string;
};

export function ScenarioMonitorView({ scenarioId }: ScenarioMonitorViewProps) {
  const {
    isHydrated,
    storageError,
    hydrate,
    getScenarioById,
  } = useScenarioStore();
  const scenario = getScenarioById(scenarioId);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return <ScenarioMonitorLoading />;
  }

  if (!scenario) {
    return (
      <section className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-2xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
        <WarningCircle
          aria-hidden
          size={38}
          weight="regular"
          className="text-[var(--text-muted)]"
        />
        <h1 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">
          Không tìm thấy bài thực hành
        </h1>
        <p className="mt-2 max-w-[52ch] text-sm leading-6 text-[var(--text-secondary)]">
          Kịch bản có thể đã bị xóa hoặc đường dẫn không còn hợp lệ.
        </p>
        <Link
          href="/student"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded bg-[var(--accent)] px-4 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
        >
          <ArrowLeft aria-hidden size={17} weight="regular" />
          Về danh sách bài
        </Link>
      </section>
    );
  }

  const difficulty = DIFFICULTY_DETAILS[scenario.difficulty];

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-[var(--border)] pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <Link
            href="/student"
            className="inline-flex min-h-9 items-center gap-2 rounded px-1 text-sm font-semibold text-[var(--accent)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
          >
            <ArrowLeft aria-hidden size={17} weight="regular" />
            Danh sách bài thực hành
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
              {scenario.title}
            </h1>
            <span
              className={`inline-flex rounded border px-2.5 py-1 text-xs font-semibold ${difficulty.className}`}
            >
              {difficulty.label}
            </span>
          </div>
          <p className="mt-2 max-w-[75ch] text-sm leading-6 text-[var(--text-secondary)]">
            {scenario.description}
          </p>
        </div>
        <ElapsedTimer />
      </header>

      {storageError ? (
        <div
          role="status"
          className="mt-5 flex items-start gap-3 rounded border border-[#f59e0b] bg-[#fffbeb] p-3 text-[#78350f]"
        >
          <Warning aria-hidden className="mt-0.5 shrink-0" size={18} weight="fill" />
          <p className="text-sm leading-5">
            Dữ liệu lưu cục bộ có lỗi. Màn hình đang dùng kịch bản mẫu.
          </p>
        </div>
      ) : null}

      <div className="mt-6">
        <SiteMonitor scenario={scenario} />
      </div>
    </section>
  );
}
