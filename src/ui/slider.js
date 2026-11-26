/**
 * Affichage du test : accueil, règles, 60 questions, puis les écrans de résultats.
 * Toute la logique (réponses, navigation, scores) est dans core/quiz.js.
 */
import { CATEGORIES } from "../core/scoring.js";
import * as Quiz from "../core/quiz.js";
import { frenchSpacing } from "../core/typography.js";
import { renderConclusion, renderGrid, renderScores } from "./results-screens.js";

export function startSlider(root, content, questions) {
    const $ = (id) => root.querySelector(`#${id}`);
    const el = {
        head: root.querySelector(".card-head"),
        title: $("title"),
        progressCount: $("progressCount"),
        progress: $("progress"),
        progressBar: $("progressBar"),
        subtitle: $("subtitle"),
        definitions: $("definitions"),
        questionText: $("questionText"),
        panel: $("panel"),
        start: $("startButton"),
        answers: $("answers"),
        answerFalse: $("buttonFalse"),
        answerTrue: $("buttonTrue"),
        keyboardHint: $("keyboardHint"),
        previous: $("leftButton"),
        next: $("rightButton"),
        credit: $("credit"),
    };

    const { results } = content;
    const maximum = questions.length / CATEGORIES.length;
    let quiz = Quiz.createQuiz(content.introSlides.length, questions);
    let selectedPosture = null;

    const setText = (element, text) => {
        element.textContent = frenchSpacing(text);
    };
    const show = (element, visible) => {
        element.hidden = !visible;
    };

    // Textes fixes
    setText(el.previous, content.navigation.previous);
    setText(el.next, content.navigation.next);
    setText(el.answerFalse, content.answers.false);
    setText(el.answerTrue, content.answers.true);
    setText(el.keyboardHint, content.keyboardHint);
    setText(el.credit, content.credit);

    function titleFor(kind, question) {
        switch (kind) {
            case "intro":
                return content.introSlides[quiz.index].title;
            case "question":
                return `QUESTION ${question.id}`;
            case "grid":
                return results.analysisGrid.title;
            case "scores":
                return results.scoresTitle;
            default:
                return results.conclusion.title;
        }
    }

    function renderDefinitions(definitions) {
        show(el.definitions, Boolean(definitions));
        if (!definitions) {
            return;
        }
        el.definitions.replaceChildren(
            ...definitions.map(({ term, text }) => {
                const row = document.createElement("div");
                const dt = document.createElement("dt");
                const dd = document.createElement("dd");
                setText(dt, term);
                setText(dd, ` : ${text}`);
                row.append(dt, dd);
                return row;
            }),
        );
    }

    function renderPanel(kind) {
        if (kind === "grid") {
            renderGrid(el.panel, results.analysisGrid);
        } else if (kind === "scores") {
            renderScores(el.panel, {
                scores: Quiz.scores(quiz),
                maximum,
                results,
                selected: selectedPosture,
                onSelect: (category) => {
                    selectedPosture = selectedPosture === category ? null : category;
                    render();
                },
            });
        } else if (kind === "conclusion") {
            renderConclusion(el.panel, {
                conclusion: results.conclusion,
                restartLabel: results.restart,
                onRestart: () => update(Quiz.restart(quiz)),
            });
        } else {
            el.panel.replaceChildren();
        }
    }

    function render() {
        const kind = Quiz.currentKind(quiz);
        const question = Quiz.currentQuestion(quiz);
        const intro = kind === "intro" ? content.introSlides[quiz.index] : {};
        const isWelcome = quiz.index === 0;

        setText(el.title, titleFor(kind, question));
        el.head.classList.toggle("is-question", kind === "question");
        setText(el.subtitle, intro.subtitle);
        show(el.subtitle, Boolean(intro.subtitle));
        renderDefinitions(intro.definitions);

        show(el.questionText, Boolean(question));
        setText(el.questionText, question?.text);

        const position = Quiz.progress(quiz);
        show(el.progress, position !== null);
        show(el.progressCount, position !== null);
        if (position) {
            el.progressCount.textContent = `${position.current} / ${position.total}`;
            el.progressBar.style.width = `${(position.current / position.total) * 100}%`;
        }

        show(el.panel, Quiz.isResultScreen(quiz));
        renderPanel(kind);

        show(el.start, isWelcome);
        setText(el.start, intro.start);

        const answered = Quiz.currentAnswer(quiz);
        show(el.answers, kind === "question");
        // Raccourcis clavier : affichés avec la seconde partie de la v0.4.0
        show(el.keyboardHint, false);
        for (const [button, value] of [
            [el.answerFalse, false],
            [el.answerTrue, true],
        ]) {
            button.classList.toggle("is-selected", answered === value);
            button.setAttribute("aria-pressed", String(answered === value));
        }

        show(el.previous, Quiz.canGoPrevious(quiz));
        show(el.next, Quiz.canGoNext(quiz) && !isWelcome);
    }

    function update(newQuiz) {
        quiz = newQuiz;
        selectedPosture = null;
        render();
        window.scrollTo({ top: 0 });
    }

    el.start.addEventListener("click", () => update(Quiz.goNext(quiz)));
    el.previous.addEventListener("click", () => update(Quiz.goPrevious(quiz)));
    el.next.addEventListener("click", () => update(Quiz.goNext(quiz)));
    el.answerFalse.addEventListener("click", () => update(Quiz.answer(quiz, false)));
    el.answerTrue.addEventListener("click", () => update(Quiz.answer(quiz, true)));

    render();
}
