import { add } from "../add";

describe("add", () => {
	it("adds two numbers of same value", () => {
		const input = [1, 1] as const;
		const output = add(input[0], input[1]);
		const expected = 2;

		expect(output).toEqual(expected);
	});
	it("adds two numbers of differing value", () => {
		const input = [1, 2] as const;
		const output = add(input[0], input[1]);
		const expected = 3;

		expect(output).toEqual(expected);
	});
	it("adds a positive and negative number", () => {
		const input = [1, -1] as const;
		const output = add(input[0], input[1]);
		const expected = 0;

		expect(output).toEqual(expected);
	});
});
