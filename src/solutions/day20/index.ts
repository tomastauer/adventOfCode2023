import { Solution } from '../../utilities/solver.ts';

type FlipFlop = {
	type: 'ff';
	s: string;
	active: boolean;
	destinations: string[];
	state: 'off' | 'on';
};

type Broadcaster = {
	type: 'b';
	s: 'broadcaster';
	destinations: string[];
};

type Conjunction = {
	type: 'c';
	s: string;
	pulse: 'high' | 'low';
	destinations: string[];
	states: Record<string, 'high' | 'low'>;
};

type Module = FlipFlop | Broadcaster | Conjunction;
type Modules = Record<string, Module>;

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const parsed = this.parse(input);
		const total = {
			low: 0,
			high: 0,
		};
		for (let i = 0; i < 1000; i++) {
			const { low, high } = this.process(parsed);
			total.low += low;
			total.high += high;
		}

		return total.high * total.low;
	}

	solvePart2(input: string[]) {
		const parsed = this.parse(input);
		let counter = 0;
		let c: number[] = [];
		while (true) {
			counter++;
			const { rx } = this.process(parsed);

			if ((parsed.rn as Conjunction).pulse === 'low') {
				console.log('rn', counter);
			}

			if (counter % 500000 === 0) {
				console.log(counter);
			}
			const a = this.print(parsed, [
				'vp',
				'lj',
				'jq',
				'dt',
				'xk',
				'jm',
				'qt',
				'vk',
			]);
			if (a === '11111111') {
				console.log(counter);
				c.push(counter);
			}

			if (counter > 200000) {
				break;
			}

			if (rx) {
				break;
			}
		}

		c.forEach((v, i) => {
			if (i > 0) {
				console.log(v - c[i - 1]);
			}
		});

		return counter;
	}

	print(modules: Modules, s: string[]) {
		return s.map((e) => (modules[e] as FlipFlop).state === 'on' ? '1' : '0')
			.join('');
	}

	process(modules: Modules) {
		const queue: Module[] = [modules.broadcaster];

		let result = {
			low: 1,
			high: 0,
			rx: false,
		};
		let current = queue.shift();
		while (current) {
			let pulse: 'low' | 'high' = 'low';
			if (current.type === 'b') {
				pulse = 'low';
			}

			if (current.type === 'ff') {
				pulse = current.state === 'off' ? 'low' : 'high';
			}

			if (current.type === 'c') {
				pulse = Object.values(current.states).every((c) => c === 'high')
					? 'low'
					: 'high';
				current.pulse = pulse;
			}

			current.destinations.map((d) => {
				result[pulse]++;
				if (pulse === 'low' && current!.s === 'rx') {
					return { ...result, rx: true };
				}
				if (d === 'output') {
					console.log('output', pulse);
				} else {
					const r = this.iterate(modules, pulse, current!.s, d);
					if (r) {
						queue.push(r);
					}
				}
			});

			current = queue.shift();
		}

		return result;
	}

	iterate(
		modules: Modules,
		pulse: 'low' | 'high',
		s: string,
		destination: string,
	) {
		const dd = modules[destination];
		if (!dd) {
			return;
		}
		if (dd.type === 'ff') {
			const r = this.flipflop(dd, pulse);
			if (r) {
				return r;
			}
		}

		if (dd.type === 'c') {
			return this.conjunction(dd, s, pulse);
		}
	}

	flipflop(module: FlipFlop, pulse: 'low' | 'high') {
		if (pulse === 'high') {
			return;
		}

		module.state = module.state === 'off' ? 'on' : 'off';
		return module;
	}

	conjunction(module: Conjunction, source: string, pulse: 'low' | 'high') {
		module.states[source] = pulse;

		return module;
	}

	parse(input: string[]): Modules {
		const modules = input.map((i) => {
			const [s, d] = i.split(' -> ');
			const destinations = d.split(',').map((c) => c.trim());

			if (s.startsWith('%')) {
				return {
					type: 'ff',
					s: s.substring(1),
					destinations,
					state: 'off',
					active: false,
				};
			}

			if (s.startsWith('&')) {
				return {
					type: 'c',
					s: s.substring(1),
					destinations,
					states: {} as Record<string, 'low' | 'hight'>,
				};
			}

			return {
				type: 'b',
				s: 'broadcaster',
				destinations,
			};
		});

		modules.filter((m) => m.type === 'c').forEach((c) => {
			modules.filter((d) => d.destinations.includes(c.s)).forEach((q) => {
				c.states![q.s] = 'low';
			});
		});

		return modules.reduce((agg, curr) => {
			agg[curr.s] = curr as Module;
			return agg;
		}, {} as Record<string, Module>);
	}
}
