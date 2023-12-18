import { addBorder } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

const parts = {
	'-': { 'L': 'R', 'R': 'L' },
	'|': { 'D': 'T', 'T': 'D' },
	'L': { 'T': 'R', 'R': 'T' },
	'J': { 'T': 'L', 'L': 'T' },
	'F': { 'D': 'R', 'R': 'D' },
	'7': { 'L': 'D', 'D': 'L' },
};

type Pipe = '|' | '-' | 'L' | 'J' | 'F' | '7';
type Direction = 'L' | 'D' | 'R' | 'T';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const grid = addBorder(input.map((i) => i.split('')), '.', 1);
		const start = this.findStart(grid);
		let next = this.findStartDirection(grid, start);

		let counter = 1;
		while (grid[next.y][next.x] !== 'S') {
			next = this.walk(grid, next.dir, next);
			counter++;
		}

		return counter / 2;
	}

	solvePart2(input: string[]) {
		const grid = addBorder(input.map((i) => i.split('')), '.', 1);
		const start = this.findStart(grid);
		let next = this.findStartDirection(grid, start);

		const path = [next];
		while (grid[next.y][next.x] !== 'S') {
			next = this.walk(grid, next.dir, next);
			path.push(next);
		}

		let xx = false;
		let yy = false;

		for (let y = 0; y < grid.length; y++) {
			xx = false;
			let lopen = false;
			let fopen = false;
			for (let x = 0; x < grid[y].length; x++) {
				if (xx && !path.find((p) => p.x === x && p.y === y)) {
					grid[y][x] = 'x';
				}

				if (path.find((p) => p.x === x && p.y === y)) {
					switch (grid[y][x]) {
						case '|':
							xx = !xx;
							break;
						case 'L':
							lopen = true;
							break;
						case 'F':
							fopen = true;
							break;
						case 'J':
							if (fopen) {
								xx = !xx;
							}
							lopen = false;
							fopen = false;
							break;
						case '7':
							if (lopen) {
								xx = !xx;
							}
							lopen = false;
							fopen = false;
							break;
					}
				}
			}
		}

		let counter = 0;

		for (let x = 0; x < grid[0].length; x++) {
			yy = false;
			let fopen = false;
			let sopen = false;
			for (let y = 0; y < grid.length; y++) {
				if (yy && grid[y][x] === 'x') {
					grid[y][x] = 'y';
					counter++;
				}

				if (path.find((p) => p.x === x && p.y === y)) {
					switch (grid[y][x]) {
						case '-':
							yy = !yy;
							break;
						case '7':
							sopen = true;
							break;
						case 'F':
							fopen = true;
							break;
						case 'J':
							if (fopen) {
								yy = !yy;
							}
							sopen = false;
							fopen = false;
							break;
						case 'L':
							if (sopen) {
								yy = !yy;
							}
							sopen = false;
							fopen = false;
							break;
					}
				}
			}
		}

		return counter;
	}

	walk(
		grid: string[][],
		before: Direction,
		{ x, y }: { x: number; y: number },
	) {
		const current = grid[y][x] as unknown as Pipe;

		const from = this.swapDirection(before);
		const nextDirection =
			(parts[current] as any)[from] as unknown as Direction;
		const next = this.mapDirection(nextDirection);

		return { x: x + next.x, y: y + next.y, dir: nextDirection };
	}

	findStart(grid: string[][]) {
		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y].length; x++) {
				if (grid[y][x] === 'S') {
					return { y, x };
				}
			}
		}
		return { x: 0, y: 0 };
	}

	findStartDirection(
		grid: string[][],
		{ x, y }: { x: number; y: number },
	): { x: number; y: number; dir: Direction } {
		if (['F', '7', '|'].includes(grid[y - 1][x])) {
			return { x, y: y - 1, dir: 'T' };
		}

		if (['F', 'L', '-'].includes(grid[y][x - 1])) {
			return { x: x - 1, y, dir: 'L' };
		}

		if (['|', 'L', 'J'].includes(grid[y + 1][x])) {
			return { x, y: y + 1, dir: 'D' };
		}

		return { x: x + 1, y, dir: 'R' };
	}

	swapDirection(direction: Direction) {
		switch (direction) {
			case 'L':
				return 'R';
			case 'D':
				return 'T';
			case 'R':
				return 'L';
			case 'T':
				return 'D';
		}
	}

	mapDirection(direction: Direction) {
		switch (direction) {
			case 'L':
				return { x: -1, y: 0 };
			case 'R':
				return { x: 1, y: 0 };
			case 'D':
				return { x: 0, y: 1 };
			case 'T':
				return { x: 0, y: -1 };
		}
	}
}
