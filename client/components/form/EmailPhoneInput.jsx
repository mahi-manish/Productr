import TextInput from './TextInput';

export const validateEmailPhone = (value) => {
    if (!value) return 'This field is required';
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const is10DigitPhone = /^[1-9]\d{9}$/.test(value);
    const is11DigitPhone = /^0[1-9]\d{9}$/.test(value);
    if (!isEmail && !is10DigitPhone && !is11DigitPhone) {
        return 'Enter valid email or phone number';
    }
    return '';
};

export default function EmailPhoneInput({ value, onChange, error, ...props }) {
    return (
        <TextInput
            label="Email or Phone number"
            type="text"
            required
            placeholder="Enter email or phone number"
            value={value}
            onChange={onChange}
            error={error}
            {...props}
        />
    );
}
