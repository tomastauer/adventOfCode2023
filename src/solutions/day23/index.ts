import { get4Adjacent } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

type Point = {
	x: number;
	y: number;
	visited: Set<string>;
};

type Node = {
	index: number;
	x: number;
	y: number;
	neighbors: { index: number; distance: number }[];
};

export default class Day01 implements Solution {
	visited = new Set<number>();

	solvePart1(input: string[]) {
		const map = this.parse(input);

		const queue: Point[] = [{ x: 1, y: 0, visited: new Set<string>() }];
		let current = queue.pop();
		const results = [];
		while (current) {
			const key = `${current.x}|${current.y}`;
			if (current.visited.has(key)) {
				current = queue.pop();
				continue;
			}

			if (
				current.x === map[0].length - 2 && current.y === map.length - 1
			) {
				results.push(current.visited.size);
			}

			current.visited.add(key);

			get4Adjacent(current.x, current.y).forEach(({ x, y }) => {
				if (
					x < 0 || x > map[0].length - 1 || y < 0 ||
					y > map.length - 1
				) {
					return;
				}

				const tile = map[y][x];
				const validPaths = [
					() => tile === '.',
					() => tile === '>' && current?.x === x - 1,
					() => tile === 'v' && current?.y === y - 1,
					() => tile === '<' && current?.x === x + 1,
					() => tile === '^' && current?.y === y + 1,
				];

				if (validPaths.some((p) => p())) {
					queue.push({
						x,
						y,
						visited: new Set<string>(current?.visited),
					});
				}
			});
			current = queue.pop();
		}

		return Math.max(...results);
	}

	traverseToNextNode(
		map: string[][],
		junctions: Node[],
		x: number,
		y: number,
		visited: Set<string>,
	) {
		const queue = [{ x, y, visited }];
		let current = queue.pop();
		while (current) {
			visited.add(`${current.x}|${current.y}`);
			const adjacent = get4Adjacent(current.x, current.y).filter((a) =>
				this.filterOutside(map, a.x, a.y)
			).filter((a) => map[a.y][a.x] !== '#');

			if (
				junctions.find((j) => j.x === current?.x && j.y === current.y)
			) {
				return { x: current.x, y: current.y, visited };
			}

			adjacent.forEach((a) => {
				const key = `${a.x}|${a.y}`;

				if (visited.has(key)) {
					return;
				}

				visited.add(key);
				queue.push({ x: a.x, y: a.y, visited });
			});
			current = queue.pop();
		}
	}

	solvePart2(input: string[]) {
		const map = this.parse(input);
		const junctions = this.findNodes(map);

		junctions.forEach((j, i) => {
			get4Adjacent(j.x, j.y).forEach(({ x, y }) => {
				if (
					x < 0 || x > map[0].length - 1 || y < 0 ||
					y > map.length - 1
				) {
					return;
				}

				const tile = map[y][x];
				if (tile !== '#') {
					const n = this.traverseToNextNode(
						map,
						junctions,
						x,
						y,
						new Set<string>([`${j.x}|${j.y}`]),
					)!;
					const nextJ = junctions.find((jj) =>
						jj.x === n.x && jj.y === n.y
					)!;
					j.neighbors.push({
						index: nextJ.index,
						distance: n.visited.size - 1,
					});
				}
			});
		});

		return this.traverse(junctions, 1, 0);
	}

	traverse(junctions: Node[], index: number, distance: number) {
		if (index === 2) {
			return 0;
		}

		const junction = junctions.find((j) => j.index === index)!;
		this.visited.add(index);
		let m = Number.MIN_SAFE_INTEGER;

		junction.neighbors.filter((n) => !this.visited.has(n.index)).forEach(
			(n) => {
				m = Math.max(
					m,
					this.traverse(junctions, n.index, distance) + n.distance,
				);
			},
		);

		this.visited.delete(index);
		return m;
	}

	filterOutside(map: string[][], x: number, y: number) {
		return !(x < 0 || x > map[0].length - 1 || y < 0 || y > map.length - 1);
	}

	findNodes(map: string[][]): Node[] {
		const junctions: Node[] = [];
		let counter = 3;

		for (let y = 1; y < map.length - 1; y++) {
			for (let x = 1; x < map[y].length - 1; x++) {
				if (map[y][x] === '#') {
					continue;
				}
				if (
					get4Adjacent(x, y).filter((v) => map[v.y][v.x] !== '#')
						.length > 2
				) {
					junctions.push({ x, y, index: counter, neighbors: [] });
					counter++;
				}
			}
		}

		junctions.push({ y: 0, x: 1, index: 1, neighbors: [] });
		junctions.push({
			y: map.length - 1,
			x: map[0].length - 2,
			index: 2,
			neighbors: [],
		});

		return junctions;
	}

	parse(input: string[]) {
		return input.map((i) => i.split(''));
	}
}
