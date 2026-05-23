export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-grow flex-col">{children}</div>;
}
