import { UUID } from "crypto";
import Language from "./LanguageType";

export default interface Dictionary {
    id: UUID,
    learnedLanguage: Language,
    targetLanguage: Language,
}
