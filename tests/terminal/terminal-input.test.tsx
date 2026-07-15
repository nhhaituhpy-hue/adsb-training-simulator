import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { TerminalInput } from "@/components/terminal/terminal-input";

describe("TerminalInput", () => {
  it("masks login and sensitive maintenance values", () => {
    const { rerender } = render(
      <TerminalInput
        pendingPrompt="password"
        pendingSensitive={false}
        disabled={false}
        onSubmit={() => undefined}
      />,
    );

    expect(screen.getByLabelText("Nhập mật khẩu mô phỏng")).toHaveAttribute(
      "type",
      "password",
    );

    rerender(
      <TerminalInput
        pendingPrompt="input"
        pendingSensitive
        disabled={false}
        onSubmit={() => undefined}
      />,
    );

    expect(screen.getByLabelText("Nhập mật khẩu mô phỏng")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("allows an empty Enter action for RETURN", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <TerminalInput
        pendingPrompt="display"
        pendingSensitive={false}
        disabled={false}
        onSubmit={onSubmit}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Gửi lệnh" }));
    expect(onSubmit).toHaveBeenCalledWith("");
  });
});
