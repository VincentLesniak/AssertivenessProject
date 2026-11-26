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
    goNext,
    goPrevious,
    progress,
    scores,
    slideCount,
} from "./quiz.js";

const start = () => createQuiz(2, questions);
const toFirstQuestion = () => goNext(goNext(start()));

describe("navigation", () => {
    it("compte 2 diapositives d'intro, 60 questions et 1 écran de résultats", () => {
        expect(slideCount(start())).toBe(63);
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

    it("affiche les résultats après la question 60", () => {
        let quiz = toFirstQuestion();
        for (let i = 0; i < 60; i++) {
            quiz = answer(quiz, true);
        }
        expect(currentKind(quiz)).toBe("results");
        expect(progress(quiz)).toBeNull();
        expect(canGoNext(quiz)).toBe(false);
        expect(canGoPrevious(quiz)).toBe(true);
        expect(scores(quiz)).toEqual({
            flight: 15,
            aggression: 15,
            manipulation: 15,
            assertiveness: 15,
        });
    });
});
