import Layout from '@/components/Layout';
import Grid from '@/components/Grid';
import { prisma } from '../server/db/client';
import { getSession } from 'next-auth/react';

export default function Home({ homes = [] }) {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">
        Top-rated places to stay
      </h1>
      <p className="text-gray-500">
        Explore some of the best places in the world
      </p>
      <div className="mt-8">
        <Grid homes={homes} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  let homes = [];
  const session = await getSession(context);

  if (session) {
    homes = await prisma.home.findMany();
  }

  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    },
  };
}
