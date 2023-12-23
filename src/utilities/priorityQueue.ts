export class PriorityQueue<T> {
	indexMap: Map<number, T[]> = new Map<number, T[]>();
	min: number = Number.MAX_SAFE_INTEGER;

	push(metric: number, item: T) {
		const current = this.indexMap.get(metric);

		if (current) {
			current.push(item);
		} else {
			this.indexMap.set(metric, [item]);
			this.min = Math.min(metric, this.min);
		}
	}

	pop() {
		const current = this.indexMap.get(this.min);
		if (!current) {
			return null;
		}

		const result = current.shift();
		if (!current.length) {
			this.indexMap.delete(this.min);
			this.min = Math.min(...this.indexMap.keys());
		}

		return result;
	}

	some() {
		return this.indexMap.size > 0;
	}
}
