import { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string;
  definitions?: { [key: string]: RegExp };
  onAccept?: (value: string) => void;
}

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, definitions, onAccept, ...props }, ref) => {
    return (
      <IMaskInput
        {...props}
        mask={mask}
        definitions={definitions}
        onAccept={onAccept}
        inputRef={ref}
        className={props.className}
      />
    );
  }
);

MaskedInput.displayName = 'MaskedInput';

export default MaskedInput;