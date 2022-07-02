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
		if (options.length >= 9) {
			if (addButtonRef.current) {
				addButtonRef.current.style.display = "none";
			}
			return;
		}

	};

	const removeOption = (i: number) => {
		let newOptions = [...options];
		newOptions.splice(i, 1);
		setOptions(newOptions);

		if (options.length <= 10) {
			if (addButtonRef.current) {
				addButtonRef.current.style.display = "block";
			}
			return;
		}
	}

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
		<div className="flex items-center justify-center h-screen">
			<div className="p-5 md:p-0 md:w-8/12 m-auto">
				<div className="fixed top-5 text-4xl font-bold">
					Gote
					<span className=" ml-2 font-normal text-xl text-gray-400">
						easy way to create votes :3
					</span>
				</div>

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
							className="px-5 py-3 text-xl bg-gray-100 shadow-sm rounded-md w-11/12 md:w-9/12 text-center">
							<svg className="m-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
								<path d="M12 6.5V17.5M17.5 12L6.5 12" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</button>
					</div>

					<div className="w-12/12 text-center mt-20 basis-full">
						<button
							disabled={isLoading}
							className="px-5 py-3 text-xl bg-green-200 shadow-sm rounded-md w-6/12 md:w-3/12 text-center font-bold border-2 border-black"
							onClick={handleSubmit}
						>
							{isLoading ? "Submitting ..." : "Submit"}
						</button>
					</div>
				</div>


			</div>
		</div>
	);
};

export default NewPollPage;
