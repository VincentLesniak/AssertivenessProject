import "@fontsource/inter/400.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/space-grotesk/700.css";
import "./styles/tokens.css";
import "./styles/main.css";
import content from "./data/content.json";
import questions from "./data/questions.json";
import { startSlider } from "./ui/slider.js";

startSlider(document.querySelector(".app"), content, questions);
