'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface JobRecord {
  id: string;
  status: 'PENDING' | 'RENDERING' | 'DONE' | 'FAILED';
  propertyJson: string;
  outputPath: string | null;
  errorMessage: string | null;
}

// Older jobs may have an outputPath saved as /renders/<id>.mp4 from before
// the dedicated dynamic route handler existed — rewrite those on the fly so
// they keep working without a data migration.
function resolveOutputPath(outputPath: string): string {
  if (outputPath.startsWith('/renders/')) {
    return `/api${outputPath}`;
  }
  return outputPath;
}

export default function JobStatusPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [job, setJob] = useState<JobRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    const poll = async () => {
      const res = await fetch(`/api/jobs/${id}`);
      if (!res.ok) {
        if (!cancelled) setError('Could not load this video.');
        return;
      }
      const data = await res.json();
      if (cancelled) return;
      setJob(data.job);
      if (data.job.status === 'RENDERING' || data.job.status === 'PENDING') {
        timeout = setTimeout(poll, 3000);
      }
    };

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [id]);

  if (error) {
    return (
      <div className="page">
        <p style={{ marginBottom: 16 }}>
          <Link href="/" className="link-button">← Back to dashboard</Link>
        </p>
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="page">
        <p>Loading…</p>
      </div>
    );
  }

  const property = JSON.parse(job.propertyJson);
  const videoSrc = job.outputPath ? resolveOutputPath(job.outputPath) : null;

  return (
    <div className="page">
      <p style={{ marginBottom: 16 }}>
        <Link href="/" className="link-button">← Back to dashboard</Link>
      </p>

      <h1>{property.propertyName}</h1>

      {job.status === 'PENDING' && <p>Queued…</p>}
      {job.status === 'RENDERING' && <p>Rendering your video — this usually takes 1–2 minutes…</p>}
      {job.status === 'FAILED' && <p className="error">Render failed: {job.errorMessage}</p>}

      {job.status === 'DONE' && videoSrc && (
        <div>
          <video controls src={videoSrc} style={{ maxWidth: '100%', borderRadius: 12 }} />
          <p>
            <a href={videoSrc} download className="primary-button">
              Download MP4
            </a>
          </p>
          <p style={{ marginTop: 24 }}>
            <Link href="/" className="secondary-button" style={{ display: 'inline-block', borderRadius: 20, padding: '12px 22px', textDecoration: 'none' }}>
              ← Back to dashboard
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
