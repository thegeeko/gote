import { createRouter } from "./context";
import { z } from "zod";

const questionsRouter = createRouter()
  .query("getAllUser", {
    async resolve({ ctx }) {
      return ctx.prisma?.pollQuestions.findMany({
        where: {
          ownerToken: ctx.token,
        },
        select: {
          id: true,
          question: true,
        },
      });
    },
  })

  .query("getById", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      return ctx.prisma?.pollQuestions.findUnique({
        where: {
          id: input.id,
        },
      });
    },
  })

  .mutation("add", {
    input: z.object({
      question: z.string().min(5).max(1000),
      options: z.string().array().min(2).max(10),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.token) return { error: "Unauthorized" };

      await ctx.prisma?.pollQuestions.create({
        data: {
          question: input.question,
          options: input.options,
          ownerToken: ctx.token,
        },
      });
    },
  });

const votesRouter = createRouter();

export { votesRouter, questionsRouter };
