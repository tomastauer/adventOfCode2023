import { addBorder } from '../../utilities/array.ts';
import { Solution } from '../../utilities/solver.ts';

type Position = {
	x: number;
	y: number;
}

type Direction = 'r' | 'l' | 'b' | 't';

type Distance = number;

type Visit = {
	position: Position;
	direction: Direction;
	distance: Distance;
}

type NextVisit = {
	visit: Visit;
	path: Position[];
	heatLoss: number;
}

type Visited = {
	heatLoss: number;
	path: Position[];
}


type City = {
	map: number[][];
	visited: Map<string, number>;
	visitedHash: Map<string, Visited>;
	min: number;
}

export default class Day01 implements Solution {
	solvePart1(input: string[]) {
		return 0;
		const parsed = this.parse(input);

		const turns: NextVisit[] = [{heatLoss: 0, visit: {direction: 'r', distance: 1, position: {x: 1, y:1}}, path: []}];

		let currentTurn = turns.shift();
		while(currentTurn) {

			turns.push(...this.move(parsed, currentTurn.visit, currentTurn.heatLoss, currentTurn.path));
			currentTurn = turns.pop();
		}

		return parsed.min - parsed.map[1][1];
	}

	solvePart2(input: string[]) {
		const parsed = this.parse(input);

		const turns: NextVisit[] = [{heatLoss: 0, visit: {direction: 'r', distance: 0, position: {x: 1, y:1}}, path: []}];

		let currentTurn = turns.shift();
		while(currentTurn) {

			turns.push(...this.move2(parsed, currentTurn.visit, currentTurn.heatLoss, currentTurn.path));
			currentTurn = turns.pop();
		}

		const q = Array.from(parsed.visitedHash.entries()).filter(([k]) => k.startsWith(`${parsed.map.length-2}|${parsed.map[0].length-2}`));
		q.sort(([,a],[,b]) => a.heatLoss - b.heatLoss);
		// console.log(q[0]);

		return parsed.min - parsed.map[1][1];
	}

	print(map: number[][], path: Position[]) {
		for(let y = 0; y < map.length; y++) {
			const line = [];
			for(let x = 0; x < map[y].length;x++) {
				if(path.some(p => p.x === x && p.y === y)) {
					line.push('X');
				} else {
					line.push(map[y][x]);
				}
			}
			console.log(line.join(''));
		}
	}



	parse(input: string[]): City {
		const map = addBorder(input.map(i => i.split('').map(c => parseInt(c))), 0, 1);

		return { map, visited: new Map<string, number>(), visitedHash: new Map<string, Visited>(), min: Number.MAX_SAFE_INTEGER};
	}

	move(city: City, current: Visit, heatLoss: number, path: Position[]) {
		const serialized = this.serialize(current);
		const existingVisit = city.visitedHash.get(serialized);
		const currentHeatLoss = city.map[current.position.y][current.position.x];
	
		const newHeatLoss = heatLoss + currentHeatLoss;

		if(current.position.y === city.map.length-2 && current.position.x === city.map[0].length-2) {
			if(newHeatLoss < city.min) {
				city.min = newHeatLoss;
			}
		}

		if(newHeatLoss >= city.min || currentHeatLoss === 0) {
			return [];
		}

		if(existingVisit && existingVisit.heatLoss <= newHeatLoss) {
			return[]
		} else {
			city.visitedHash.set(serialized, { path, heatLoss: newHeatLoss });
		}
			
		const nextVisits: NextVisit[] = [];
		this.getTurns(current.direction).forEach((d) => {
			nextVisits.push({visit: {direction: d, distance: 1, position: this.getNextPosition(current.position, d)}, heatLoss: newHeatLoss, path});
		})

		if(current.distance < 3) {
			nextVisits.push({visit: {direction: current.direction, distance: current.distance + 1 as Distance, position: this.getNextPosition(current.position, current.direction)}, heatLoss: newHeatLoss, path});
		}
		return nextVisits;
	}

	move2(city: City, current: Visit, heatLoss: number, path: Position[]) {
		const serialized = this.serialize(current);
		const existingVisit = city.visitedHash.get(serialized);
		const currentHeatLoss = city.map[current.position.y][current.position.x];
	
		const newHeatLoss = heatLoss + currentHeatLoss;

		if(current.position.y === city.map.length-2 && current.position.x === city.map[0].length-2) {
			if(newHeatLoss < city.min && current.distance >= 4) {
				console.log(newHeatLoss);
				city.min = newHeatLoss;
			}
		}

		if(newHeatLoss >= city.min || currentHeatLoss === 0) {
			return [];
		}

		if(existingVisit && existingVisit.heatLoss <= newHeatLoss) {
			return[]
		} else {
			city.visitedHash.set(serialized, { path, heatLoss: newHeatLoss });
		}
			
		const newPath = path; //[...path, current.position]
		const nextVisits: NextVisit[] = [];

		if(current.distance >= 4) {
			this.getTurns(current.direction).forEach((d) => {
				nextVisits.push({visit: {direction: d, distance: 1, position: this.getNextPosition(current.position, d)}, heatLoss: newHeatLoss, path: newPath});
			})
		}

		if(current.distance < 10) {
			nextVisits.push({visit: {direction: current.direction, distance: current.distance + 1, position: this.getNextPosition(current.position, current.direction)}, heatLoss: newHeatLoss, path: newPath});
		}
		return nextVisits;
	}

	getTurns(direction: Direction): Direction[] {
		switch(direction) {
			case 'b':
			case 't':
				return ['l', 'r'];
			case 'l':
			case 'r':
				return ['t','b'];
		}
	}

	getNextPosition(current: Position, direction: Direction) {
		switch(direction) {
			case 'b':
				return {x: current.x, y: current.y+1};
			case 't':
				return {x: current.x, y: current.y-1};
			case 'l':
				return {x: current.x - 1, y: current.y};
			case 'r':
				return {x: current.x + 1, y: current.y};
		}
	}

	serialize({position, direction, distance}: Visit) {
		return [position.x, position.y, direction, distance].join('|');
	}
}
