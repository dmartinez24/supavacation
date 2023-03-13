import Layout from '@/components/Layout';
import ListingForm from '@/components/ListingForm';
import { getSession } from 'next-auth/react';
import axios from 'axios';

const Edit = (home = null) => {
  const onSubmitEdit = (data) => axios.patch(`/api/homes/${home.id}`, data);

  return (
    <Layout>
      <div className="max-w-screen-sm mx-auto">
        <h1 className="text-xl font-medium text-gray-800">Edit your home</h1>
        <p className="text-gray-500">
          Fill out the form below to update yor home.
        </p>
        <div className="mt-8">
          {home ? (
            <ListingForm
              buttonText="Update home"
              initialValues={home}
              redirectPath={`/homes/${home.id}`}
              onSubmit={onSubmitEdit}
            />
          ) : null}
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  const redirect = {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };

  if (!session) {
    return redirect;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedHomes: true },
  });

  const id = context.params.id;

  const home = user?.listedHomes?.find((home) => home.id === id);

  if (!home) {
    return redirect;
  }

  console.log('Home ===>');
  console.log(home);

  return {
    props: JSON.parse(JSON.stringify(home)),
  };
}

export default Edit;
