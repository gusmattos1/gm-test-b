import { render, screen } from "@testing-library/react";
import App from "./App";

test("Check for Login", () => {
  render(<App />);
  const linkElement = screen.getByTestId("signInGoogle");
  expect(linkElement).toBeInTheDocument();
});
