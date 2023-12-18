import { Solution } from '../../utilities/solver.ts';

type Row = {
	dist: number;
	dir: Direction;
};

type Direction = 'R' | 'L' | 'D' | 'U';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		return this.solve(this.parse(input));
	}

	solvePart2(input: string[]) {
		return this.solve(this.parse2(input));
	}

	solve(rows: Row[]) {
		let x = 0;
		let y = 0;
		let s = 0;
		let d = 0;

		const points: [number, number][] = [];
		rows.forEach((p) => {
			d += p.dist;
			const nextCorner = this.getNextCorner(p.dir, p.dist);
			const xn = x + nextCorner.x;
			const yn = y + nextCorner.y;

			s += x * yn - xn * y;
			x = xn;
			y = yn;
			points.push([x, y]);
		});

		return Math.abs(s) / 2 + d / 2 + 1;
	}

	getNextCorner(dir: Direction, dist: number) {
		switch (dir) {
			case 'D':
				return { x: 0, y: dist };
			case 'U':
				return { x: 0, y: -dist };
			case 'L':
				return { x: -dist, y: 0 };
			case 'R':
				return { x: dist, y: 0 };
		}
	}

	parse(input: string[]) {
		return input.map((i) => {
			const [dir, dist] = i.split(' ');

			return {
				dir: dir as Direction,
				dist: parseInt(dist),
			};
		});
	}

	parse2(input: string[]) {
		const dirs = ['R', 'D', 'L', 'U'];

		return input.map((i) => {
			const hex = i.split(' ')[2];
			const dist = parseInt(hex.substring(2, 7), 16);
			const direction = hex.substring(7, 8);

			return {
				dist,
				dir: dirs[direction as keyof typeof dirs] as Direction,
			};
		});
	}
}
