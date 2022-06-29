import { createRouter } from "./context";
import { z } from "zod";

export const pollsRouter = createRouter().query("getAllQuestions", {
	async resolve() {
		return await prisma?.pollQuestions.findMany();
	}
});

