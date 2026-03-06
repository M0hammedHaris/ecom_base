import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

describe("Button", () => {
  it("renders with default variant", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeDefined();
  });

  it("renders as disabled", () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveProperty("disabled", true);
  });
});

describe("Badge", () => {
  it("renders badge text", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeDefined();
  });

  it("applies variant class", () => {
    render(<Badge variant="destructive">Out of Stock</Badge>);
    const badge = screen.getByText("Out of Stock");
    expect(badge.className).toContain("bg-red-500");
  });
});

describe("Card", () => {
  it("renders card with children", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>,
    );
    expect(screen.getByText("Test Card")).toBeDefined();
    expect(screen.getByText("Content")).toBeDefined();
  });
});
