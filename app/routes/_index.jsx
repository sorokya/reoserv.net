import { useLoaderData } from '@remix-run/react';
import { json } from '@remix-run/node';
import News from '../components/News';

import rssToJson from 'rss-to-json';
import getPrettyDate from '../utils/getPrettyDate';
import GitFeed from '../components/GitFeed';
const { parse } = rssToJson;

const GITHUB_FEED = 'https://github.com/sorokya/reoserv/commits/master.atom';

export function meta() {
  return [{ title: 'Home | REOSERV' }];
}

export async function loader({ request }) {
  const clockOffset = request.headers.get('Cookie')?.match(/clockOffset=(\d+)/);

  try {
    const feed = await parse(GITHUB_FEED);
    return json(
      feed.items.map((item) => ({
        id: item.id,
        link: item.link,
        content: item.title,
        timestamp: getPrettyDate(item.created, clockOffset),
      })),
    );
  } catch (e) {
    console.error('There was an error getting the commit feed', e);
    return [];
  }
}

export default function Index() {
  const commits = useLoaderData();
  const articles = [
    {
      id: 5,
      title: 'Blah blah blah',
      author: 'Sorokya',
      publishedAt: 'Oct 31, 2023',
      summary:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam felis massa, tristique in augue ut, pulvinar facilisis lorem. Quisque mattis risus vestibulum turpis lacinia sollicitudin sed in orci',
    },
    {
      id: 4,
      title: 'More things',
      author: 'Sorokya',
      publishedAt: 'Oct 23, 2023',
      summary:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam felis massa, tristique in augue ut, pulvinar facilisis lorem. Quisque mattis risus vestibulum turpis lacinia sollicitudin sed in orci',
    },
    {
      id: 3,
      title: 'Stuff',
      author: 'Sorokya',
      publishedAt: 'Oct 17, 2023',
      summary:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam felis massa, tristique in augue ut, pulvinar facilisis lorem. Quisque mattis risus vestibulum turpis lacinia sollicitudin sed in orci',
    },
    {
      id: 2,
      title: 'Things',
      author: 'Sorokya',
      publishedAt: 'Oct 13, 2023',
      summary:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam felis massa, tristique in augue ut, pulvinar facilisis lorem. Quisque mattis risus vestibulum turpis lacinia sollicitudin sed in orci',
    },
    {
      id: 1,
      title: 'Hello World',
      author: 'Sorokya',
      publishedAt: 'Oct 10, 2023',
      summary:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam felis massa, tristique in augue ut, pulvinar facilisis lorem. Quisque mattis risus vestibulum turpis lacinia sollicitudin sed in orci',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="col-span-2">
        <News articles={articles} />
      </div>
      <div className="col-span-1">
        <GitFeed commits={commits} />
      </div>
    </div>
  );
}
