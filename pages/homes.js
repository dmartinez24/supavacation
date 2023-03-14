import Layout from '@/components/Layout';
import Grid from '@/components/Grid';
import { getHomes } from '@/lib/homes';

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
  return await getHomes(context);
}

export default Homes;
