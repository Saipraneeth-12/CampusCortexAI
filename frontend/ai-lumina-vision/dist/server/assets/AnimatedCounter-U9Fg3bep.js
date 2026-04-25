import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-CCute6b2.js";
function AnimatedCounter({
  value,
  duration = 1500,
  prefix = "",
  suffix = "",
  decimals = 0
}) {
  const [n, setN] = reactExports.useState(0);
  reactExports.useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  const formatted = n.toLocaleString(void 0, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
    prefix,
    formatted,
    suffix
  ] });
}
export {
  AnimatedCounter as A
};
