export function Button({ children, onClick }) {
  return (
    <button
      className="p-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

