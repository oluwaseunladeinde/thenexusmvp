import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="api-docs">
      {children}
    </div>
  );
}
