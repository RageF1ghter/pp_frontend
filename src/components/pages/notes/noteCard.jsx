import { useState } from "react";

const NoteCard = ({ note, onEdit, onDelete }) => {
	const [content] = useState(note.content);

	return (
		<div className="bg-white shadow-md rounded-2xl p-4 flex flex-col justify-between border border-gray-200 hover:shadow-lg transition-shadow">
			<div>
				<h3 className="text-lg font-semibold text-gray-800 mb-2">
					{note.title}
				</h3>

				{content.text && <p className="text-gray-600 mb-2">{content.text}</p>}

				{content.image && (
					<img
						src={content.image}
						alt="Note"
						className="w-full rounded-lg mb-2 object-cover max-h-48"
					/>
				)}

				{content.list && (
					<div className="mb-2">
						<ul className="list-disc pl-5 text-gray-700 space-y-1">
							{content.list.map((item, idx) => (
								<li key={idx}>{item}</li>
							))}
						</ul>
						<div className="flex mt-2 space-x-2">
							<input
								type="text"
								placeholder="Add item..."
								className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-400"
							/>
							<button className="px-3 py-1 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600">
								Add
							</button>
						</div>
					</div>
				)}
			</div>

			<div className="flex justify-end mt-4 space-x-2">
				<button
					onClick={() => onEdit(note)}
					className="px-3 py-1 border border-indigo-500 text-indigo-500 rounded-lg text-sm hover:bg-indigo-50"
				>
					Edit
				</button>
				<button
					onClick={() => onDelete(note._id)}
					className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
				>
					Delete
				</button>
			</div>
		</div>
	);
};

export default NoteCard;
