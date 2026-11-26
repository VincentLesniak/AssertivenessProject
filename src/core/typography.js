/**
 * Typographie française : remplace l'espace ordinaire autour de « », : ; ? ! par une
 * espace insécable, pour qu'un signe ne se retrouve jamais seul en début de ligne.
 */
const NBSP = " ";

export function frenchSpacing(text) {
    if (!text) {
        return "";
    }
    return text
        .replace(/« +/g, `«${NBSP}`)
        .replace(/ +»/g, `${NBSP}»`)
        .replace(/ +([:;?!])/g, `${NBSP}$1`);
}
