interface BadgeProps {
  children: React.ReactNode;
}

export function Badge({ children }: BadgeProps) {
  return (
    <span className="inline-block w-fit border border-heaven-lemon text-silver-lemon text-sm px-2 py-0.5">
      {children}
    </span>
  );
} 