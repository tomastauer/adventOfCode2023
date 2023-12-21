import { get4Adjacent } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

type Visit = {
	x: number;
	y: number;
	grid: Position;
	step: number;
};

type Point = Position & {
	grid: Position;
};

type Position = {
	x: number;
	y: number;
};

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const visited = this.solve(input, 64);
		return visited.filter((v) => v.step % 2 === 0).length;
	}

	solvePart2(input: string[]) {
		const visited = this.solve(input, 131);

		const fullEven =
			visited.filter((v) =>
				v.grid.x === 0 && v.grid.y === 0 && v.step % 2 === 0
			).length;
		const fullOdd =
			visited.filter((v) =>
				v.grid.x === 0 && v.grid.y === 0 && v.step % 2 === 1
			).length;
		const cornersEven =
			visited.filter((v) =>
				v.grid.x === 0 && v.grid.y === 0 && v.step % 2 === 0 &&
				v.step > 65
			).length;
		const cornersOdd =
			visited.filter((v) =>
				v.grid.x === 0 && v.grid.y === 0 && v.step % 2 === 1 &&
				v.step > 65
			).length;

		const n = (26501365 - 65) / 131;

		return (n + 1) * (n + 1) * fullOdd + n * n * fullEven -
			(n + 1) * cornersOdd + n * cornersEven;
	}

	solve(input: string[], steps: number) {
		const { x, y, grid } = this.parse(input);

		const visited: Visit[] = [];
		let queue: Point[] = [{ x, y, grid: { x: 0, y: 0 } }];
		const visitedHash = new Set<string>();

		for (let i = 0; i <= steps; i++) {
			const newQueue: Point[] = [];
			const newSet = new Set<string>();
			queue.forEach((q) => {
				visitedHash.add(this.serialize(q));
				visited.push({ x: q.x, y: q.y, grid: q.grid, step: i });

				const adjacent = get4Adjacent(q.x, q.y).map((c) => {
					let x = c.x;
					let y = c.y;
					let gx = q.grid.x;
					let gy = q.grid.y;

					if (c.x < 0) {
						x = grid[0].length - 1;
						gx = gx - 1;
					} else if (c.x === grid[0].length) {
						x = 0;
						gx = gx + 1;
					}

					if (c.y < 0) {
						y = grid.length - 1;
						gy = gy - 1;
					} else if (c.y === grid.length) {
						y = 0;
						gy = gy + 1;
					}

					return {
						x,
						y,
						grid: {
							x: gx,
							y: gy,
						},
					};
				});

				adjacent.forEach((a) => {
					const serialized = this.serialize(a);
					if (
						!visitedHash.has(serialized) &&
						grid[a.y][a.x] !== '#' && !newSet.has(serialized)
					) {
						newQueue.push(a);
						newSet.add(serialized);
					}
				});
			});
			newSet.clear();
			queue = newQueue;
		}

		return visited;
	}

	parse(input: string[]) {
		let y = 0;
		let x = 0;

		const grid = input.map((r, i) => {
			const row = r.split('');
			if (row.includes('S')) {
				y = i;
				x = row.indexOf('S');
			}
			return row;
		});

		return { grid, x, y };
	}

	serialize(point: Point) {
		return `${point.grid.x}|${point.grid.y}|${point.x}|${point.y}`;
	}
}
