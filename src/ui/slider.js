/**
 * Affichage du test : accueil, règles, 60 questions, puis les écrans de résultats.
 * Toute la logique (réponses, navigation, scores) est dans core/quiz.js.
 */
import { CATEGORIES } from "../core/scoring.js";
import * as Quiz from "../core/quiz.js";
import * as Save from "../core/save.js";
import { frenchSpacing } from "../core/typography.js";
import { downloadReport } from "./pdf-report.js";
import { renderConclusion, renderGrid, renderScores } from "./results-screens.js";
import { clearSave, readSave, writeSave } from "./storage.js";

/** Durée pendant laquelle la réponse choisie reste affichée avant la question suivante. */
const ANSWER_FEEDBACK_MS = 200;
/** Durée de la vibration au choix d'une réponse. */
const VIBRATION_MS = 15;

export function startSlider(root, content, questions) {
    const $ = (id) => root.querySelector(`#${id}`);
    const el = {
        head: root.querySelector(".card-head"),
        title: $("title"),
        progressCount: $("progressCount"),
        progress: $("progress"),
        progressBar: $("progressBar"),
        subtitle: $("subtitle"),
        privacy: $("privacy"),
        definitions: $("definitions"),
        questionText: $("questionText"),
        panel: $("panel"),
        start: $("startButton"),
        resume: $("resumeButton"),
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
    const introCount = content.introSlides.length;
    // Un test interrompu est repris là où il s'était arrêté, sur demande depuis l'accueil
    const saved = Save.fromSave(readSave(), introCount, questions);
    let quiz = saved ? { ...saved, index: 0 } : Quiz.createQuiz(introCount, questions);
    // Dernière diapositive vue hors de l'accueil : c'est là que « Reprendre » ramène
    let resumeIndex = saved ? saved.index : 0;
    let selectedPosture = null;
    // Vrai pendant le court instant où la réponse choisie reste affichée
    let answering = false;

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
                onDownload: downloadPdf,
            });
        } else if (kind === "conclusion") {
            renderConclusion(el.panel, {
                conclusion: results.conclusion,
                restartLabel: results.restart,
                onRestart: () => update(Quiz.restart(quiz)),
                downloadLabel: results.print.button,
                onDownload: downloadPdf,
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
        setText(el.privacy, intro.privacy);
        show(el.privacy, Boolean(intro.privacy));

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

        // Accueil : « Commencer », ou « Recommencer » et « Reprendre » si un test est en cours
        const resumable = isWelcome && Save.hasProgress(quiz);
        show(el.start, isWelcome);
        setText(el.start, resumable ? intro.restart : intro.start);
        show(el.resume, resumable);
        if (resumable) {
            setText(el.resume, resumeLabel(intro));
        }

        const answered = Quiz.currentAnswer(quiz);
        show(el.answers, kind === "question");
        show(el.keyboardHint, kind === "question");
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

    function downloadPdf() {
        const now = new Date();
        downloadReport({
            scores: Quiz.scores(quiz),
            maximum,
            results,
            credit: content.credit,
            date: now.toLocaleDateString("fr-FR", { dateStyle: "long" }),
            fileName: results.print.fileName.replace("{date}", isoDate(now)),
        });
    }

    function resumeLabel(intro) {
        const position = Quiz.progress(resumeTarget());
        return position ? intro.resume.replace("{n}", position.current) : intro.resumeResults;
    }

    function resumeTarget() {
        return Save.resumePoint({ ...quiz, index: resumeIndex });
    }

    function update(newQuiz) {
        quiz = newQuiz;
        selectedPosture = null;
        if (quiz.index !== 0) {
            resumeIndex = quiz.index;
        }
        if (Save.hasProgress(quiz)) {
            writeSave(Save.toSave({ ...quiz, index: resumeIndex }));
        } else {
            clearSave();
        }
        render();
        window.scrollTo({ top: 0 });
        // Si le bouton utilisé a disparu, le focus passe au titre du nouvel écran
        const focused = document.activeElement;
        if (!focused || focused === document.body || focused.closest("[hidden]")) {
            el.title.focus({ preventScroll: true });
        }
    }

    function goNext() {
        if (!answering && Quiz.canGoNext(quiz) && quiz.index !== 0) {
            update(Quiz.goNext(quiz));
        }
    }

    function goPrevious() {
        if (!answering && Quiz.canGoPrevious(quiz)) {
            update(Quiz.goPrevious(quiz));
        }
    }

    /**
     * Le bouton choisi se remplit avec sa coche pendant un court instant,
     * puis la question suivante s'affiche. Les autres actions attendent la fin.
     */
    function answer(isTrue) {
        if (answering || Quiz.currentKind(quiz) !== "question") {
            return;
        }
        answering = true;
        // Petite vibration sur les téléphones qui le permettent (Android ; pas sur iPhone)
        navigator.vibrate?.(VIBRATION_MS);
        for (const [button, value] of [
            [el.answerFalse, false],
            [el.answerTrue, true],
        ]) {
            button.classList.toggle("is-selected", value === isTrue);
            button.setAttribute("aria-pressed", String(value === isTrue));
        }
        setTimeout(() => {
            answering = false;
            update(Quiz.answer(quiz, isTrue));
        }, ANSWER_FEEDBACK_MS);
    }

    // Raccourcis : V ou F pour répondre, flèches gauche et droite pour naviguer
    const shortcuts = {
        v: () => answer(true),
        f: () => answer(false),
        ArrowRight: goNext,
        ArrowLeft: goPrevious,
    };
    document.addEventListener("keydown", (event) => {
        const action = shortcuts[event.key.length === 1 ? event.key.toLowerCase() : event.key];
        if (!action || event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }
        event.preventDefault();
        action();
    });

    el.start.addEventListener("click", () => update(Quiz.goNext(Quiz.restart(quiz))));
    el.resume.addEventListener("click", () => update(resumeTarget()));
    el.previous.addEventListener("click", goPrevious);
    el.next.addEventListener("click", goNext);
    el.answerFalse.addEventListener("click", () => answer(false));
    el.answerTrue.addEventListener("click", () => answer(true));

    /**
     * Réserve à la question la hauteur de la plus longue des 60, à la largeur actuelle :
     * les boutons de réponse restent au même endroit d'une question à l'autre.
     */
    function reserveQuestionHeight() {
        const probe = el.questionText.cloneNode();
        probe.removeAttribute("id");
        probe.hidden = false;
        probe.setAttribute("aria-hidden", "true");
        Object.assign(probe.style, {
            position: "absolute",
            visibility: "hidden",
            minHeight: "0",
            width: `${el.questionText.parentElement.clientWidth - paddingX(el.questionText.parentElement)}px`,
        });
        el.questionText.parentElement.append(probe);
        let tallest = 0;
        for (const question of questions) {
            probe.textContent = frenchSpacing(question.text);
            tallest = Math.max(tallest, probe.getBoundingClientRect().height);
        }
        probe.remove();
        el.questionText.style.minHeight = `${Math.ceil(tallest)}px`;
    }

    function paddingX(element) {
        const style = getComputedStyle(element);
        return parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    }

    let resizeFrame = 0;
    window.addEventListener("resize", () => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(reserveQuestionHeight);
    });

    render();
    reserveQuestionHeight();
    // Les polices changent la largeur du texte : on remesure une fois chargées
    document.fonts?.ready.then(reserveQuestionHeight);
}

/** Date locale au format 2026-11-27, pour le nom du fichier. */
function isoDate(date) {
    const pad = (number) => String(number).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
