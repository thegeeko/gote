import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
	const { data, isLoading } = trpc.useQuery(["polls.getAllQuestions"]);

	if (isLoading || !data)
		return <h1>Loading...</h1>

	return (
		<>
			<Head>
				<title>Create T3 App</title>
				<meta name="description" content="poll app using nextjs" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<h1 className="font-extrabold text-center text-7xl">
				{data[0]?.createdAt.getTime()}
			</h1>
		</>
	);
};

export default Home;
