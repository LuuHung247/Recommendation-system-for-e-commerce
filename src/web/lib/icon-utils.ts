import * as LucideIcons from "lucide-react";
import type { ComponentType } from "react";

// Safely get an icon component by name
export function getIconByName(iconName: string): ComponentType<any> {
  // Cast to unknown first to avoid TypeScript errors
  const icons = LucideIcons as unknown as Record<string, ComponentType<any>>;

  // Check if the icon exists
  if (iconName in icons && typeof icons[iconName] === "function") {
    return icons[iconName];
  }

  // Return a default icon if not found
  return LucideIcons.Package;
}
