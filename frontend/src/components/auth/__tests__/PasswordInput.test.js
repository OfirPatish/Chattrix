import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PasswordInput from "../PasswordInput";

describe("PasswordInput", () => {
  it("should render password input", () => {
    render(<PasswordInput label="Password" placeholder="Enter password" />);

    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toHaveAttribute(
      "type",
      "password"
    );
  });

  it("should toggle password visibility", async () => {
    const user = userEvent.setup();
    render(<PasswordInput label="Password" />);

    const input = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole("button");

    // Initially password should be hidden
    expect(input).toHaveAttribute("type", "password");

    // Click to show password
    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    // Click to hide password again
    await user.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  it("should display error message", () => {
    render(<PasswordInput label="Password" error="Password is required" />);

    expect(screen.getByText("Password is required")).toBeInTheDocument();
  });

  it("should handle user input", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<PasswordInput label="Password" onChange={handleChange} />);

    const input = screen.getByLabelText(/password/i);
    await user.type(input, "password123");

    expect(handleChange).toHaveBeenCalled();
  });
});

