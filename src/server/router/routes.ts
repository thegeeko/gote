import { createRouter } from "./context";
import { z } from "zod";

const pollsRouter = createRouter()
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
        select: {
          question: true,
          Options: {
            select: {
              id: true,
              value: true,
            },
          },
        },
        where: {
          id: input.id,
        },
      });
    },
  })

  .query("getVotes", {
    input: z.object({
      id: z.string().length(25),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.token) return { error: "Unauthorized" };

      let count = await ctx.prisma.votes.groupBy({
        by: ["choiceId"],
        where: {
          questionsId: input.id,
        },
        _count: true,
      });

      const didVote = await ctx.prisma.votes.findUnique({
        select: {
          choiceId: true,
        },
        where: {
          questionsId_ownerToken: {
            questionsId: input.id,
            ownerToken: ctx.token,
          },
        },
      });

      return { count, didVote };
    },
  })

  .mutation("add", {
    input: z.object({
      question: z.string().min(5).max(1000),
      options: z
        .object({
          value: z.string(),
        })
        .array()
        .min(2)
        .max(10),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.token) return { error: "Unauthorized" };

      const q = await ctx.prisma.pollQuestions.create({
        data: {
          question: input.question,
          ownerToken: ctx.token,
          Options: {
            createMany: {
              data: input.options,
            },
          },
        },
      });

      return q.id;
    },
  })

  .mutation("vote", {
    input: z.object({
      qId: z.string().length(25),
      oId: z.string().length(25),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.token) return { error: "Unauthorized" };

      const didVote = await ctx.prisma.votes.findUnique({
        select: {
          choiceId: true,
        },
        where: {
          questionsId_ownerToken: {
            questionsId: input.qId,
            ownerToken: ctx.token,
          },
        },
      });

      if (didVote) return { error: "Already voted" };

      await ctx.prisma.votes.create({
        data: {
          choiceId: input.oId,
          questionsId: input.qId,
          ownerToken: ctx.token,
        },
      });
    },
  });

export { pollsRouter };
