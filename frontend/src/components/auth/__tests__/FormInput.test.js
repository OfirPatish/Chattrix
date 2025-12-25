import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormInput from "../FormInput";
import { Mail } from "lucide-react";

describe("FormInput", () => {
  it("should render input with label", () => {
    render(
      <FormInput
        label="Email"
        icon={Mail}
        type="email"
        placeholder="Enter email"
      />
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("should display error message when error prop is provided", () => {
    render(
      <FormInput
        label="Email"
        icon={Mail}
        type="email"
        error="Email is required"
      />
    );

    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("should handle user input", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <FormInput
        label="Email"
        icon={Mail}
        type="email"
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText(/email/i);
    await user.type(input, "test@test.com");

    expect(handleChange).toHaveBeenCalled();
  });

  it("should apply error styling when error exists", () => {
    render(
      <FormInput
        label="Email"
        icon={Mail}
        type="email"
        error="Error message"
      />
    );

    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveClass("input-error");
  });
});

