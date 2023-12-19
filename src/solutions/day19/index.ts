import { Solution } from '../../utilities/solver.ts';

type Range = {
	from: number;
	to: number;
};

type Item = {
	x: Range;
	m: Range;
	a: Range;
	s: Range;
};

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const parsed = this.parse(input);

		const evaluated = parsed.items.map((i) => {
			let result = '';
			let workflow = parsed.workflows['in'];

			while (result !== 'R' && result !== 'A') {
				for (const instruction of workflow) {
					const { x, m, a, s } = i;
					if (eval(instruction.predicate)) {
						result = instruction.destination;
						workflow = parsed.workflows[result];
						break;
					}
				}
			}

			return { i, result };
		});

		return evaluated.filter((e) => e.result === 'A').map((e) =>
			e.i.x + e.i.m + e.i.a + e.i.s
		).reduce((agg, curr) => agg + curr);
	}

	solvePart2(input: string[]) {
		const parsed = this.parse(input);

		const i: Item = {
			x: { from: 1, to: 4000 },
			m: { from: 1, to: 4000 },
			a: { from: 1, to: 4000 },
			s: { from: 1, to: 4000 },
		};

		const queue = [{ i, workflow: parsed.workflows['in'] }];

		let current = queue.pop();

		const results: { destination: string; item: Item }[] = [];
		while (current) {
			let item = current.i;
			for (const instruction of current.workflow) {
				const { left, right } = this.evalItem(
					instruction.predicate,
					item,
				);
				if (left) {
					if (['R', 'A'].includes(instruction.destination)) {
						results.push({
							destination: instruction.destination,
							item: left,
						});
					} else {
						queue.push({
							i: left,
							workflow: parsed.workflows[instruction.destination],
						});
					}
				}

				if (right) {
					item = right;
				}
			}

			current = queue.shift();
		}

		return results.filter((r) => r.destination === 'A').map(
			(r) => this.getCombinationsCount(r.item),
		).reduce((agg, curr) => agg + curr);
	}

	getCombinationsCount(item: Item) {
		return this.getRange(item.x) * this.getRange(item.m) *
			this.getRange(item.a) * this.getRange(item.s);
	}

	getRange(range: Range) {
		return range.to - range.from + 1;
	}

	evalItem(
		predicate: string,
		item: Item,
	): { left: Item | null; right: Item | null } {
		if (predicate === 'true') {
			return { left: item, right: null };
		}

		const [s, o, ...n] = predicate.split('') as [
			keyof typeof item,
			'<' | '>',
			string[],
		];
		const nn = parseInt(n.join(''));

		const left = JSON.parse(JSON.stringify(item));
		const right = JSON.parse(JSON.stringify(item));

		if (o === '>') {
			if (item[s].from < nn && item[s].to > nn) {
				left[s].from = nn + 1;
				right[s].to = nn;

				return {
					left,
					right,
				};
			}

			if (item[s].from > nn) {
				return { left, right: null };
			}

			if (item[s].to <= nn) {
				return { left: null, right };
			}
		} else {
			if (item[s].from < nn && item[s].to > nn) {
				left[s].to = nn - 1;
				right[s].from = nn;

				return {
					left,
					right,
				};
			}

			if (item[s].from >= nn) {
				return { left: null, right };
			}

			if (item[s].to < nn) {
				return { left, right: null };
			}
		}

		throw new Error();
	}

	parse(input: string[]) {
		const [workflows, items] = input.join('\n').split('\n\n');
		const parsedWorkflows = workflows.split('\n').map((w) => {
			const [name, instruction] = w.split('{');
			const instructions = instruction.replace('}', '').split(',').map(
				(i) => {
					if (i.includes(':')) {
						const [predicate, destination] = i.split(':');

						return {
							predicate,
							destination,
						};
					} else {
						return {
							predicate: 'true',
							destination: i,
						};
					}
				},
			);
			return { name, instructions };
		}).reduce((agg, curr) => {
			agg[curr.name] = curr.instructions;
			return agg;
		}, {} as Record<string, { predicate: string; destination: string }[]>);

		const parsedItems = items.split('\n').map((i) => {
			const [x, m, a, s] = Array.from(
				/{x=(?<x>\d+),m=(?<d>\d+),a=(?<a>\d+),s=(?<s>\d+)}/gm.exec(i)!,
			).slice(1).map((d) => parseInt(d));
			return { x, m, a, s };
		});

		return {
			workflows: parsedWorkflows,
			items: parsedItems,
		};
	}
}
