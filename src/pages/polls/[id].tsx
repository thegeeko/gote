import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { trpc } from "../../utils/trpc";

const QuestionContent: React.FC<{ id: string }> = ({ id }) => {
  const [votes, setVotes] = useState<Map<string, number>>();
  const poll = trpc.useQuery(["polls.getById", { id }]);
  const trpcUtils = trpc.useContext();
  trpc.useQuery(["polls.getVotes", { id }], {
    onSuccess(data) {
      if (!data.didVote) return;

      const newVotes = new Map<string, number>();
      const allVotes = data.count.reduce((acc, c) => acc + c._count, 0);
      data.count.forEach((o) => {
        newVotes.set(o.choiceId, (o._count / allVotes) * 100);
      });

      setVotes(newVotes);
    },
  });
  const { mutate, isLoading } = trpc.useMutation(["polls.vote"], {
    onSuccess() {
      trpcUtils.refetchQueries(["polls.getVotes", { id }]);
    },
  });

  const handleVoting = (oId: string) => {
    if (isLoading) return;
    if (votes) {
      alert("You already voted!");
      return;
    }
    mutate({
      qId: id,
      oId,
    });
  };

  if (poll.isLoading) {
    return (
      <>
        <div className="text-3xl font-bold text-center animate-pulse">
          Loading...
        </div>
      </>
    );
  }

  if (!poll.data) {
    return (
      <>
        <div className="text-3xl font-bold text-center text-red-400">
          Not Found This Poll :( sry ..
        </div>
      </>
    );
  }

  return (
    <>
      <div className="text-black w-full rounded-md border-transparent bg-transparent font-bold px-7 py-3 text-3xl text-center">
        {poll.data.question}
      </div>
      <div className="flex flex-wrap items-center">
        {poll.data.Options.map((o, i) => {
          return (
            <div key={i} className="w-6/12 text-center mt-5 ">
              <div
                onClick={() => handleVoting(o.id)}
                className="relative  text-xl m-auto cursor-pointer bg-gray-100 shadow-sm rounded-md w-11/12 md:w-9/12 text-center"
              >
                <div className="px-5 py-3 -z-1">{o.value}</div>
                {votes && (
                  <div
                    className={`bg-green-300 rounded-md absolute h-1`}
                    style={{ width: `${votes.get(o.id)}%` }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const QuestionPage: NextPage = () => {
  const { query } = useRouter();
  const { id } = query;

  return (
    <>
      <Head>
        <title>Gote | Vote</title>
        <meta name="description" content="poll app using nextjs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex h-screen">
        <div className="p-5 md:p-0 md:w-8/12 m-auto">
          <Link href="/">
            <div className="fixed top-5 text-4xl font-bold cursor-pointer">
              Gote
              <span className=" ml-2 font-normal text-xl text-gray-400">
                easy way to create votes :3
              </span>
            </div>
          </Link>

          {typeof id == "string" && <QuestionContent id={id} />}
        </div>
      </div>
    </>
  );
};

export default QuestionPage;
