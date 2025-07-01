import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetContactByIdQuery } from 'services/api/contacts';

import { getValidID } from 'utils/functions';

import ContactCRUD from './contacts-crud';

const ContactModify = () => {
  const { contact: contact_id } = useParams();
  const contact = useGetContactByIdQuery(getValidID(contact_id));

  return (
    <ApiResponseWrapper
      {...contact}
      renderResults={data => {
        return <ContactCRUD contact={data} update />;
      }}
    />
  );
};

export default ContactModify;
