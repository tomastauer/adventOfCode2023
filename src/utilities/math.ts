function pairGcd(a: number, b: number): number {
	return a === 0 ? b : pairGcd(b % a, a);
}

export function gcd(input: number[]) {
	let result = input[0];
	for (let i = 1; i < input.length; i++) {
		result = pairGcd(input[i], result);

		if (result == 1) {
			return 1;
		}
	}
	return result;
}

export function lcm(input: number[]) {
	const g = gcd(input);
	return input.reduce((agg, curr) => agg * (curr / g));
}
