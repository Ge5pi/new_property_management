import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetAnnouncementByIdQuery } from 'services/api/announcement';

import { getValidID } from 'utils/functions';

import AnnouncementsCRUD from './announcements-crud';

const AnnouncementsModify = () => {
  const { announcement: announcement_id } = useParams();
  const announcement = useGetAnnouncementByIdQuery(getValidID(announcement_id));

  return (
    <ApiResponseWrapper
      {...announcement}
      renderResults={data => {
        return <AnnouncementsCRUD announcement={data} update />;
      }}
    />
  );
};

export default AnnouncementsModify;
