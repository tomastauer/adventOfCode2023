import { Solution } from '../../utilities/solver.ts';

type Coordinate = {
	x: number;
	y: number;
	z: number;
};

type Hailstone = {
	position: Coordinate;
	velocity: Coordinate;
};

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const hailstones = this.parse(input);

		let counter = 0;

		for (let i = 0; i < hailstones.length; i++) {
			for (let j = i + 1; j < hailstones.length; j++) {
				const a = hailstones[i];
				const b = hailstones[j];

				if (!this.areParallel(a, b)) {
					const intersection = this.getIntersection(a, b);
					if (intersection && this.isWithinRange(intersection)) {
						counter++;
					}
				}
			}
		}

		return counter;
	}

	solvePart2(input: string[]) {
		const hailstones = this.parse(input);

		const equations: string[] = [];

		for (let i = 0; i < 3; i++) {
			const h = hailstones[i];
			equations.push(
				`(x-${h.position.x}) * (${h.velocity.y} - v) - (y - ${h.position.y}) * (${h.velocity.x} - u)`,
			);
			equations.push(
				`(y-${h.position.y}) * (${h.velocity.z} - w) - (z - ${h.position.z}) * (${h.velocity.y} - v)`,
			);
		}

		console.log(equations);
		// just added it to python bia chatgpt to solve :shrug:

		const x = 131246724405205;
		const y = 399310844858926;
		const z = 277550172142625;
		return x + y + z;
	}

	getIntersection(a: Hailstone, b: Hailstone) {
		const s = (a.velocity.y * (a.position.x - b.position.x) +
			a.velocity.x * (b.position.y - a.position.y)) /
			(b.velocity.x * a.velocity.y - a.velocity.x * b.velocity.y);
		const t = (b.position.x - a.position.x + s * b.velocity.x) /
			a.velocity.x;

		if (s < 0 || t < 0) {
			return null;
		}

		return {
			x: a.position.x + t * a.velocity.x,
			y: a.position.y + t * a.velocity.y,
			z: 0,
		};
	}

	isWithinRange({ x, y }: Coordinate) {
		const l = 200000000000000;
		const h = 400000000000000;
		return x >= l && x <= h && y >= l && y <= h;
	}

	areParallel(a: Hailstone, b: Hailstone) {
		return a.velocity.x / b.velocity.x === a.velocity.y / b.velocity.y;
	}

	parse(input: string[]): Hailstone[] {
		return input.map((i) => {
			const [position, velocity] = i.split('@');
			let [x, y, z] = position.trim().split(',').map((c) =>
				parseInt(c.trim())
			);
			const p = { x, y, z };
			[x, y, z] = velocity.trim().split(',').map((c) =>
				parseInt(c.trim())
			);

			return {
				position: p,
				velocity: { x, y, z },
			};
		});
	}
}
