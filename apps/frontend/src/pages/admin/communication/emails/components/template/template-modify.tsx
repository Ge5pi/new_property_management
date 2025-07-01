import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetEmailTemplateByIdQuery } from 'services/api/email-template';

import { getValidID } from 'utils/functions';

import TemplateCRUD from './template-crud';

const TemplateModify = () => {
  const { template: template_id } = useParams();
  const template = useGetEmailTemplateByIdQuery(getValidID(template_id));

  return (
    <ApiResponseWrapper
      {...template}
      renderResults={data => {
        return <TemplateCRUD template={data} update />;
      }}
    />
  );
};

export default TemplateModify;
