import { getSession } from 'next-auth/react';
import { supabase } from '../../../server/db/client';

export default async function handler(req, res) {
  const { method } = req;
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedHomes: true },
  });

  const { id } = req.query;

  if (!user?.listedHomes?.find((home) => home.id === id)) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  switch (method) {
    case 'PATCH':
      try {
        const home = await prisma.home.update({
          where: { id },
          data: req.body,
        });

        res.status(200).json(home);
      } catch (e) {
        res.status(500).json({ message: 'Something went wrong.' });
      }
      break;

    case 'DELETE':
      try {
        const home = await prisma.home.delete({
          where: { id },
        });

        if (home?.image) {
          const path = home.image.split(`${process.env.SUPABASE_BUCKET}/`)?.[1];
          await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .remove([path]);
        }

        res.status(200).json(home);
      } catch (e) {
        res.status(500).json({ message: 'Something went wrong.' });
      }
      break;

    default:
      res.setHeader('Allow', ['PATCH']);
      res
        .status(405)
        .json({ message: `HTTP method ${method} is not supported.` });
  }
}
