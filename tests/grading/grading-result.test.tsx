import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GradingResult } from "@/components/grading/grading-result";
import type { GradingResult as GradingResultData } from "@/lib/types";

describe("GradingResult", () => {
  it("explains why a 100 percent score can still fail", () => {
    const result: GradingResultData = {
      passed: false,
      score: 100,
      correctSteps: 1,
      totalExpected: 1,
      totalSubmitted: 2,
      steps: [],
    };

    render(<GradingResult result={result} onRetry={() => undefined} />);

    expect(screen.getByText("Chưa đạt yêu cầu")).toBeInTheDocument();
    expect(
      screen.getByText(/còn thao tác thừa, vì vậy bài chưa đạt/i),
    ).toBeInTheDocument();
  });
});
