import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

const QuestionContent: React.FC<{ id: string }> = ({ id }) => {
	const { data, isLoading } = trpc.useQuery([
		"polls.getById",
		{ id }
	]);

	if (!isLoading && !data)
		return <data>Question not found</data>;

	return isLoading ?
		<div>Loading ..</div> : <div> {data?.question} </div>

}

const QuestionPage: React.FC = () => {
	const { query } = useRouter();
	const { id } = query;

	console.log(id);

	if (typeof id != "string")
		return <div> No Id </div>

	return <QuestionContent id={id} />

};

export default QuestionPage;
