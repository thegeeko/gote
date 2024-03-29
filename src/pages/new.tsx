import type { NextPage } from "next";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { trpc } from "../utils/trpc";

const NewPollPage: NextPage = () => {
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const { mutateAsync: addNewPoll, isLoading } = trpc.useMutation("polls.add");

  useEffect(() => {
    if (addButtonRef.current) {
      if (options.length == 0) {
        setOptions(["", ""]);
        return;
      }

      if (options.length >= 10) addButtonRef.current.style.display = "none";
      else addButtonRef.current.style.display = "inline";
    }
  }, [options]);

  const handleQuestionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.currentTarget.value);
  };

  const handleOptionChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newOptions = [...options];
    newOptions[index] = e.currentTarget.value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    setSubmitDisabled(true);

    const newOptions = options.filter((o) => o.length > 0);

    if (newOptions.length == 0 || question.length == 0) {
      alert(
        "The Question must be at least 5 characters and u must have 2 options"
      );
      return;
    }

    let optsToSubmit: { value: string }[] = [];
    options.forEach((o) => {
      optsToSubmit.push({ value: o });
    });

    const p = await addNewPoll({
      question,
      options: optsToSubmit,
    });

    if (typeof p !== "string") {
      setSubmitDisabled(false);
    } else {
      router.push(`/polls/${p}`);
    }
  };

  return (
    <>
      <Head>
        <title>Gote | New Poll</title>
        <meta name="description" content="poll app using nextjs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex   h-screen">
        <div className="p-5 md:p-0 md:w-8/12 m-auto">
          <Link href="/">
            <div className="fixed top-5 text-4xl font-bold cursor-pointer">
              Gote
              <span className=" ml-2 font-normal text-xl text-gray-400">
                easy way to create votes :3
              </span>
            </div>
          </Link>

          {submitDisabled && (
            <div className="text-3xl font-bold text-center animate-pulse">
              Loading...
            </div>
          )}

          {!submitDisabled && (
            <>
              <input
                disabled={isLoading}
                value={question}
                placeholder="eg: Does python suck ?"
                className="text-black w-full rounded-md border-transparent bg-transparent font-bold px-7 py-3 text-3xl text-center"
                onChange={handleQuestionChange}
              />

              <div className="flex flex-wrap items-center">
                {options.map((_o, i) => {
                  return (
                    <div key={i} className="w-6/12 text-center mt-5">
                      <input
                        value={options[i]}
                        disabled={isLoading}
                        onChange={(e) => handleOptionChange(e, i)}
                        placeholder="yes"
                        className="px-5 py-3 text-xl bg-gray-100 shadow-sm rounded-md w-11/12 md:w-9/12 text-center"
                      ></input>
                    </div>
                  );
                })}

                <div className="w-6/12 text-center mt-5">
                  <button
                    onClick={handleAddOption}
                    ref={addButtonRef}
                    className="px-5 py-3 text-xl bg-gray-100 shadow-sm rounded-md w-11/12 md:w-9/12 text-center"
                  >
                    <svg
                      className="m-auto"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 6.5V17.5M17.5 12L6.5 12"
                        stroke="black"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="w-12/12 text-center mt-20 basis-full">
                  <button
                    disabled={submitDisabled}
                    className="px-5 py-3 text-xl bg-green-200 shadow-sm rounded-md w-6/12 md:w-3/12 text-center font-bold border-4 border-black"
                    onClick={handleSubmit}
                  >
                    {isLoading ? "Submitting ..." : "Submit"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NewPollPage;
