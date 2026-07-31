'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface JobRecord {
  id: string;
  status: 'PENDING' | 'RENDERING' | 'DONE' | 'FAILED';
  propertyJson: string;
  outputPath: string | null;
  errorMessage: string | null;
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

  return (
    <div className="page">
      <h1>{property.propertyName}</h1>

      {job.status === 'PENDING' && <p>Queued…</p>}
      {job.status === 'RENDERING' && <p>Rendering your video — this usually takes 1–2 minutes…</p>}
      {job.status === 'FAILED' && <p className="error">Render failed: {job.errorMessage}</p>}

      {job.status === 'DONE' && job.outputPath && (
        <div>
          <video controls src={job.outputPath} style={{ maxWidth: '100%', borderRadius: 12 }} />
          <p>
            <a href={job.outputPath} download className="primary-button">
              Download MP4
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
