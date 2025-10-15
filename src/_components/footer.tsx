export function Footer({
  owner,
  author,
  description,
}: {
  owner: string;
  author: string;
  description: string;
}) {
  return (
    <div className="bg-gray-800 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-300">
            {owner}{" "}
            <a
              href="https://andremov.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-400 hover:text-blue-200 transition"
            >
              {author}
            </a>
          </div>
          <div className="text-xs text-gray-400">{description}</div>
        </div>
      </div>
    </div>
  );
}
