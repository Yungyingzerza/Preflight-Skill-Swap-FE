export default function Loading() {
  return (
    <div className="relative text-5xl font-bold overflow-hidden flex flex-col items-center justify-center h-screen">
      <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary via-gray-400 to-primary animate-loading-text inter-600">
        SkillSwap
      </span>
    </div>
  );
}
