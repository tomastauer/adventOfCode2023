import { Solution } from '../../utilities/solver.ts';

type Node = {
	name: string;
	neighbors: Node[];
};

type Nodes = Record<string, Node>;

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		const parsed = this.parse(input);

		const shortestPaths = Object.values(parsed).map((c) =>
			this.findShortestMap(c)
		);
		const mostCommonlyVisitedNodes = this.getMostCommonlyVisitedNodes(
			shortestPaths,
		);
		const pathsToBreak = this.pickNodes(mostCommonlyVisitedNodes, parsed);
		this.breakPaths(parsed, pathsToBreak);

		const groupA = this.findShortestMap(parsed[pathsToBreak[0][0]]);
		const groupB = this.findShortestMap(parsed[pathsToBreak[0][1]]);

		return Object.keys(groupA).length * Object.keys(groupB).length;
	}

	solvePart2(input: string[]) {
		return 0;
	}

	getMostCommonlyVisitedNodes(paths: Record<string, Set<string>>[]) {
		const longest = paths.flatMap((d) =>
			Object.values(d).map((c) => Array.from(c)).sort((b, a) =>
				a.length - b.length
			).filter((c, _, a) => c.length === a[0].length)
		);

		const memo: Record<string, number> = {};

		longest.flat().forEach((d) => {
			if (memo[d]) {
				memo[d]++;
			} else {
				memo[d] = 1;
			}
		});

		return memo;
	}

	pickNodes(mostCommonlyVisitedNodes: Record<string, number>, nodes: Nodes) {
		const pathsToBreak: string[][] = [];
		let candidates = Object.entries(mostCommonlyVisitedNodes).sort((
			[, a],
			[, b],
		) => b - a).map(([a]) => a);

		const used = new Set<string>();
		while (used.size < 6) {
			const top = candidates.shift()!;
			const neighbor = nodes[top].neighbors.filter((n) =>
				candidates.includes(n.name)
			).toSorted((a, b) =>
				candidates.indexOf(a.name) - candidates.indexOf(b.name)
			)[0];
			candidates = candidates.filter((c) => c !== neighbor.name);

			used.add(top);
			used.add(neighbor.name);

			pathsToBreak.push([top, neighbor.name]);
		}

		return pathsToBreak;
	}

	breakPaths(nodes: Nodes, pathsToBreak: string[][]) {
		pathsToBreak.forEach(([nodeA, nodeB]) => {
			nodes[nodeA].neighbors = nodes[nodeA].neighbors.filter((n) =>
				n.name !== nodeB
			);
			nodes[nodeB].neighbors = nodes[nodeB].neighbors.filter((n) =>
				n.name !== nodeA
			);
		});
	}

	findShortestMap(node: Node) {
		const processed = new Set<string>();
		const queue = [...node.neighbors.map((n) => ({
			node: n,
			visited: new Set<string>([n.name]),
		}))];
		const paths: Record<string, Set<string>> = {};

		let current = queue.shift();
		while (current) {
			processed.add(current.node.name);
			current.node.neighbors.forEach((n) => {
				if (processed.has(n.name)) {
					return;
				}

				queue.push({
					node: n,
					visited: new Set<string>([...current!.visited, n.name]),
				});
			});

			paths[current.node.name] = current.visited;
			current = queue.shift();
		}

		return paths;
	}

	parse(input: string[]) {
		const result: Nodes = {};
		input.forEach((i) => {
			const [root, o] = i.split(': ');
			const others = o.split(' ');

			const rootNode = result[root] ?? { name: root, neighbors: [] };
			others.forEach((o) => {
				const node = result[o] ?? { name: o, neighbors: [] };
				if (!rootNode.neighbors.find((c) => c.name === o)) {
					rootNode.neighbors.push(node);
				}
				if (!node.neighbors.find((c) => c.name === rootNode.name)) {
					node.neighbors.push(rootNode);
				}

				result[o] = node;
			});

			result[root] = rootNode;
		});

		return result;
	}
}
