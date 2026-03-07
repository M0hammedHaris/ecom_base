"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { changePassword, logout, updateProfile } from "@/lib/actions/auth";
import type { User } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface AccountFormProps {
  user: Omit<User, "passwordHash">;
}

export function AccountForm({ user }: AccountFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [profileMsg, setProfileMsg] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);
  const [pwMsg, setPwMsg] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  async function handleProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateProfile(
        formData.get("name") as string,
        formData.get("email") as string,
      );
      if (result.success) {
        setProfileMsg({ type: "success", text: "Profile updated!" });
        router.refresh();
      } else {
        setProfileMsg({ type: "error", text: result.error });
      }
    });
  }

  async function handlePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const newPw = formData.get("newPassword") as string;
    const confirm = formData.get("confirmPassword") as string;

    if (newPw !== confirm) {
      setPwMsg({ type: "error", text: "Passwords do not match" });
      return;
    }

    startTransition(async () => {
      const result = await changePassword(
        formData.get("currentPassword") as string,
        newPw,
      );
      if (result.success) {
        setPwMsg({ type: "success", text: "Password changed successfully!" });
        (event.target as HTMLFormElement).reset();
      } else {
        setPwMsg({ type: "error", text: result.error });
      }
    });
  }

  async function handleLogout() {
    startTransition(async () => {
      await logout();
      router.push("/");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold text-neutral-900">
          Profile Information
        </h2>
        <form onSubmit={handleProfile} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={user.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={user.email}
              />
            </div>
          </div>

          {profileMsg && (
            <p
              className={`text-sm ${
                profileMsg.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {profileMsg.text}
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>

      <Separator />

      {/* Password Section */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold text-neutral-900">
          Change Password
        </h2>
        <form onSubmit={handlePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          {pwMsg && (
            <p
              className={`text-sm ${
                pwMsg.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {pwMsg.text}
            </p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>

      <Separator />

      {/* Sign Out */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-2 text-lg font-semibold text-neutral-900">
          Sign Out
        </h2>
        <p className="mb-4 text-sm text-neutral-500">
          Sign out from your account on this device.
        </p>
        <Button
          variant="destructive"
          onClick={handleLogout}
          disabled={isPending}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
