/**
 * Calcul des scores du test d'assertivité.
 * Fonctions pures : aucune dépendance au DOM, entièrement testées.
 */

/** Les quatre postures évaluées, 15 questions chacune. */
export const CATEGORIES = ["flight", "aggression", "manipulation", "assertiveness"];

/** Retourne un objet de scores à zéro : { flight: 0, aggression: 0, ... }. */
export function createEmptyScores() {
    return Object.fromEntries(CATEGORIES.map((category) => [category, 0]));
}

/**
 * Retourne de nouveaux scores après une réponse.
 * Seule une réponse « plutôt vrai » ajoute un point à la posture de la question.
 */
export function addAnswer(scores, question, isTrue) {
    if (!CATEGORIES.includes(question.category)) {
        throw new Error(
            `Catégorie inconnue pour la question ${question.id} : ${question.category}`,
        );
    }
    if (!isTrue) {
        return { ...scores };
    }
    return { ...scores, [question.category]: scores[question.category] + 1 };
}

/**
 * Calcule les scores à partir de toutes les réponses.
 * `answers` associe l'id d'une question à true (plutôt vrai) ou false (plutôt faux) ;
 * une question sans réponse ne compte pas.
 */
export function computeScores(questions, answers) {
    return questions.reduce(
        (scores, question) =>
            question.id in answers ? addAnswer(scores, question, answers[question.id]) : scores,
        createEmptyScores(),
    );
}
