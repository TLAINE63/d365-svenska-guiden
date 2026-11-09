import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BudgetNumberInput } from "../BudgetNumberInput";

function Field({ initial = 0, max }: { initial?: number; max?: number }) {
  const [value, setValue] = useState(initial);
  return <><BudgetNumberInput aria-label="Budget" value={value} max={max} onValueChange={setValue} /><output>{value}</output></>;
}

describe("BudgetNumberInput editing", () => {
  it("replaces the full existing amount on focus", () => {
    render(<Field initial={200000} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value.replace(/\s/g, " ")).toBe("200 000");
    fireEvent.focus(input);
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(6);
  });
  it("removes leading zeroes and commits six rather than 06", () => {
    render(<Field />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "06" } });
    expect(input).toHaveValue("6");
    expect(screen.getByRole("status")).toHaveTextContent("6");
  });
  it("accepts Swedish decimal months without dropping the decimal separator", () => {
    render(<Field initial={3} />);
    const input = screen.getByRole("textbox");
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "3," } });
    expect(input).toHaveValue("3,");
    fireEvent.change(input, { target: { value: "3,5" } });
    expect(screen.getByRole("status")).toHaveTextContent("3.5");
    fireEvent.blur(input);
    expect(input).toHaveValue("3,5");
  });
  it("accepts pasted grouped amounts and leaves a cleared field empty", () => {
    render(<Field />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "1 250 000" } });
    expect(screen.getByRole("status")).toHaveTextContent("1250000");
    fireEvent.blur(input);
    expect((input as HTMLInputElement).value.replace(/\s/g, " ")).toBe("1 250 000");
    fireEvent.change(input, { target: { value: "" } });
    expect(screen.getByRole("status")).toHaveTextContent("0");
    expect(input).toHaveValue("");
  });
  it("keeps the percentage ceiling at 100", () => {
    render(<Field max={100} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "120" } });
    expect(screen.getByRole("status")).toHaveTextContent("100");
  });
});