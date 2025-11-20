export const InteractiveDemo = () => {

  return (
    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-violet-500/50 transition-colors duration-300">
      <h3 className="text-2xl font-bold mb-4 text-white">Interaction Demo</h3>
      <button className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-300">
        Click Me
      </button>
    </div>
  );
}