"use client";

import { Smartphone, Monitor } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { useTranslation } from "@/i18n";

export default function ComplexToggle({
  setIsSummary,
  isSummary,
}: {
  setIsSummary: (value: boolean) => void;
  isSummary: boolean;
}) {
  const { t } = useTranslation();

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
          <span>{t.common.portrait}</span>
        </>
      ) : (
        <>
          <Monitor className="h-4 w-4" />
          <span>{t.common.landscape}</span>
        </>
      )}
    </Toggle>
  );
}
