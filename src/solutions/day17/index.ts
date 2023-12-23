import { get4AdjacentDirections } from '../../utilities/array.ts';
import { PriorityQueue } from '../../utilities/priorityQueue.ts';
import { Solution } from '../../utilities/solver.ts';

type Position = {
	x: number;
	y: number;
};

type Distance = number;

type Visit = {
	position: Position;
	direction: Position;
	distance: Distance;
};

type NextVisit = {
	visit: Visit;
	path: Position[];
	heatLoss: number;
};

type Visited = {
	heatLoss: number;
	path: Position[];
};

type City = {
	map: number[][];
	visitedHash: Set<string>;
	min: number;
};

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const parsed = this.parse(input);
		const queue = new PriorityQueue<NextVisit>();

		queue.push(0, {
			heatLoss: 0,
			visit: {
				direction: { x: 0, y: 0 },
				distance: 0,
				position: { x: 0, y: 0 },
			},
			path: [],
		});

		while (queue.some()) {
			const { visit, heatLoss } = queue.pop()!;
			const { distance, direction, position } = visit;

			if (
				position.x === parsed.map[0].length - 1 &&
				position.y === parsed.map.length - 1
			) {
				return heatLoss;
			}

			const key = this.serialize(visit);

			if (parsed.visitedHash.has(key)) {
				continue;
			}

			parsed.visitedHash.add(key);

			if (distance < 3 && (direction.x !== 0 || direction.y !== 0)) {
				const next = {
					x: position.x + direction.x,
					y: position.y + direction.y,
				};
				if (
					next.x >= 0 && next.x < parsed.map[0].length &&
					next.y >= 0 && next.y < parsed.map.length
				) {
					const totalLoss = heatLoss + parsed.map[next.y][next.x];
					queue.push(totalLoss, {
						heatLoss: totalLoss,
						path: [],
						visit: {
							direction,
							position: next,
							distance: distance + 1,
						},
					});
				}
			}

			get4AdjacentDirections().forEach(({ x, y }) => {
				if (
					(x === direction.x && y === direction.y) ||
					(x === -direction.x && y === -direction.y)
				) {
					return;
				}
				const next = { x: position.x + x, y: position.y + y };

				if (
					next.x >= 0 && next.x < parsed.map[0].length &&
					next.y >= 0 && next.y < parsed.map.length
				) {
					const totalLoss = heatLoss + parsed.map[next.y][next.x];
					queue.push(totalLoss, {
						heatLoss: totalLoss,
						path: [],
						visit: {
							direction: { x, y },
							position: next,
							distance: 1,
						},
					});
				}
			});
		}

		return 0;
	}

	solvePart2(input: string[]) {
		const parsed = this.parse(input);
		const queue = new PriorityQueue<NextVisit>();

		queue.push(0, {
			heatLoss: 0,
			visit: {
				direction: { x: 0, y: 0 },
				distance: 0,
				position: { x: 0, y: 0 },
			},
			path: [],
		});

		while (queue.some()) {
			const { visit, heatLoss } = queue.pop()!;
			const { distance, direction, position } = visit;

			if (
				position.x === parsed.map[0].length - 1 &&
				position.y === parsed.map.length - 1 && distance >= 4
			) {
				return heatLoss;
			}

			const key = this.serialize(visit);

			if (parsed.visitedHash.has(key)) {
				continue;
			}

			parsed.visitedHash.add(key);

			if (distance < 10 && (direction.x !== 0 || direction.y !== 0)) {
				const next = {
					x: position.x + direction.x,
					y: position.y + direction.y,
				};
				if (
					next.x >= 0 && next.x < parsed.map[0].length &&
					next.y >= 0 && next.y < parsed.map.length
				) {
					const totalLoss = heatLoss + parsed.map[next.y][next.x];
					queue.push(totalLoss, {
						heatLoss: totalLoss,
						path: [],
						visit: {
							direction,
							position: next,
							distance: distance + 1,
						},
					});
				}
			}

			if (distance >= 4 || (direction.x === 0 && direction.y === 0)) {
				get4AdjacentDirections().forEach(({ x, y }) => {
					if (
						(x === direction.x && y === direction.y) ||
						(x === -direction.x && y === -direction.y)
					) {
						return;
					}
					const next = { x: position.x + x, y: position.y + y };

					if (
						next.x >= 0 && next.x < parsed.map[0].length &&
						next.y >= 0 && next.y < parsed.map.length
					) {
						const totalLoss = heatLoss + parsed.map[next.y][next.x];
						queue.push(totalLoss, {
							heatLoss: totalLoss,
							path: [],
							visit: {
								direction: { x, y },
								position: next,
								distance: 1,
							},
						});
					}
				});
			}
		}

		return 0;
	}

	parse(input: string[]): City {
		const map = input.map((i) => i.split('').map((c) => parseInt(c)));

		return {
			map,
			visitedHash: new Set<string>(),
			min: Number.MAX_SAFE_INTEGER,
		};
	}

	serialize({ position, direction, distance }: Visit) {
		return [position.x, position.y, direction.x, direction.y, distance]
			.join('|');
	}
}
