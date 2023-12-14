import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	memoized = new Map<string, string>();

	solvePart1(input: string[]) {
		const parsed = this.parse(input);
		const rearranged = parsed.map(c => this.rearrange(c)).map(c => this.score(c));
		
		return rearranged.reduce((agg, curr) => agg + curr);
	}

	solvePart2(input: string[]) {
		let iterated = this.parse(input);

		
		while(true) {
			if(this.memoized.has(this.serialize(iterated))) {
				break;
			}
			iterated = this.iterate(iterated);
		}

		const keys = Array.from(this.memoized.keys());
		const i = keys.indexOf(this.serialize(iterated));
		const period = keys.length - i;

		console.log(keys.length, keys.indexOf(this.serialize(iterated)));

		return this.deserialize(keys[(1000000000-i) % period + i]).map(c=>this.score(c)).reduce((agg, curr) => agg+curr);
	}

	iterate(columns: string[]) {
		const memoized = this.memoized.get(this.serialize(columns));
		if(memoized) {
			return this.deserialize(memoized);
		}

		const l0 = columns.map(c => this.rearrange(c));
		const l90 = this.rotate(l0).map(c => this.rearrange(c));
		const l180 = this.rotate(l90).map(c => this.rearrange(c));
		const l270 = this.rotate(l180).map(c => this.rearrange(c));
		const result = this.rotate(l270);

		this.memoized.set(this.serialize(columns), this.serialize(result));

		return result;
	}

	rearrange(column: string) {
		return column.split('#').map((c) => {
			const l = c.length;
			const o = c.split('').filter(d => d === 'O').length;
			return 'O'.repeat(o).padEnd(l, '.');
		}).join('#');
	}

	rotate(columns: string[]) {
		return this.parse(columns).reverse();
	}

	score(column: string) {
		return column.split('').reduce((agg, curr, i) => {
			if(curr === 'O') {
				agg += column.length - i;
			}

			return agg;
		}, 0)
	}

	parse(input: string[]) {
		return new Array(input[0].length).fill(0).map((_, i) => input.map(r => r[i]).join(''));
	}

	serialize(columns: string[]) {
		return columns.join('|');
	}

	deserialize(columns: string) {
		return columns.split('|');
	}
}
