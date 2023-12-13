import { Solution } from '../../utilities/solver.ts';

type Row = {
	row: string;
	numbers: number[];
};

export default class Day01 implements Solution {
	memoized = new Map<string, number>();

	solvePart1(input: string[]) {
		return this.parse(input).map((p) => this.calculate(p)).reduce((
			agg,
			curr,
		) => agg + curr);
	}

	solvePart2(input: string[]) {
		return this.parse(input).map((p) => ({
			row: new Array(5).fill(0).map(() => p.row).join('?'),
			numbers: new Array(5).fill(0).flatMap(() => p.numbers),
		})).map((p) => this.calculate(p)).reduce((agg, curr) => agg + curr);
	}

	calculate({ row, numbers }: Row) {
		if (!row.length) {
			return numbers.length ? 0 : 1;
		}

		if (!numbers.length) {
			return row.includes('#') ? 0 : 1;
		}

		const key = `${row}_${numbers.join(',')}`;

		if (this.memoized.has(key)) {
			return this.memoized.get(key)!;
		}

		let result = 0;

		if (['.', '?'].includes(row[0])) {
			result += this.calculate({ row: row.substring(1), numbers });
		}

		const cn = numbers[0];

		if (
			['#', '?'].includes(row[0]) &&
			!row.substring(0, cn).includes('.') &&
			(['.', '?'].includes(row[cn]) || row.length === cn)
		) {
			result += this.calculate({
				row: row.substring(cn + 1),
				numbers: numbers.slice(1),
			});
		}

		this.memoized.set(key, result);

		return result;
	}

	parse(input: string[]) {
		return input.map((i) => {
			const [row, n] = i.split(' ');

			return {
				row,
				numbers: n.split(',').map((p) => parseInt(p)),
			};
		});
	}
}
