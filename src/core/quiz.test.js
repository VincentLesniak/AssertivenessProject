import { describe, expect, it } from "vitest";
import questions from "../data/questions.json";
import {
    answer,
    canGoNext,
    canGoPrevious,
    createQuiz,
    currentAnswer,
    currentKind,
    currentQuestion,
    isResultScreen,
    goNext,
    goPrevious,
    progress,
    restart,
    scores,
    slideCount,
} from "./quiz.js";

const start = () => createQuiz(2, questions);
const toFirstQuestion = () => goNext(goNext(start()));

describe("navigation", () => {
    it("compte 2 diapositives d'intro, 60 questions et 3 écrans de résultats", () => {
        expect(slideCount(start())).toBe(65);
    });

    it("commence sur l'accueil, sans retour possible", () => {
        const quiz = start();
        expect(currentKind(quiz)).toBe("intro");
        expect(canGoPrevious(quiz)).toBe(false);
        expect(goPrevious(quiz)).toBe(quiz);
    });

    it("arrive sur la question 1 après les règles", () => {
        const quiz = toFirstQuestion();
        expect(currentKind(quiz)).toBe("question");
        expect(currentQuestion(quiz).id).toBe(1);
        expect(progress(quiz)).toEqual({ current: 1, total: 60 });
    });

    it("bloque Suivant sur une question sans réponse", () => {
        const quiz = toFirstQuestion();
        expect(canGoNext(quiz)).toBe(false);
        expect(goNext(quiz)).toBe(quiz);
    });

    it("permet Suivant sur une question déjà répondue", () => {
        const quiz = goPrevious(answer(toFirstQuestion(), true));
        expect(currentAnswer(quiz)).toBe(true);
        expect(canGoNext(quiz)).toBe(true);
        expect(currentQuestion(goNext(quiz)).id).toBe(2);
    });
});

describe("réponses", () => {
    it("passe à la question suivante après une réponse", () => {
        expect(currentQuestion(answer(toFirstQuestion(), false)).id).toBe(2);
    });

    it("ignore une réponse hors des questions", () => {
        const quiz = start();
        expect(answer(quiz, true)).toBe(quiz);
    });

    it("remplace une réponse modifiée au lieu de compter deux fois", () => {
        let quiz = answer(toFirstQuestion(), true); // question 1 (fuite) : vrai
        quiz = goPrevious(quiz);
        quiz = answer(quiz, true); // même réponse redonnée
        expect(scores(quiz).flight).toBe(1);
        quiz = answer(goPrevious(quiz), false); // changée en faux
        expect(scores(quiz).flight).toBe(0);
    });

    it("enchaîne grille, résultats et conclusion après la question 60", () => {
        let quiz = toFirstQuestion();
        for (let i = 0; i < 60; i++) {
            quiz = answer(quiz, true);
        }
        expect(currentKind(quiz)).toBe("grid");
        expect(isResultScreen(quiz)).toBe(true);
        expect(progress(quiz)).toBeNull();
        expect(canGoPrevious(quiz)).toBe(true);
        quiz = goNext(quiz);
        expect(currentKind(quiz)).toBe("scores");
        quiz = goNext(quiz);
        expect(currentKind(quiz)).toBe("conclusion");
        expect(canGoNext(quiz)).toBe(false);
        expect(goNext(quiz)).toBe(quiz);
        expect(scores(quiz)).toEqual({
            flight: 15,
            aggression: 15,
            manipulation: 15,
            assertiveness: 15,
        });
    });
});

describe("recommencer", () => {
    it("efface les réponses et revient à l'accueil", () => {
        const quiz = restart(answer(toFirstQuestion(), true));
        expect(quiz.index).toBe(0);
        expect(quiz.answers).toEqual({});
        expect(currentKind(quiz)).toBe("intro");
        expect(isResultScreen(quiz)).toBe(false);
    });
});
