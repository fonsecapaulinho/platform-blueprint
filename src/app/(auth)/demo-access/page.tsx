import type { Metadata } from "next";
import { DemoView } from "@/features/demo-access/demo-view";

export const metadata: Metadata = { title: "Demo sign-in" };
export default function DemoPage() { return <DemoView/>; }
