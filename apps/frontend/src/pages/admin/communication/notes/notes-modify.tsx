import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetNoteByIdQuery } from 'services/api/notes';

import { getValidID } from 'utils/functions';

import NotesCRUD from './notes-crud';

const NotesModify = () => {
  const { note: note_id } = useParams();
  const note = useGetNoteByIdQuery(getValidID(note_id));

  return (
    <ApiResponseWrapper
      {...note}
      renderResults={data => {
        return <NotesCRUD note={data} update />;
      }}
    />
  );
};

export default NotesModify;
