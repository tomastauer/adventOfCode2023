import { Solution } from "../../utilities/solver.ts";

export default class Day01 implements Solution {
  solvePart1(input: string[]) {
    const parsed =this.parse(input);

    return parsed
      .filter((p) => p.rgb.red <= 12 && p.rgb.green <= 13 && p.rgb.blue <= 14)
      .reduce((agg, curr) => agg + curr.id, 0);
  }

  solvePart2(input: string[]) {
    const parsed =this.parse(input);

    return parsed.reduce((agg, curr) => agg + curr.rgb.red * curr.rgb.blue * curr.rgb.green, 0);
  }

  parse(input: string[]) {
	return input.map((i) => {
		const [gameId, gameParam] = i.split(":");
		const id = parseInt(gameId.split(" ")[1]);
		const rgb: Record<string, number> = { blue: 0, green: 0, red: 0 };
		gameParam.split(";").map((p) =>
		  p
			.split(",")
			.map((q) => q.trim())
			.forEach((c) => {
			  const [n, cl] = c.split(" ");
			  rgb[cl] = Math.max(parseInt(n), rgb[cl]);
			})
		);
  
		return { id, rgb };
	  });
  }
}
