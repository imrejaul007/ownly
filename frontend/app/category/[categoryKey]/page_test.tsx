'use client';

import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const params = useParams();
  const categoryKey = params.categoryKey as string;

  return (
    <div style={{ padding: '50px', backgroundColor: '#1a1a2e', color: 'white', minHeight: '100vh' }}>
      <h1>Category: {categoryKey}</h1>
      <p>This is a test page for category routing.</p>
    </div>
  );
}
