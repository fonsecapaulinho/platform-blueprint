import type { Metadata } from "next";
import { DemoView } from "./demo-view";

export const metadata: Metadata = { title: "Demo sign-in" };
export default function DemoPage() { return <DemoView/>; }
