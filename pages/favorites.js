import Layout from '@/components/Layout';
import Grid from '@/components/Grid';
import { getSession } from 'next-auth/react';

const Favorites = ({ homes = [] }) => {
  return (
    <Layout>
      <h1 className="text-xl font-medium text-gray-800">Your Listings</h1>
      <p className="text-gray-500">
        Manage your favorite homes and update your listings
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
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { favoriteHomes: true },
  });

  return {
    props: {
      homes: JSON.parse(JSON.stringify(user.favoriteHomes)),
    },
  };
}

export default Favorites;
