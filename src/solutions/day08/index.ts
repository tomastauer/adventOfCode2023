import { gcd, lcm } from '../../utilities/math.ts';
import { Solution } from '../../utilities/solver.ts';
type Node = {
	root: string;
	left: string;
	right: string;
};

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const { parsedGraph, instructions } = this.parse(input);
		let counter = 0;
		let current = 'AAA';
		for (const { direction } of this.getGenerator(instructions)) {
			counter++;
			if (direction === 'L') {
				current = parsedGraph[current].left;
			} else {
				current = parsedGraph[current].right;
			}

			if (current === 'ZZZ') {
				break;
			}
		}

		return counter;
	}

	solvePart2(input: string[]) {
		const { parsedGraph, instructions } = this.parse(input);

		const roots = Object.keys(parsedGraph).filter((a) => a.endsWith('A'));
		const periods = roots.map((r) =>
			this.getPeriod(this.getGenerator(instructions), parsedGraph, r)
		);

		return lcm(periods.flatMap((p) => p!.endsWithZ));
	}

	getPeriod(
		generator: ReturnType<typeof this.getGenerator>,
		parsedGraph: Record<string, Node>,
		current: string,
	) {
		const visited = new Set<string>();
		const endsWithZ: number[] = [];

		let counter = 0;
		for (const { direction, i } of generator) {
			const key = `${current}_${i}`;
			if (visited.has(key)) {
				return {
					periodStartsAt: [...visited.keys()].indexOf(key),
					periodEndsAt: counter,
					endsWithZ,
				};
			}

			visited.add(key);

			counter++;
			if (direction === 'L') {
				current = parsedGraph[current].left;
			} else {
				current = parsedGraph[current].right;
			}

			if (current.endsWith('Z')) {
				endsWithZ.push(counter);
			}
		}
	}

	parse(input: string[]) {
		const [instructions, _, ...graph] = input;

		const parsedGraph = graph.reduce((agg, curr) => {
			const [_, root, left, right] = Array.from(
				/(?<root>\w{3}) = \((?<left>\w{3}), (?<right>\w{3})\)/gm.exec(
					curr,
				)!,
			);
			agg[root] = { root, left, right };
			return agg;
		}, {} as Record<string, Node>);

		return { instructions, parsedGraph };
	}

	*getGenerator(instructions: string) {
		let i = 0;
		while (true) {
			yield { direction: instructions[i], i };
			i = (i + 1) % instructions.length;
		}
	}
}
