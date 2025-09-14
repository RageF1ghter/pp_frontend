import { useSelector } from "react-redux";
import useAxios from "@/lib/useAxios";
import config from "@/components/config";
import NoteCard from "./NoteCard";

const NotesPage = () => {
	const prefix = config.dev.API_URL;
	const userId = useSelector((state) => state.auth.userId);

	const { data, loading, error } = useAxios(
		{
			url: `${prefix}/notes/${userId}`,
			method: "GET",
		},
		{ auto: true, withAuth: false }
	);

	if (loading) return <p className="text-gray-500">Loading...</p>;
	if (error)
		return <p className="text-red-500">Error loading notes: {error.message}</p>;

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">📝 Your Notes</h1>
			{data && data.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{data.map((note) => (
						<NoteCard
							key={note._id}
							note={note}
							onEdit={() => {}}
							onDelete={() => {}}
						/>
					))}
				</div>
			) : (
				<p className="text-gray-500">No notes yet. Start by creating one!</p>
			)}
		</div>
	);
};

export default NotesPage;
