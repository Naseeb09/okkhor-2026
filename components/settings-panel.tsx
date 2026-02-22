"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Flame, Palette, Layers } from "lucide-react";

interface SettingsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chaos: number;
  onChaosChange: (value: number) => void;
  colorMode: number;
  onColorModeChange: (value: number) => void;
  complexity: number;
  onComplexityChange: (value: number) => void;
}

export function SettingsPanel({
  open,
  onOpenChange,
  chaos,
  onChaosChange,
  colorMode,
  onColorModeChange,
  complexity,
  onComplexityChange,
}: SettingsPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="border-border/50 bg-card/95 backdrop-blur-2xl"
      >
        <SheetHeader>
          <SheetTitle className="font-sans text-lg font-semibold tracking-tight">
            Generation Parameters
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            Fine-tune your generative output.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 flex flex-col gap-8">
          {/* Chaos Slider */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <Flame className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Chaos</p>
                  <p className="text-xs text-muted-foreground">Randomness</p>
                </div>
              </div>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {chaos}%
              </span>
            </div>
            <Slider
              value={[chaos]}
              onValueChange={([v]) => onChaosChange(v)}
              max={100}
              step={1}
              className="cursor-pointer"
            />
          </div>

          {/* Color Slider */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <Palette className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Color</p>
                  <p className="text-xs text-muted-foreground">Hue shift</p>
                </div>
              </div>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {colorMode}
              </span>
            </div>
            <Slider
              value={[colorMode]}
              onValueChange={([v]) => onColorModeChange(v)}
              max={100}
              step={1}
              className="cursor-pointer"
            />
          </div>

          {/* Complexity Slider */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <Layers className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Complexity
                  </p>
                  <p className="text-xs text-muted-foreground">Shape density</p>
                </div>
              </div>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {complexity}%
              </span>
            </div>
            <Slider
              value={[complexity]}
              onValueChange={([v]) => onComplexityChange(v)}
              max={100}
              step={1}
              className="cursor-pointer"
            />
          </div>

          {/* Info */}
          <div className="mt-4 rounded-xl border border-border/50 bg-secondary/50 p-4">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Each Bangla character maps to unique geometric primitives. Adjust
              parameters to explore different visual compositions.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
