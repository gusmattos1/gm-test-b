import { render, screen, waitFor } from "@testing-library/react";
import Profile from "./Profile";

test("renders spinner", () => {
  render(<Profile />);
  const profileSpinner = screen.getByTestId("profile-spinner");
  expect(profileSpinner).toBeInTheDocument();
});

test("renders user profile", async () => {
  render(<Profile />);

  await waitFor(() => {
    const userForm = screen.getByTestId("profile-form");
    return expect(userForm).toBeInTheDocument();
  });

  const username = screen.getByTestId("first-name");
  const address = screen.getByTestId("address");

  expect(username).toBeInTheDocument();
  expect(address).toBeInTheDocument();
});
