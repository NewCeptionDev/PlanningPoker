import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {

  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme()


  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return <div className="grid place-items-center h-full relative" data-testid="theme-switcher">
    <input type="checkbox" id="toggle" defaultChecked={theme === "dark"} onClick={(checkbox: any) => setTheme(checkbox.target.checked ? "dark" : "light")} className="hidden toggle--checkbox" data-testid="theme-switcher-toggle" />
    <label htmlFor="toggle" className="toggle--label" data-testid="theme-switcher-label">
      <span className="toggle--label-background" data-testid="theme-switcher-label-background"></span>
    </label>

  </div>;
}
