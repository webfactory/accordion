import { htmlid } from "../src/helper";

const data = [
    { input: 'Hørßt', output: 'horst', }, // no umlauts
    { input: '!imp:ort;ant*', output: 'imp-ort-ant', }, // no leading or trailing punctuation/symbols
    { input: '2020', output: 'a2020', }, // no leading number
    { input: 'Hallo Welt', output: 'hallo-welt' }, // blank spaces to hyphens
    { input: 'An- und Abreise', output: 'an-und-abreise', }, // no duplicate hyphens
    { input: 'Under_score', output: 'under-score' }, // no underscore
];

describe.each(data)(`Create valid HTML IDs`, (string) => {
    it(`${string.input} should become ${string.output}`, () => {
        const id = htmlid(string.input);

        expect(id).toBe(string.output);
    });
});
