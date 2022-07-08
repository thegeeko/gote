import type { NextPage } from "next";
import Link from "next/link";
import Head from "next/head";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["polls.getAllUser"]);

  const renderData = () => {
    if (isLoading)
      return (
        <div className="text-3xl font-bold text-center animate-pulse">
          Loading ...
        </div>
      );

    if (!isLoading && !data)
      return (
        <div className="text-3xl font-bold text-center text-red-400">
          Error :(
        </div>
      );

    if (data.length == 0)
      return (
        <div className="text-gray-500 text-4xl text-center font-bold mt-20">
          Welcome to <span className="text-black">Gote </span>
          <br />
          Create{" "}
          <a
            className="text-black underline"
            href="https://pollybee.netlify.app/"
          >
            Better
          </a>{" "}
          instant, customizable polls with ease
          <Link href="/new">
            <button className="block mt-10 text-black mx-auto max-w-[185px] px-2 py-2 text-xl bg-green-200 shadow-sm rounded-md w-6/12 md:w-3/12 text-center font-bold border-4 border-black">
              New Poll
            </button>
          </Link>
        </div>
      );

    return (
      <div className="flex flex-wrap justify-between">
        {data.map((q) => (
          <Link href={`/polls/${q.id}`} key={q.id}>
            <div className="w-full mt-4 md:w-5/12 flex cursor-pointer shadow-sm  bg-gray-200 px-10 py-6 font-bold text-3xl rounded-md text-center">
              <div className="m-auto"> {q.question} </div>
            </div>
          </Link>
        ))}
        <Link href="/new">
          <button className="px-6 py-3 mt-10 text-xl text-black bg-green-200 shadow-sm rounded-md w-6/12 md:w-3/12 text-center font-bold  basis-full">
            New Poll
          </button>
        </Link>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Gote</title>
        <meta name="description" content="poll app using nextjs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex items-center justify-center h-screen flex-col">
        <div className="p-5 md:p-0 md:w-8/12 -mt-52 w-full  mx-auto">
          <Link href="/">
            <div className="fixed top-5 text-4xl font-bold cursor-pointer">
              Gote
              <span className=" ml-2 font-normal text-xl text-gray-400">
                easy way to create votes :3
              </span>
            </div>
          </Link>
          {renderData()}
        </div>
      </div>
    </>
  );
};

export default Home;
