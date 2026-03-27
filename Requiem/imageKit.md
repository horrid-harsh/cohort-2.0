Usage
The full API of this library can be found in api.md.

import ImageKit from '@imagekit/nodejs';

const client = new ImageKit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'], // This is the default and can be omitted
});

const response = await client.files.upload({
  file: fs.createReadStream('path/to/file'),
  fileName: 'file-name.jpg',
});

console.log(response);
Request & Response types
This library includes TypeScript definitions for all request params and response fields. You may import and use them like so:

import ImageKit from '@imagekit/nodejs';

const client = new ImageKit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'], // This is the default and can be omitted
});

const params: ImageKit.FileUploadParams = {
  file: fs.createReadStream('path/to/file'),
  fileName: 'file-name.jpg',
};
const response: ImageKit.FileUploadResponse = await client.files.upload(params);
Documentation for each method, request param, and response field are available in docstrings and will appear on hover in most modern editors.

File uploads
Request parameters that correspond to file uploads can be passed in many different forms:

File (or an object with the same structure)
a fetch Response (or an object with the same structure)
an fs.ReadStream
the return value of our toFile helper
import fs from 'fs';
import ImageKit, { toFile } from '@imagekit/nodejs';

const client = new ImageKit();

// If you have access to Node `fs` we recommend using `fs.createReadStream()`:
await client.files.upload({ file: fs.createReadStream('/path/to/file'), fileName: 'fileName' });

// Or if you have the web `File` API you can pass a `File` instance:
await client.files.upload({ file: new File(['my bytes'], 'file'), fileName: 'fileName' });

// You can also pass a `fetch` `Response`:
await client.files.upload({ file: await fetch('https://somesite/file'), fileName: 'fileName' });

// Finally, if none of the above are convenient, you can use our `toFile` helper:
await client.files.upload({
  file: await toFile(Buffer.from('my bytes'), 'file'),
  fileName: 'fileName',
});
await client.files.upload({
  file: await toFile(new Uint8Array([0, 1, 2]), 'file'),
  fileName: 'fileName',
});
