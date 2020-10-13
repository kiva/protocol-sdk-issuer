// Constants
import * as actions from "./authorized_actions.json";
import * as constants from "./variables.json";
import * as translations from "./translations.json";

import {Constants, MessageMap} from "../ui/interfaces/ConstantInterfaces";

// TODO: Figure out a less circuitous way to do this
const C: any = constants;
const C_DATA: Constants = C.default;

const TR: any = translations;
const TR_DATA: MessageMap = TR.default;

const A: any = actions;
const A_DATA: any = A.default;

export const CONSTANTS = C_DATA;
export const translationKeys = TR_DATA;
export const actionList = A_DATA;