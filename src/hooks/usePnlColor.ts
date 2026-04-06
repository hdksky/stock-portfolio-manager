import { useSettingsStore } from "../stores/settingsStore";

/**
 * Hook that returns PnL color utilities based on the user's color scheme preference.
 *
 * - "red-up" (红涨绿跌): profit = red, loss = green  (Chinese convention, default)
 * - "green-up" (绿涨红跌): profit = green, loss = red (Western convention)
 */
export function usePnlColor() {
  const isRedUp = useSettingsStore((s) => s.colorScheme === "red-up");

  // Color pairs: [positive, negative]
  const bright = isRedUp
    ? (["#EF4444", "#22C55E"] as const)
    : (["#22C55E", "#EF4444"] as const);
  const ant = isRedUp
    ? (["#ff4d4f", "#52c41a"] as const)
    : (["#52c41a", "#ff4d4f"] as const);
  const dark = isRedUp
    ? (["#cf1322", "#3f8600"] as const)
    : (["#3f8600", "#cf1322"] as const);
  const deep = isRedUp
    ? (["#820014", "#135200"] as const)
    : (["#135200", "#820014"] as const);
  const tag = isRedUp
    ? (["red", "green"] as const)
    : (["green", "red"] as const);

  return {
    /** Bright shade: e.g. #EF4444 / #22C55E */
    profitColor: bright[0],
    lossColor: bright[1],

    /** value >= 0 → profit color, < 0 → loss color (bright shade) */
    pnlColor: (v: number) => (v >= 0 ? bright[0] : bright[1]),

    /** Ant Design shade: #ff4d4f / #52c41a */
    pnlColorAnt: (v: number) => (v >= 0 ? ant[0] : ant[1]),

    /** Dark shade: #cf1322 / #3f8600 */
    pnlColorDark: (v: number) => (v >= 0 ? dark[0] : dark[1]),

    /** Deep shade: #820014 / #135200 */
    pnlColorDeep: (v: number) => (v >= 0 ? deep[0] : deep[1]),

    /** Ant Design Tag color name: "red" / "green" */
    pnlTag: (v: number) => (v >= 0 ? tag[0] : tag[1]),

    /** Heatmap cell background color with intensity based on rate */
    cellColor: (rate: number) => {
      if (rate === 0) return "transparent";
      const SATURATION_THRESHOLD = 10;
      const intensity = Math.min(Math.abs(rate) / SATURATION_THRESHOLD, 1);

      // Determine which color channel to use based on positive/negative + color scheme
      const useRed =
        (rate > 0 && isRedUp) || (rate < 0 && !isRedUp);

      if (useRed) {
        const r = Math.round(150 + intensity * 100);
        return `rgba(${r}, 0, 0, ${0.15 + intensity * 0.5})`;
      }
      const g = Math.round(80 + intensity * 100);
      return `rgba(0, ${g}, 0, ${0.15 + intensity * 0.5})`;
    },
  };
}
