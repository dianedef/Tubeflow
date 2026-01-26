import { Smartphone, Monitor } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

export default function ComplexToggle({
  setIsSummary,
  isSummary,
}: {
  setIsSummary: (value: boolean) => void;
  isSummary: boolean;
}) {
  return (
    <Toggle
      pressed={isSummary}
      onPressedChange={setIsSummary}
      aria-label="Toggle display mode"
      size="sm"
      variant="outline"
      className="gap-2"
    >
      {!isSummary ? (
        <>
          <Smartphone className="h-4 w-4" />
          <span>Portrait</span>
        </>
      ) : (
        <>
          <Monitor className="h-4 w-4" />
          <span>Paysage</span>
        </>
      )}
    </Toggle>
  );
}
