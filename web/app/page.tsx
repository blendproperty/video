import { auth, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const jobs = await prisma.job.findMany({
    where: { userId: session.user.id as string },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Video Studio</h1>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}
        >
          <button type="submit" className="link-button">
            Sign out
          </button>
        </form>
      </div>

      <p style={{ marginBottom: 24 }}>
        <Link href="/new" className="primary-button">
          + New property video
        </Link>
      </p>

      <h2>Recent videos</h2>
      <ul className="job-list">
        {jobs.map((job) => {
          const property = JSON.parse(job.propertyJson);
          return (
            <li key={job.id}>
              <Link href={`/jobs/${job.id}`}>
                <strong>{property.propertyName}</strong>
                <span className={`status status-${job.status.toLowerCase()}`}>{job.status}</span>
              </Link>
            </li>
          );
        })}
        {jobs.length === 0 && <p>No videos yet — create your first one.</p>}
      </ul>
    </div>
  );
}
