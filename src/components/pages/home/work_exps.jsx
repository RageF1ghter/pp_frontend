import data from "./work_exp.json";
import ExpandCard from "./expand";

export default function MyWorks() {
  const exps = data.work_experience;
  const content = (
    <ul>
      {exps.map((exp) => (
        <li
          key={exp.title}
          className="p-5 border border-gray-300 rounded-lg mb-6 shadow-sm"
        >
          <p className="text-xl font-semibold text-gray-800">{exp.title}</p>
          <p className="text-md text-gray-600 mb-2">{exp.company}</p>
          {/* <p className="text-sm text-gray-500">{exp.date}</p> */}
          <p className="text-md font-medium mt-2 mb-1">What I have done:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
            {exp.responsibilities.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          {exp.demo && (
            <a
              href={exp.demo}
              className="text-blue-500 hover:underline text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Demo
            </a>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <div className="flex flex-col items-start justify-start w-full max-w-4xl">
        <ExpandCard content={content} contentName="My Work" />
      </div>
    </>
  );
}
