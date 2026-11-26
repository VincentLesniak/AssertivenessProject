/**
 * Sauvegarde d'un test en cours, pour pouvoir le reprendre plus tard.
 * Fonctions pures : la lecture et l'écriture dans le navigateur sont dans ui/storage.js.
 */
import { createQuiz, currentKind, slideCount } from "./quiz.js";

export const SAVE_VERSION = 1;

/** Vrai si le test contient au moins une réponse. */
export function hasProgress(quiz) {
    return Object.keys(quiz.answers).length > 0;
}

/** Données à sauvegarder : la position et les réponses. */
export function toSave(quiz) {
    return { version: SAVE_VERSION, index: quiz.index, answers: quiz.answers };
}

/**
 * Reconstruit un test depuis une sauvegarde.
 * Retourne null si la sauvegarde est absente, d'une autre version ou incohérente.
 */
export function fromSave(data, introCount, questions) {
    if (!data || data.version !== SAVE_VERSION || typeof data.answers !== "object") {
        return null;
    }
    const ids = new Set(questions.map((question) => String(question.id)));
    const entries = Object.entries(data.answers ?? {});
    if (entries.some(([id, value]) => !ids.has(id) || typeof value !== "boolean")) {
        return null;
    }
    const quiz = { ...createQuiz(introCount, questions), answers: Object.fromEntries(entries) };
    if (!Number.isInteger(data.index) || data.index < 0 || data.index >= slideCount(quiz)) {
        return null;
    }
    return hasProgress(quiz) ? { ...quiz, index: data.index } : null;
}

/**
 * Où reprendre : la diapositive sauvegardée, ou la première question
 * sans réponse si la sauvegarde avait été faite pendant l'introduction.
 */
export function resumePoint(quiz) {
    if (currentKind(quiz) !== "intro") {
        return quiz;
    }
    const firstUnanswered = quiz.questions.findIndex((question) => !(question.id in quiz.answers));
    const position = firstUnanswered === -1 ? quiz.questions.length : firstUnanswered;
    return { ...quiz, index: quiz.introCount + position };
}
