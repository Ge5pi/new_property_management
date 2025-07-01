import { Form, FormControlProps } from 'react-bootstrap';
import { usePhoneInput } from 'react-international-phone';

interface IProps extends Omit<FormControlProps, 'type' | 'onChange' | 'placeholder'> {
  name?: string;
  required?: boolean;
  onPhoneNumberChange: (phone: string) => void;
  value?: string;
}

const Phone = (props: IProps) => {
  const { value, onPhoneNumberChange, ...rest } = props;
  const { inputValue, handlePhoneValueChange } = usePhoneInput({
    value,
    disableDialCodePrefill: true,
    onChange: data => {
      onPhoneNumberChange(data.phone);
    },
  });

  return (
    <Form.Control
      {...rest}
      value={inputValue}
      onChange={handlePhoneValueChange}
      placeholder="+1 (212) 456-7890"
      type="tel"
    />
  );
};

export default Phone;
