import Layout from '@/components/Layout';
import Grid from '@/components/Grid';
import { getSession } from 'next-auth/react';

const Homes = ({ homes = [] }) => {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">Your Listings</h1>
      <p className="text-gray-500">
        Manage your homes and update your listings
      </p>
      <div className="mt-8">
        <Grid homes={homes} />
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const homes = await prisma.home.findMany({
    where: {
      owner: { email: session.user.email },
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    },
  };
}

export default Homes;
