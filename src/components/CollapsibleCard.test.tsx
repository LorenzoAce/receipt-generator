import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sparkles } from "lucide-react";
import { CollapsibleCard } from "./CollapsibleCard";

describe("CollapsibleCard", () => {
  it("apre e richiude il contenuto quando si clicca l'intestazione", async () => {
    const user = userEvent.setup();

    render(
      <CollapsibleCard title="Test sezione" icon={Sparkles}>
        <div>Contenuto sezione</div>
      </CollapsibleCard>,
    );

    expect(screen.queryByText("Contenuto sezione")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /test sezione/i }));
    expect(screen.getByText("Contenuto sezione")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /test sezione/i }));
    expect(screen.queryByText("Contenuto sezione")).not.toBeInTheDocument();
  });
});
