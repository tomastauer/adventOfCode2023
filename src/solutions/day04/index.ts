import { groupBy } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const parsed = input.map(this.parse);

		return parsed.map((p) => p.my.filter((q) => p.winning.includes(q)))
			.filter((q) => q.length).map((q) => Math.pow(2, q.length - 1))
			.reduce((agg, curr) => agg + curr);
	}

	solvePart2(input: string[]) {
		const parsed = input.map(this.parse);
		const grouped = groupBy(parsed, (p) => p.id);

		parsed.forEach((p) => {
			const wins = p.my.filter((q) => p.winning.includes(q)).length;
			for (let x = 1; x <= wins; x++) {
				const item = grouped[(p.id + x).toString()][0];
				item.copies = item.copies + p.copies;
			}
		});

		return parsed.reduce((agg, curr) => agg + curr.copies, 0);
	}

	parse(input: string) {
		const [card, numbers] = input.split(':');
		const cardId = parseInt(card.substring(4).trim());
		const [winning, my] = numbers.split('|').map((c) =>
			c.trim().split(' ').map((d) => d.trim()).filter(Boolean).map((d) =>
				parseInt(d)
			)
		);

		return {
			id: cardId,
			copies: 1,
			winning,
			my,
		};
	}
}
