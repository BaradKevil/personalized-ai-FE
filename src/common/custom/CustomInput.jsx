import { TextField } from '@mui/material';

const CustomInput = ({
    label,
    placeholder,
    name,
    formik,
    type = 'text',
    multiline = false,
    rows = 1,
    InputProps = {},
    InputLabelProps,
    slotProps,
    ...props
}) => {
    const value = formik ? formik.values[name] : props.value;
    const onChange = formik ? formik.handleChange : props.onChange;
    const onBlur = formik ? formik.handleBlur : props.onBlur;
    const hasError = formik && formik.touched[name] && Boolean(formik.errors[name]);
    const helperText = formik && formik.touched[name] ? formik.errors[name] : props.helperText;

    const isDateOrTime = ['date', 'datetime-local', 'time', 'month', 'week'].includes(type);
    const forceShrink = isDateOrTime || InputLabelProps?.shrink || slotProps?.inputLabel?.shrink || props.InputLabelProps?.shrink;

    const mergedInputLabelProps = {
        ...(forceShrink ? { shrink: true } : {}),
        ...props.InputLabelProps,
        ...InputLabelProps,
        ...slotProps?.inputLabel,
    };

    const mergedSlotProps = {
        ...props.slotProps,
        ...slotProps,
        input: {
            ...InputProps,
            ...props.slotProps?.input,
            ...slotProps?.input,
        },
        inputLabel: mergedInputLabelProps,
    };

    return (
        <TextField
            fullWidth
            id={name}
            name={name}
            type={type}
            label={label}
            placeholder={placeholder}
            value={value ?? ''}
            onChange={onChange}
            onBlur={onBlur}
            multiline={multiline}
            rows={rows}
            error={Boolean(hasError)}
            helperText={hasError ? helperText : undefined}
            slotProps={mergedSlotProps}
            InputLabelProps={mergedInputLabelProps}
            {...props}
        />
    );
};

export default CustomInput;
