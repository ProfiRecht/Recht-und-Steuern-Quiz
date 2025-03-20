export function Card({ children }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-md">
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div className="p-4">{children}</div>;
}

