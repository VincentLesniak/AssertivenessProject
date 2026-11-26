/**
 * État du test et navigation entre les diapositives.
 * Fonctions pures : chaque action retourne un nouvel état, sans toucher au DOM.
 *
 * Les diapositives sont, dans l'ordre : les diapositives d'introduction,
 * une diapositive par question, puis la diapositive de résultats.
 */
import { computeScores } from "./scoring.js";

/** Crée l'état initial : première diapositive, aucune réponse. */
export function createQuiz(introCount, questions) {
    return { introCount, questions, index: 0, answers: {} };
}

/** Nombre total de diapositives (introduction + questions + résultats). */
export function slideCount(quiz) {
    return quiz.introCount + quiz.questions.length + 1;
}

/** Type de la diapositive courante : "intro", "question" ou "results". */
export function currentKind(quiz) {
    if (quiz.index < quiz.introCount) {
        return "intro";
    }
    if (quiz.index < quiz.introCount + quiz.questions.length) {
        return "question";
    }
    return "results";
}

/** Question affichée, ou null hors des questions. */
export function currentQuestion(quiz) {
    return currentKind(quiz) === "question" ? quiz.questions[quiz.index - quiz.introCount] : null;
}

/** Réponse déjà donnée à la question courante : true, false, ou undefined. */
export function currentAnswer(quiz) {
    const question = currentQuestion(quiz);
    return question ? quiz.answers[question.id] : undefined;
}

export function canGoPrevious(quiz) {
    return quiz.index > 0;
}

/** On avance librement dans l'introduction ; sur une question, seulement si elle a une réponse. */
export function canGoNext(quiz) {
    const kind = currentKind(quiz);
    if (kind === "intro") {
        return true;
    }
    if (kind === "question") {
        return currentAnswer(quiz) !== undefined;
    }
    return false;
}

export function goPrevious(quiz) {
    return canGoPrevious(quiz) ? { ...quiz, index: quiz.index - 1 } : quiz;
}

export function goNext(quiz) {
    return canGoNext(quiz) ? { ...quiz, index: quiz.index + 1 } : quiz;
}

/**
 * Enregistre la réponse à la question courante puis passe à la suivante.
 * Une nouvelle réponse remplace l'ancienne.
 */
export function answer(quiz, isTrue) {
    const question = currentQuestion(quiz);
    if (!question) {
        return quiz;
    }
    return {
        ...quiz,
        answers: { ...quiz.answers, [question.id]: isTrue },
        index: quiz.index + 1,
    };
}

/** Position dans le questionnaire : { current: 12, total: 60 }, ou null hors des questions. */
export function progress(quiz) {
    const question = currentQuestion(quiz);
    return question
        ? { current: quiz.index - quiz.introCount + 1, total: quiz.questions.length }
        : null;
}

/** Scores calculés à partir des réponses actuelles. */
export function scores(quiz) {
    return computeScores(quiz.questions, quiz.answers);
}
