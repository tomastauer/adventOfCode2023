import { addBorder, groupBy } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

type PartNumber = {
	id: number;
	adjacentTo: number;
	x: number;
	y: number;
};

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const grid = addBorder(
			input.map((i) => i.split('')),
			'.',
			1,
		);

		const parsed = this.parse(grid);

		return parsed
			.filter((p) => p.adjacentTo >= 0)
			.reduce((agg, curr) => agg + curr.id, 0);
	}

	solvePart2(input: string[]) {
		const grid = addBorder(
			input.map((i) => i.split('')),
			'.',
			1,
		);

		const parsed = this.parse(grid);

		return Object.values(
			groupBy(
				parsed
					.filter((p) => p.adjacentTo >= 0)
					.filter((p) =>
						parsed.find((q) =>
							q.adjacentTo === p.adjacentTo && q.id !== p.id
						)
					),
				(p) => p.adjacentTo,
			),
		)
			.map(([v0, v1]) => v0.id * v1.id)
			.reduce((agg, curr) => agg + curr, 0);
	}

	isNumber(char: string) {
		return char.match(/\d/);
	}

	parse(grid: string[][]) {
		const numbers: PartNumber[] = [];
		const width = grid.length;

		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y].length; x++) {
				if (this.isNumber(grid[y][x])) {
					const n = [grid[y][x]];

					let width = 0;
					while (this.isNumber(grid[y][x + width])) {
						width++;
						n.push(grid[y][x + width]);
					}

					numbers.push({
						id: parseInt(n.join('')),
						adjacentTo: -1,
						x,
						y,
					});

					x = x + width;
				}
			}
		}

		numbers.forEach((n) => {
			for (let y = n.y - 1; y <= n.y + 1; y++) {
				for (
					let x = n.x - 1;
					x < n.x + n.id.toString().length + 1;
					x++
				) {
					if (!this.isNumber(grid[y][x]) && grid[y][x] !== '.') {
						n.adjacentTo = width * y + x;
					}
				}
			}
		});

		return numbers;
	}
}
