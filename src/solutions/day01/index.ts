import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const digits = new Array(10).fill(0).map((_, i) => i);

		const result = input.map(i => {
			const left = parseInt(i[Math.min(...digits.map(d => i.indexOf(d.toString())).filter(d => d >= 0))]);
			const right = parseInt(i[Math.max(...digits.map(d => i.lastIndexOf(d.toString())))]);

			return left * 10 + right;
		});

		return result.reduce((agg, curr) => agg+curr);
	}

	solvePart2(input: string[]) {
		const digitsNumbers = new Array(10).fill(0).map((_, i) => i);
		const digitsWords = ['zero','one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
		const digits = [...digitsNumbers, ...digitsWords]

		const result = input.map(i => {
			const left = digits.map((d, di) => ([i.indexOf(d.toString()), di])).filter(([d]) => d >= 0).sort(([a], [b]) => a-b).map(([di, d]) => ([di, d >=10?d-10:d]))[0][1];
			const right = digits.map((d, di) => ([i.lastIndexOf(d.toString()), di])).sort(([a], [b]) => b-a).map(([di, d]) => ([di, d >=10?d-10:d]))[0][1];
		
			return left*10 + right;
		});

		return result.reduce((agg, curr) => agg+curr);
	}
}
