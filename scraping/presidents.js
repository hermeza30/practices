/* eslint-disable comma-dangle */
/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable semi */
import fetch from 'node-fetch';
import fs from 'node:fs';
import path from 'node:path';
const RAW_PATH = path.join(process.cwd(), './db/raw-presidents.json');
const PRESIDENTS_DB = path.join(process.cwd(), './db/presidents.json');
const STATIC_PATH = path.join(process.cwd(), './assets/static/presidents');
let RAW_PRESIDENTS = [];
await fs.readFile(RAW_PATH, 'utf-8', async (_, value) => {
    RAW_PRESIDENTS = JSON.parse(value);
    const promises = RAW_PRESIDENTS.map(async (rp) => {
        const { slug: id, title, _links: links } = rp;
        const { rendered: name } = title;
        const { 'wp:attachment': attachment } = links;
        const { href: imageApiEndpointUrl } = attachment[0];

        const [imageInfo] = await fetch(imageApiEndpointUrl).then((r) =>
            r.json()
        );
        const {
            guid: { rendered: imageUrl },
        } = imageInfo;

        const ext = imageUrl.split('.').at(-1);
        const responseImage = await fetch(imageUrl);
        const arrayBuffer = await responseImage.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const imageFileName = `${id}.${ext}`;
        await fs.writeFile(
            `${STATIC_PATH}/${imageFileName}`,
            buffer,
            _,
            () => {}
        );

        return { id, name, image: imageFileName, teamId: 0 };
    });
    const results = await Promise.all(promises);
    await fs.writeFile(
        PRESIDENTS_DB,
        JSON.stringify(results, null, 2),
        _,
        () => {}
    );
});
