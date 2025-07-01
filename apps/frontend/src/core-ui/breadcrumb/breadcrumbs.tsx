import { ReactNode } from 'react';
import { Params, useMatches } from 'react-router-dom';

import { clsx } from 'clsx';

import { protectString } from 'utils/functions';

interface IBreadMatch {
  id: string;
  pathname: string;
  params: Params<string>;
  data: unknown;
  handle: { crumb: (data?: unknown) => JSX.Element };
}

interface IBreadcrumb {
  pathname: string;
  crumb: ReactNode;
}

const Breadcrumbs = () => {
  const matches: Array<IBreadMatch> = useMatches() as Array<IBreadMatch>;
  const crumbs: Array<IBreadcrumb> = matches
    .filter(match => Boolean(match.handle?.crumb))
    .map(match => {
      return { crumb: match.handle.crumb(match.data), pathname: match.pathname };
    });

  return (
    <div className="small">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb m-0">
          {crumbs.map(({ crumb, pathname }, inx) => {
            let dataKey = '';
            if (inx === 0) {
              dataKey = protectString(pathname.replaceAll('/', '~'), 'Encrypt');
            }

            return (
              <li
                key={inx}
                className={clsx('breadcrumb-item', { active: inx >= crumbs.length - 1 })}
                data-key={dataKey}
              >
                {crumb}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumbs;
