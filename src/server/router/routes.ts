import { createRouter } from "./context";
import { z } from "zod";

const questionsRouter = createRouter()
	.query("getAll", {
		async resolve() {
			return await prisma?.pollQuestions.findMany();
		}
	})
	.query("getById", {
		input: z.object({
			id: z.string(),
		}),
		async resolve({ input }) {
			return await prisma?.pollQuestions.findUnique({
				where: {
					id: input.id,
				}
			});
		}
	})
	.mutation("add", {
		input: z.object({
			question: z.string().min(5).max(1000),
			options: z.string().array().min(2).max(10)
		}),
		async resolve({ input }) {
			await prisma?.pollQuestions.create({
				data: {
					question: input.question,
					options: input.options
				}
			});
		}
	});

const votesRouter = createRouter();

export {
	votesRouter,
	questionsRouter
};
