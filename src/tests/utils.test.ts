import { describe, expect, it } from "vitest";
import { cn, formatPrice, slugify } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("resolves tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("formatPrice", () => {
  it("formats price in cents to USD string", () => {
    expect(formatPrice(2999)).toBe("$29.99");
  });

  it("formats zero price", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });

  it("formats large price", () => {
    expect(formatPrice(100000)).toBe("$1,000.00");
  });
});

describe("slugify", () => {
  it("converts text to slug", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("handles special characters", () => {
    expect(slugify("Classic White T-Shirt!")).toBe("classic-white-t-shirt");
  });

  it("collapses multiple dashes", () => {
    expect(slugify("foo   bar")).toBe("foo-bar");
  });
});
