export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const { id } = req.query;
        const owner = await prisma.home.findUnique({
          where: { id },
          select: { owner: true },
        });

        res.status(200).json(owner);
      } catch (e) {
        res.status(500).json({ message: 'Something went wrong.' });
      }

      break;
    default:
      res.header('Allow', ['GET']);
      res
        .status(405)
        .json({ message: `HTTP method ${method} is not supported.` });
  }
}
