"use client";

import Link from "next/link";
import {
  ArrowRight,
  FolderOpen,
  MapPin,
  Monitor,
  Warning,
} from "@phosphor-icons/react";
import { useEffect } from "react";
import type { Scenario } from "@/lib/types";
import { useScenarioStore } from "@/stores/scenario-store";
import {
  countScenarioSensors,
  DIFFICULTY_DETAILS,
} from "./qcms-utils";
import { StudentDashboardLoading } from "./student-loading";

function ScenarioCard({ scenario }: { scenario: Scenario }) {
  const difficulty = DIFFICULTY_DETAILS[scenario.difficulty];
  const sensorCount = countScenarioSensors(scenario.sites);

  return (
    <Link
      href={`/student/simulation?id=${encodeURIComponent(scenario.id)}`}
      className="group flex min-h-60 flex-col rounded-lg border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-card)] transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] motion-reduce:transform-none motion-reduce:transition-none"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex rounded border px-2.5 py-1 text-xs font-semibold ${difficulty.className}`}
        >
          {difficulty.label}
        </span>
      </div>

      <h2 className="mt-5 text-lg font-bold leading-6 tracking-tight text-[var(--text-primary)]">
        {scenario.title}
      </h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--text-secondary)]">
        {scenario.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-[var(--text-secondary)]">
        <span className="inline-flex items-center gap-1.5">
          <MapPin aria-hidden size={15} weight="regular" />
          {scenario.sites.length} site
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Monitor aria-hidden size={15} weight="regular" />
          {sensorCount} cảm biến
        </span>
      </div>

      <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-semibold text-[var(--accent)]">
        Mở bài thực hành
        <ArrowRight
          aria-hidden
          size={17}
          weight="regular"
          className="transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none"
        />
      </span>
    </Link>
  );
}

export function StudentDashboard() {
  const { scenarios, isHydrated, storageError, hydrate } = useScenarioStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return <StudentDashboardLoading />;
  }

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">
          Bài thực hành ADS-B
        </h1>
        <p className="mt-3 max-w-[65ch] text-sm leading-6 text-[var(--text-secondary)] sm:text-base sm:leading-7">
          Chọn một kịch bản để quan sát trạng thái QCMS và thực hiện quy trình xử lý sự cố.
        </p>
      </div>

      {storageError ? (
        <div
          role="status"
          className="mt-6 flex items-start gap-3 rounded border border-[#f59e0b] bg-[#fffbeb] p-4 text-[#78350f]"
        >
          <Warning aria-hidden className="mt-0.5 shrink-0" size={19} weight="fill" />
          <div>
            <p className="text-sm font-semibold">Không thể đọc dữ liệu đã lưu</p>
            <p className="mt-1 text-xs leading-5">
              Hệ thống đang dùng bộ kịch bản mẫu để bạn có thể tiếp tục.
            </p>
          </div>
        </div>
      ) : null}

      {scenarios.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-[var(--border-strong)] bg-white px-5 py-14 text-center">
          <FolderOpen
            aria-hidden
            size={34}
            weight="regular"
            className="mx-auto text-[var(--text-muted)]"
          />
          <h2 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
            Chưa có bài thực hành
          </h2>
          <p className="mx-auto mt-2 max-w-[52ch] text-sm leading-6 text-[var(--text-secondary)]">
            Quản trị viên cần tạo ít nhất một kịch bản trước khi học viên bắt đầu.
          </p>
          <Link
            href="/admin/create"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded bg-[var(--accent)] px-4 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
          >
            Tạo kịch bản
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {scenarios.map((scenario) => (
            <ScenarioCard key={scenario.id} scenario={scenario} />
          ))}
        </div>
      )}
    </section>
  );
}
