import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { decode } from 'base64-arraybuffer';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      let { image } = req.body;

      // retrieve the image data from the request's body and check that it is not empty:
      if (!image) {
        return res.status(500).json({ message: 'No image provided' });
      }

      const contentType = image.match(/data:(.*);base64/)?.[1];
      const base64FileData = image.split('base64,')?.[1];

      // check the image data as it should be encoded in Base64.
      if (!contentType || !base64FileData) {
        return res.status(500).json({ message: 'Image data not valid' });
      }

      // generating unique filename
      const fileName = nanoid();
      const ext = contentType.split('/')[1];
      const path = `${fileName}.${ext}`;

      // uploading file to Supabase bucket.

      const { data, error: uploadError } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .upload(path, decode(base64FileData), {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        console.log(uploadError);
        throw new Error('Unable to upload image to storage');
      }

      console.log('THIS IS THE DATA');
      console.log(data);

      // Contruct public url
      const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${data.path}`;

      return res.status(200).json({ url });

      break;

    default:
      res.setHeader('Allow', ['POST']);

      res
        .status(405)
        .json({ message: `HTTP method ${req.method} is not supported` });
  }
}
