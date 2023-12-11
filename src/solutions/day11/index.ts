import { Solution } from '../../utilities/solver.ts';

type Galaxy = {
	id: number;
	x: number;
	y: number;
};

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const galaxies = this.expand(this.parse(input), 2);

		return this.getDistances(galaxies);
	}

	solvePart2(input: string[]) {
		const galaxies = this.expand(this.parse(input), 1000000);

		return this.getDistances(galaxies);
	}

	parse(input: string[]) {
		return input.map((i) => i.split(''));
	}

	getDistances(galaxies: Galaxy[]) {
		return galaxies.flatMap((g1, i, arr) =>
			arr.slice(i + 1).map((g2) =>
				Math.abs(g1.x - g2.x) + Math.abs(g1.y - g2.y)
			)
		).reduce((agg, curr) => agg + curr);
	}

	expand(grid: string[][], distance: number) {
		const addedRows = grid.map((g, i) => ({ g, i })).filter(({ g }) =>
			g.every((d) => d === '.')
		).map((g) => g.i);
		const addedColumns = new Array(grid[0].length).fill(0).map((_, i) => i)
			.filter((i) => grid.every((g) => g[i] === '.'));

		const galaxies: Galaxy[] = [];

		let expandedY = 0;
		let expandedX = 0;
		let id = 1;
		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y].length; x++) {
				if (grid[y][x] === '#') {
					galaxies.push({
						id,
						x: expandedX,
						y: expandedY,
					});

					id++;
				}

				expandedX++;
				if (addedColumns.includes(x)) {
					expandedX += distance - 1;
				}
			}
			expandedY++;
			if (addedRows.includes(y)) {
				expandedY += distance - 1;
			}
			expandedX = 0;
		}

		return galaxies;
	}
}
