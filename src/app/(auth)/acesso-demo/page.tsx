import type { Metadata } from "next";
import { DemoView } from "./demo-view";

export const metadata: Metadata = { title: "Acesso de demonstração" };
export default function DemoPage() { return <DemoView/>; }
