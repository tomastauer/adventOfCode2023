import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const [[_, ...time], [__, ...distance]] = input.map((i) =>
			i.split(' ').map((j) => j.trim()).filter(Boolean).map((c) =>
				parseInt(c)
			)
		);

		const pairs = time.map((t, i) => ({ time: t, distance: distance[i] }));

		return pairs.map((p) => this.solveForPair(p.time, p.distance)).reduce((
			agg,
			curr,
		) => agg * curr);
	}

	solvePart2(input: string[]) {
		const [time, distance] = input.map((i) =>
			parseInt(i.replaceAll(' ', '').split(':')[1])
		);

		return this.solveForPair(time, distance);
	}

	solveForPair(time: number, distance: number) {
		const D = Math.sqrt(Math.pow(time, 2) - 4 * distance);
		const x1 = (time - D) / 2;
		const x2 = (time + D) / 2;

		let finalX1 = x1 === Math.trunc(x1) ? x1 + 1 : Math.ceil(x1);
		let finalX2 = x2 === Math.trunc(x2) ? x2 - 1 : Math.floor(x2);

		return finalX2 - finalX1 + 1;
	}
}
