import type { NextPage } from "next";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { trpc } from "../utils/trpc";

const NewPollPage: NextPage = () => {
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const { mutate, isLoading, status } = trpc.useMutation("polls.add");

  useEffect(() => {
    if (status == "success") {
      setQuestion("");
      setOptions(["", ""]);
    }
  }, [status]);

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
    if (options.length == 9) {
      if (addButtonRef.current) addButtonRef.current.disabled = true;
    }
  };

  const handleSubmit = () => {
    setOptions((oldOptions) => {
      let newOptions = [...oldOptions];
      return newOptions.filter((o) => o.length > 0);
    });
    mutate({
      question,
      options,
    });
  };

  return (
    <>
      <input
        disabled={isLoading}
        value={question}
        className="border-4 border-gray-900"
        onChange={handleQuestionChange}
      />

      <button
        className="bg-red-200"
        ref={addButtonRef}
        onClick={handleAddOption}
      >
        {" "}
        add option{" "}
      </button>

      {options.map((_o, i) => {
        return (
          <div key={i}>
            <div className="inline m-2">Option {i + 1}</div>
            <input
              value={options[i]}
              onChange={(e) => handleOptionChange(e, i)}
              className="border-4 border-gray-900"
            ></input>
          </div>
        );
      })}

      <button
        disabled={isLoading}
        className="bg-red-200"
        ref={addButtonRef}
        onClick={handleSubmit}
      >
        {isLoading ? "Submitting ..." : "Submit"}
      </button>
    </>
  );
};

export default NewPollPage;
