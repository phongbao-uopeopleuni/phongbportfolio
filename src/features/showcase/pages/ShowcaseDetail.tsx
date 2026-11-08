import {useParams} from 'react-router-dom';

export default function ShowcaseDetail() {
  const {slug} = useParams<{slug: string}>();
  return (
    <main className="min-h-screen px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-ink">Detail: {slug}</h1>
      </div>
    </main>
  );
}
