export function StudentDashboardLoading() {
  return (
    <section
      aria-label="Đang tải danh sách bài thực hành"
      aria-busy="true"
      className="mx-auto w-full max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="h-8 w-56 animate-pulse rounded bg-[var(--surface-muted)] motion-reduce:animate-none" />
      <div className="mt-3 h-5 w-full max-w-xl animate-pulse rounded bg-[var(--surface-muted)] motion-reduce:animate-none" />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-60 animate-pulse rounded-lg border border-[var(--border)] bg-white motion-reduce:animate-none"
          />
        ))}
      </div>
      <span className="sr-only">Đang tải dữ liệu bài thực hành.</span>
    </section>
  );
}

export function ScenarioMonitorLoading() {
  return (
    <section
      aria-label="Đang tải màn hình QCMS"
      aria-busy="true"
      className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="h-9 w-48 animate-pulse rounded bg-[var(--surface-muted)] motion-reduce:animate-none" />
        <div className="h-9 w-24 animate-pulse rounded bg-[var(--surface-muted)] motion-reduce:animate-none" />
      </div>
      <div className="mt-6 h-[34rem] animate-pulse rounded-lg border border-[var(--border)] bg-white motion-reduce:animate-none" />
      <span className="sr-only">Đang tải dữ liệu QCMS.</span>
    </section>
  );
}

