import { startDemoSession } from "./actions";
import { demoEntryMessages } from "./demo-entry.translations";
import { Button } from "@/shared/ui/button";

/**
 * Lets the demonstration be walked through before Google OAuth is configured.
 * Writes the simulated session and nothing else — see the notice in
 * demo-session.ts.
 */
export function DemoEntry() {
  const messages = demoEntryMessages["en-US"];
  return (
    <section>
      <h2>{messages.title}</h2>
      <p>{messages.description}</p>
      <form action={startDemoSession}>
        <Button type="submit" name="role" value="student">
          {messages.student}
        </Button>
      </form>
      <form action={startDemoSession}>
        <Button type="submit" name="role" value="teacher" variant="secondary">
          {messages.teacher}
        </Button>
      </form>
    </section>
  );
}
