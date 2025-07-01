import { Button, ButtonProps } from 'react-bootstrap';

import './submit-button.styles.css';

interface IProps extends ButtonProps {
  loading?: boolean;
}

const SubmitBtn = ({ disabled = false, loading = false, children, ...props }: IProps) => {
  return (
    <Button {...props} disabled={loading || disabled}>
      {loading ? (
        <span className="btn-loading">
          <span>&bull;</span>
          <span>&bull;</span>
          <span>&bull;</span>
        </span>
      ) : (
        <span>{children}</span>
      )}
    </Button>
  );
};

export default SubmitBtn;
