import { addBorder } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

type Direction = 'r' | 'l' | 't' | 'b';

type Position = { x: number; y: number };

type Visit = {
	position: Position;
	direction: Direction;
};

type Contraption = '.' | '/' | '\\' | '|' | '-' | '0';

type Map = {
	grid: Contraption[][];
	visited: Visit[];
	visitedHash: Set<string>;
};

export default class Day01 implements Solution {
	toVisit: Visit[] = [];

	solvePart1(input: string[]) {
		const parsed = this.parse(input);
		this.toVisit.push({ position: { x: 1, y: 1 }, direction: 'r' });
		this.visit(parsed);

		return this.countEnergized(parsed);
	}

	solvePart2(input: string[]) {
		const parsed = this.parse(input);

		const results: number[] = [];

		for (let x = 1; x < parsed.grid[0].length - 2; x++) {
			([[1, 'b'], [parsed.grid.length - 2, 't']] as const).forEach(
				([y, direction]) => {
					this.toVisit = [{ position: { x, y }, direction }];
					this.visit(parsed);
					results.push(this.countEnergized(parsed));

					parsed.visited = [];
					parsed.visitedHash.clear();
				},
			);
		}

		for (let y = 1; y < parsed.grid.length - 2; y++) {
			([[1, 'r'], [parsed.grid[0].length - 2, 'l']] as const).forEach(
				([x, direction]) => {
					this.toVisit = [{ position: { x, y }, direction }];
					this.visit(parsed);
					results.push(this.countEnergized(parsed));

					parsed.visited = [];
					parsed.visitedHash.clear();
				},
			);
		}

		return Math.max(...results);
	}

	countEnergized(map: Map) {
		return new Set(
			map.visited.filter((v) =>
				v.position.x !== 0 && v.position.x !== map.grid[0].length - 1 &&
				v.position.y !== 0 && v.position.y !== map.grid.length - 1
			).map((v) => `${v.position.x}|${v.position.y}`),
		).size;
	}

	visit(map: Map) {
		let toVisit = this.toVisit.pop();

		while (toVisit) {
			const { position, direction } = toVisit;

			map.visitedHash.add(this.serialize(position, direction));
			map.visited.push({
				direction,
				position,
			});

			const contraption = map.grid[position.y][position.x];

			if (contraption === '0') {
				toVisit = this.toVisit.pop();
				continue;
			}

			this.getNextPositions(contraption, direction).forEach((d) => {
				const movedPosition = this.move(position, d);

				if (!map.visitedHash.has(this.serialize(movedPosition, d))) {
					this.toVisit.push({
						position: movedPosition,
						direction: d,
					});
				}
			});

			toVisit = this.toVisit.pop();
		}
	}

	serialize(position: Position, direction: Direction) {
		return `${position.x}|${position.y}|${direction}`;
	}

	getNextPositions(c: Contraption, direction: Direction): Direction[] {
		switch (c) {
			case '.':
				return [direction];
			case '-':
				switch (direction) {
					case 'b':
					case 't':
						return ['l', 'r'];
					case 'l':
					case 'r':
						return [direction];
				}
			case '|':
				switch (direction) {
					case 'b':
					case 't':
						return [direction];
					case 'l':
					case 'r':
						return ['b', 't'];
				}
			case '/':
				switch (direction) {
					case 'r':
						return ['t'];
					case 'b':
						return ['l'];
					case 'l':
						return ['b'];
					case 't':
						return ['r'];
				}
			case '\\':
				switch (direction) {
					case 'r':
						return ['b'];
					case 'b':
						return ['r'];
					case 'l':
						return ['t'];
					case 't':
						return ['l'];
				}
			case '0':
				return [direction];
		}
	}

	move(position: Position, direction: Direction) {
		switch (direction) {
			case 'b':
				return { x: position.x, y: position.y + 1 };
			case 'l':
				return { x: position.x - 1, y: position.y };
			case 'r':
				return { x: position.x + 1, y: position.y };
			case 't':
				return { x: position.x, y: position.y - 1 };
		}
	}

	parse(input: string[]): Map {
		return {
			grid: addBorder(
				input.map((i) => i.split('')) as Contraption[][],
				'0',
				1,
			),
			visited: [],
			visitedHash: new Set<string>(),
		};
	}
}
