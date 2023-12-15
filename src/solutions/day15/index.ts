import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	boxes: Record<number, { label: string; focalLength: number }[]> = {};

	solvePart1(input: string[]) {
		const commands = input[0].split(',');
		return commands.map((c) => this.hash(c)).reduce((agg, curr) =>
			agg + curr
		);
	}

	solvePart2(input: string[]) {
		const commands = input[0].split(',');
		commands.forEach((c) => this.moveLenses(c));

		return Object.entries(this.boxes).map(([key, value]) =>
			value.map((v, i) => (parseInt(key) + 1) * (i + 1) * v.focalLength)
				.reduce((agg, curr) => agg + curr, 0)
		).reduce((agg, curr) => agg + curr);
	}

	moveLenses(command: string) {
		if (command.includes('-')) {
			const [label] = command.split('-');
			const hash = this.hash(label);
			this.boxes[hash] = (this.boxes[hash] ?? []).filter((c) =>
				c.label !== label
			) || [];
		}

		if (command.includes('=')) {
			const [label, focalLenght] = command.split('=');
			const hash = this.hash(label);
			const lenses = (this.boxes[hash] = this.boxes[hash] ?? []);

			const labeledLenses = lenses.find((l) => l.label === label);
			if (labeledLenses) {
				labeledLenses.focalLength = parseInt(focalLenght);
			} else {
				lenses.push({ label, focalLength: parseInt(focalLenght) });
			}
		}
	}

	hash(input: string) {
		return input.split('').reduce((agg, curr) => {
			agg += curr.charCodeAt(0);
			agg *= 17;
			agg %= 256;

			return agg;
		}, 0);
	}
}
