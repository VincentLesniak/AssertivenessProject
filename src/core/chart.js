/**
 * Géométrie de l'histogramme des résultats (fonctions pures, sans DOM).
 */

/** Graduations de l'axe vertical : 0, 5, 10, 15 pour un maximum de 15. */
export function ticks(maximum, step = 5) {
    return Array.from({ length: Math.floor(maximum / step) + 1 }, (_, i) => i * step);
}

/**
 * Position d'une barre dans une zone de tracé.
 * `plot` = { left, top, width, height } en unités SVG ; `index` = rang de la barre ;
 * renvoie { x, y, width, height } avec y mesuré depuis le haut (convention SVG).
 */
export function barGeometry(score, maximum, index, count, plot, gapRatio = 0.4) {
    const clamped = Math.min(Math.max(score, 0), maximum);
    const slot = plot.width / count;
    const width = slot * (1 - gapRatio);
    const height = (clamped / maximum) * plot.height;
    return {
        x: plot.left + index * slot + (slot - width) / 2,
        y: plot.top + plot.height - height,
        width,
        height,
    };
}

/** Ordonnée SVG d'une valeur de l'axe. */
export function valueToY(value, maximum, plot) {
    return plot.top + plot.height - (value / maximum) * plot.height;
}

/**
 * Tracé SVG d'une barre aux coins du haut arrondis et à la base plate,
 * posée sur l'axe. Le rayon est réduit si la barre est trop basse ou trop étroite.
 */
export function barPath({ x, y, width, height }, radius = 4) {
    if (height <= 0 || width <= 0) {
        return "";
    }
    const r = Math.min(radius, width / 2, height);
    const bottom = y + height;
    return [
        `M${x},${bottom}`,
        `V${y + r}`,
        `Q${x},${y} ${x + r},${y}`,
        `H${x + width - r}`,
        `Q${x + width},${y} ${x + width},${y + r}`,
        `V${bottom}`,
        "Z",
    ].join(" ");
}

/**
 * Courbe CSS « ease-out » (cubic-bezier(0, 0, 0.58, 1)) : progression de 0 à 1
 * pour un temps t de 0 à 1. Sert à faire défiler les chiffres au rythme des barres.
 */
export function easeOut(t) {
    if (t <= 0) {
        return 0;
    }
    if (t >= 1) {
        return 1;
    }
    // Courbe de Bézier avec P1 = (0, 0) et P2 = (0.58, 1) : on cherche u tel que x(u) = t
    const x = (u) => 3 * (1 - u) * u * u * 0.58 + u * u * u;
    let low = 0;
    let high = 1;
    for (let i = 0; i < 30; i++) {
        const u = (low + high) / 2;
        if (x(u) < t) {
            low = u;
        } else {
            high = u;
        }
    }
    const u = (low + high) / 2;
    return 3 * (1 - u) * u * u + u * u * u;
}

/** Chiffre affiché pendant l'animation : de 0 à `score`, arrondi. */
export function countAt(score, t) {
    return Math.round(score * easeOut(t));
}
