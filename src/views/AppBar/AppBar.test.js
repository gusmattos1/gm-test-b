import { render, screen } from "@testing-library/react";
import AppBar from "./AppBar";

const mockUser = {
  imageUrl: "https://test.com/",
};

test("Check for AppBar", () => {
  render(<AppBar user={mockUser} />);
  const appBar = screen.getByTestId("appbar-test");
  expect(appBar).toBeInTheDocument();
});

test("Check for logout button", () => {
  render(<AppBar user={mockUser} />);
  const logoutButton = screen.getByTestId("logout-button");
  expect(logoutButton).toBeDefined();
});

test("Check for user Image", () => {
  render(<AppBar user={mockUser} />);
  const userImage = screen.getByTestId("user-img");
  expect(userImage.src).toEqual(mockUser.imageUrl);
});
