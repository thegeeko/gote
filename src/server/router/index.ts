// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import * as routers from "./routes";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("polls.", routers.pollsRouter)
	.merge("votes.", routers.votesRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
