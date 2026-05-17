export default function ViewPlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark" style={{ colorScheme: "dark", background: "#030712", minHeight: "100vh" }}>
      {children}
    </div>
  );
}
