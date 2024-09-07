import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {

  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme()


  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return <div className="grid place-items-center h-full relative">
    <input type="checkbox" id="toggle" defaultChecked={theme === "dark"} onClick={(checkbox: any) => setTheme(checkbox.target.checked ? "dark" : "light")} className="hidden toggle--checkbox" />
    <label htmlFor="toggle" className="toggle--label">
      <span className="toggle--label-background"></span>
    </label>

  </div>;
}
