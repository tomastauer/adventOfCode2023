import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const parsed = this.parse(input);
		const processed = parsed.map(p => this.process(p, 'back')[0]);

		return processed.reduce((agg, curr) => agg + curr.at(-1)!,0);
	}

	solvePart2(input: string[]) {
		const parsed = this.parse(input);
		const processed = parsed.map(p => this.process(p, 'front')[0]);

		return processed.reduce((agg, curr) => agg + curr[0]!,0);
	}

	parse(input: string[]) {
		return input.map(i => i.split(' ').map(j => parseInt(j)));
	}

	process(row: number[], direction: 'back' | 'front') {
		const result = [row];

		while(result.at(-1)!.some(r => r !== 0)) {
			result.push(this.reduce(result.at(-1)!));
		}

		if(direction === 'back') {
		for(let i = result.length-1; i>=0; i--) {
			if(i === result.length-1) {
				result[i].push(0)
			} else {
				result[i].push(result[i].at(-1)! + result[i+1].at(-1)!);
			}
		}
	} else {
		for(let i = result.length-1; i>=0; i--) {
			if(i === result.length-1) {
				result[i].unshift(0)
			} else {
				result[i].unshift(result[i][0] - result[i+1][0]);
			}
		}
	}
		return result;
	}

	reduce(row: number[]) {
		return row.slice(1).map((_, i) => row[i+1] - row[i]);
	}
}
