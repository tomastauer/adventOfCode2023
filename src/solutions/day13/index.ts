import { Solution } from '../../utilities/solver.ts';

type Map = {
	rows: string[];
	columns: string[];
};

type Candidates = {
	rows: number[];
	columns: number[];
};

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const parsed = this.parse(input.join('\n').split('\n\n'));
		return parsed.map((p) => this.resolve(p, this.getCandidates(p))).reduce(
			(agg, curr) => agg + curr[0],
			0,
		);
	}

	solvePart2(input: string[]) {
		const grids = input.join('\n').split('\n\n');

		return grids.map((g) => this.getValueForSmudged(g)).reduce((
			agg,
			curr,
		) => agg + curr);
	}

	getValueForSmudged(input: string) {
		const { original, variants } = this.getVariants(input);
		const originalSolution = this.resolve(
			original,
			this.getCandidates(original),
		);

		for (const variant of variants) {
			const resolved = this.resolve(variant, this.getCandidates(variant));
			const good = resolved.find((r) =>
				r !== 0 && r !== originalSolution[0]
			);
			if (good) {
				return good;
			}
		}

		throw new Error();
	}

	getVariants(input: string) {
		const variants = [];
		for (let i = 0; i < input.length; i++) {
			if (input[i] === '\n') {
				continue;
			}
			const tmp = input.split('');
			tmp[i] = (tmp[i] === '.') ? '#' : '.';
			variants.push(tmp.join(''));
		}

		return {
			original: this.parse([input])[0],
			variants: this.parse(variants),
		};
	}

	parse(input: string[]) {
		return input.map((g) => {
			const rows = g.split('\n').filter(Boolean);
			return {
				rows,
				columns: new Array(rows[0].length).fill(0).map((_, i) =>
					rows.map((r) => r[i]).join('')
				),
			};
		});
	}

	resolve(map: Map, candidates: Candidates) {
		const result = [];

		for (const row of candidates.rows) {
			if (this.check(map.rows, row)) {
				result.push((row + 1) * 100);
			}
		}

		for (const column of candidates.columns) {
			if (this.check(map.columns, column)) {
				result.push(column + 1);
			}
		}

		return result;
	}

	check(rowcols: string[], i: number) {
		for (let x = i; x >= 0; x--) {
			const y = i + i - x + 1;
			if (y > rowcols.length - 1) {
				return true;
			}

			if (rowcols[x] !== rowcols[y]) {
				return false;
			}
		}

		return true;
	}

	getCandidates(map: Map) {
		const rows = map.rows.map((r, i) => [r, i]).filter(([r, _], i, arr) =>
			i > 0 && r === arr[i - 1][0]
		).map(([_, i]) => (i as number - 1));
		const columns = map.columns.map((r, i) => [r, i]).filter((
			[r, _],
			i,
			arr,
		) => i > 0 && r === arr[i - 1][0]).map(([_, i]) => (i as number - 1));

		return { rows, columns };
	}
}
