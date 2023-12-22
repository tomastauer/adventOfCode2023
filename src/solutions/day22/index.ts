import { Solution } from '../../utilities/solver.ts';

type Point = {
	x: number;
	y: number;
	z: number;
};

type Brick = {
	index: number;
	from: Point;
	to: Point;
	supports: Brick[];
	supportedBy: Brick[];
	fixed: boolean;
	totalSupport: number;
	above: Set<number>;
};

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const bricks = this.parse(input).toSorted((a, b) =>
			a.from.z - b.from.z
		);

		return this.solve(bricks).filter((f) =>
			!f.supports.length ||
			f.supports.every((s) => s.supportedBy.length >= 2)
		).length;
	}

	solvePart2(input: string[]) {
		const bricks = this.parse(input).toSorted((a, b) =>
			a.from.z - b.from.z
		);

		const solved = this.solve(bricks);

		return solved.map((s) => {
			const falling = new Set<number>([s.index]);
			this.traverse(s, falling);

			return falling.size - 1;
		}).reduce((agg, curr) => agg + curr, 0);
	}

	traverse(brick: Brick, falling: Set<number>) {
		brick.supports.filter((b) =>
			b.supportedBy.every((r) => falling.has(r.index))
		).forEach((b) => {
			falling.add(b.index);
			this.traverse(b, falling);
		});
	}

	solve(bricks: Brick[]) {
		const fixedBricks: Brick[] = [];

		for (const brick of bricks) {
			if (brick.from.z === 1) {
				brick.fixed = true;
				fixedBricks.push(brick);
				continue;
			}

			const support = fixedBricks.filter((a) =>
				this.isBrickUnder(a, brick)
			).toSorted((b, a) => a.to.z - b.to.z);
			const firstSupport = support[0];
			const directSupports = support.filter((s) =>
				s.to.z === firstSupport.to.z
			);

			if (!support.length) {
				brick.to.z = brick.to.z - brick.from.z + 1;
				brick.from.z = 1;
				brick.fixed = true;
				fixedBricks.push(brick);
				continue;
			}

			directSupports.forEach((b) => b.supports.push(brick));
			brick.supportedBy.push(...directSupports);
			brick.to.z = brick.to.z - brick.from.z + 1 + firstSupport.to.z;
			brick.from.z = 1 + firstSupport.to.z;
			fixedBricks.push(brick);
		}

		return fixedBricks;
	}

	isBrickUnder(a: Brick, b: Brick) {
		const aCubes = this.getCubes(a);
		const bCubes = this.getCubes(b);
		return aCubes.some((c) =>
			bCubes.find((d) => c.x === d.x && c.y === d.y)
		);
	}

	getCubes(brick: Brick) {
		const result: Point[] = [];

		for (let x = brick.from.x; x <= brick.to.x; x++) {
			for (let y = brick.from.y; y <= brick.to.y; y++) {
				for (let z = brick.from.z; z <= brick.to.z; z++) {
					result.push({
						x,
						y,
						z,
					});
				}
			}
		}

		return result;
	}

	parse(input: string[]): Brick[] {
		return input.map((i, idx) => {
			const [from, to] = i.split('~');
			const [fx, fy, fz] = from.split(',').map((c) => parseInt(c));
			const [tx, ty, tz] = to.split(',').map((c) => parseInt(c));

			return {
				from: {
					x: fx,
					y: fy,
					z: fz,
				},
				to: {
					x: tx,
					y: ty,
					z: tz,
				},
				supportedBy: [],
				supports: [],
				fixed: false,
				index: idx + 1,
				totalSupport: -1,
				above: new Set<number>(),
			};
		});
	}
}
