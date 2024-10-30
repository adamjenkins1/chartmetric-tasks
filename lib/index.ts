import { f } from "./strings";
import { SAMPLE_API_RESPONSE, STRINGS_INPUTS } from "./constants";
import { transform } from "./transform";

STRINGS_INPUTS.forEach((input) => console.log(f(input)));
console.log(transform(SAMPLE_API_RESPONSE));
