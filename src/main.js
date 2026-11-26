import "./styles/main.css";
import content from "./data/content.json";
import questions from "./data/questions.json";
import { startSlider } from "./ui/slider.js";

startSlider(document.querySelector("#content"), content, questions);
