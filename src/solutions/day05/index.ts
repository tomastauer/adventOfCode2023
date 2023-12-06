import { partitionBy } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const parsed = this.parse(input);

		const result = parsed.seeds.map((s) =>
			parsed.mappings.reduce((agg, curr) => this.visit(agg, curr), s)
		);

		return Math.min(...result);
	}

	solvePart2(input: string[]) {
		const parsed = this.parse(input);
		const parsedSeeds = this.getSeedRanges(input[0]);

		let r = Number.MAX_SAFE_INTEGER;
		for (const parsedSeed of parsedSeeds) {
			for (let i = parsedSeed.from; i <= parsedSeed.to; i++) {
				const d = parsed.mappings.reduce(
					(agg, curr) => this.visit(agg, curr),
					i,
				);
				if (d < r) {
					r = d;
				}
			}
		}

		return r;
	}

	getMapping(mappingString: string) {
		const [, ...mapping] = mappingString.split('\n');

		const mappings = mapping.map((m) =>
			m.split(' ').map((c) => parseInt(c))
		).map(([target, source, range]) => {
			return (n: number) => {
				if (n < source || n >= source + range) {
					return -1;
				}

				return target + n - source;
			};
		});

		mappings.push((n: number) => n);

		return mappings;
	}

	visit(input: number, mappings: ((n: number) => number)[]) {
		for (const map of mappings) {
			const r = map(input);
			if (r !== -1) {
				return r;
			}
		}

		throw new Error();
	}

	parse(input: string[]) {
		const [
			seeds,
			seed2soil,
			soil2fertilizer,
			fertilizer2water,
			water2light,
			light2temperature,
			temperature2humidity,
			humidity2location,
		] = input.join('\n').split('\n\n');

		return {
			seeds: seeds.split(':')[1].split(' ').map((c) => c.trim()).filter(
				Boolean,
			).map((c) => parseInt(c)),
			mappings: [
				this.getMapping(seed2soil),
				this.getMapping(soil2fertilizer),
				this.getMapping(fertilizer2water),
				this.getMapping(water2light),
				this.getMapping(light2temperature),
				this.getMapping(temperature2humidity),
				this.getMapping(humidity2location),
			],
		};
	}

	getSeedRanges(seeds: string) {
		const [left, right] = partitionBy(
			seeds.split(':')[1].trim().split(' ').map((c) =>
				parseInt(c.trim())
			),
			(_, i) => i % 2 === 0,
		);
		return left.map((from, i) => ({ from, to: from + right[i] - 1 }));
	}
}
