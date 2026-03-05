// from https://svelte.dev/repl/de8970d53ce040159aba167c0a4af6ef?version=3.2.2
export default function fadeScale(
    node, { delay = 0, duration = 200, easing = x => x, baseScale = 0 }
) {
    const o = +getComputedStyle(node).opacity;
    const m = getComputedStyle(node).transform.match(/scale\(([0-9.]+)\)/);
    const s = Number(m ? m[1] : 1);
    const is = 1 - baseScale;

    return {
        delay,
        duration,
        css: t => {
            const eased = easing(t);
            return `opacity: ${eased * o}; transform: scale(${(eased * s * is) + baseScale})`;
        }
    };
}
