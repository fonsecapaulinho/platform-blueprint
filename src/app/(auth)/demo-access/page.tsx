import type { Metadata } from "next";
import { DemoView } from "@/features/demo-access/demo-view";
import { DemoEntry } from "@/features/session/demo-entry";

export const metadata: Metadata = { title: "Sign in" };
export default function DemoPage() {
  return (
    <>
      <DemoView />
      <DemoEntry />
    </>
  );
}
