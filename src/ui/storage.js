/**
 * Lecture et écriture de la sauvegarde dans le navigateur (localStorage).
 * Aucune donnée ne quitte le navigateur. Si le stockage est indisponible
 * (navigation privée, stockage bloqué), le test fonctionne sans sauvegarde.
 */
const KEY = "assertivite.test";

export function readSave() {
    try {
        return JSON.parse(window.localStorage.getItem(KEY));
    } catch {
        return null;
    }
}

export function writeSave(data) {
    try {
        window.localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
        // Stockage indisponible : on continue sans sauvegarde.
    }
}

export function clearSave() {
    try {
        window.localStorage.removeItem(KEY);
    } catch {
        // Stockage indisponible : rien à effacer.
    }
}
