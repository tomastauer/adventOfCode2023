import { groupBy } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	hands = ['five', 'four', 'fullhouse', 'three', 'twoPairs', 'pair', 'high'];
	cards = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
	cards2 = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

	solvePart1(input: string[]) {
		const parsed = this.parse(input);

		return parsed
			.sort((a, b) => a.order - b.order)
			.reduce((agg, curr, i) => agg + curr.points * (i + 1), 0);
	}

	solvePart2(input: string[]) {
		const parsed = this.parse2(input);

		return parsed
			.sort((a, b) => a.order - b.order)
			.reduce((agg, curr, i) => agg + curr.points * (i + 1), 0);
	}

	parse(input: string[]) {
		const checks = [
			this.isFiveOfAKind.bind(this),
			this.isFourOfAKind.bind(this),
			this.isFullHouse.bind(this),
			this.isThreeOfAKind.bind(this),
			this.isTwoPairs.bind(this),
			this.isPair.bind(this),
			this.getHighCard.bind(this),
		];

		return input.map((i) => {
			const [hand, points] = i.split(' ');
			const v = checks.find((c) => c(hand) !== null)!(hand)!;

			return {
				hand,
				points: parseInt(points),
				v,
				order: parseInt(
					`${this.hands.length - this.hands.indexOf(v.type)}${
						this.getHandOrder(
							hand,
							this.cards,
						)
					}`,
				),
			};
		});
	}

	parse2(input: string[]) {
		const checks = [
			this.isFiveOfAKind.bind(this),
			this.isFourOfAKind.bind(this),
			this.isFullHouse.bind(this),
			this.isThreeOfAKind.bind(this),
			this.isTwoPairs.bind(this),
			this.isPair.bind(this),
			this.getHighCard.bind(this),
		];

		const otherCards = this.cards.filter((c) => c !== 'J');

		return input.map((i) => {
			const [hand, points] = i.split(' ');

			if (hand.includes('J')) {
				let possibleHands = [hand];

				while (possibleHands[0].includes('J')) {
					possibleHands = possibleHands.flatMap((h) =>
						otherCards.map((o) => h.replace('J', o))
					);
				}

				const a = possibleHands.map(
					(p) =>
						this.hands.length -
						this.hands.indexOf(
							checks.find((c) => c(p) !== null)!(p)?.type!,
						),
				);
				let maxHand = 0;
				for (let i = 0; i < a.length; i++) {
					if (a[i] > maxHand) {
						maxHand = a[i];
					}
				}

				return {
					hand,
					points: parseInt(points),
					order: parseInt(
						`${maxHand}${this.getHandOrder(hand, this.cards2)}`,
					),
				};
			} else {
				const v = checks.find((c) => c(hand) !== null)!(hand)!;

				return {
					hand,
					points: parseInt(points),
					v,
					order: parseInt(
						`${this.hands.length - this.hands.indexOf(v.type)}${
							this.getHandOrder(hand, this.cards2)
						}`,
					),
				};
			}
		});
	}

	getHandOrder(hand: string, cards: string[]) {
		return hand
			.split('')
			.map((h) => cards.length - cards.indexOf(h))
			.map((h) => h.toString().padStart(2, '0'))
			.join('');
	}

	isNOfAKind(input: string, n: number) {
		return input
			.split('')
			.find((v, _, a) => a.filter((q) => q === v).length === n);
	}

	isFiveOfAKind(input: string) {
		const r = this.isNOfAKind(input, 5);
		if (r) {
			return { type: 'five', v: r };
		}
		return null;
	}

	isFourOfAKind(input: string) {
		const r = this.isNOfAKind(input, 4);

		if (r) {
			return { type: 'four', v: r };
		}
		return null;
	}

	isThreeOfAKind(input: string) {
		const r = this.isNOfAKind(input, 3);

		if (r) {
			return { type: 'three', v: r };
		}
		return null;
	}

	getPairs(input: string) {
		const grouped = groupBy(input.split(''), (i) => i);
		return Object.values(grouped)
			.filter((g) => g.length === 2)
			.map((c) => c[0]);
	}

	isFullHouse(input: string) {
		const pairs = this.getPairs(input);
		const three = this.isThreeOfAKind(input);

		if (pairs.length === 1 && three) {
			return {
				type: 'fullhouse',
			};
		}

		return null;
	}

	isTwoPairs(input: string) {
		const r = this.getPairs(input);

		if (r.length === 2) {
			return {
				type: 'twoPairs',
				v: r,
			};
		}

		return null;
	}

	isPair(input: string) {
		const r = this.getPairs(input);

		if (r.length === 1) {
			return {
				v: r[0],
				type: 'pair',
			};
		}

		return null;
	}

	getHighCard(input: string) {
		const r = this.cards[
			Math.min(...input.split('').map((i) => this.cards.indexOf(i)))
		];

		return {
			type: 'high',
			v: r,
		};
	}
}
