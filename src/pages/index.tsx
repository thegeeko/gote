import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["polls.getAll"]);

  if (isLoading || !data) return <h1>Loading...</h1>;

  return (
    <>
      <Head>
        <title>Polls</title>
        <meta name="description" content="poll app using nextjs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {data.map((q) => (
        <Link href={`/polls/${q.id}`} key={q.id}>
          <div> {q.question} </div>
        </Link>
      ))}
    </>
  );
};

export default Home;
