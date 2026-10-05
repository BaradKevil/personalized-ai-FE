import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';

const CustomSelect = ({
    label,
    name,
    value,
    onChange,
    onBlur,
    options = [],
    error,
    helperText,
    placeholder,
    formik,
    ...props
}) => {
    const selectedValue = formik ? (formik.values[name] ?? '') : (value ?? '');
    const handleChange = formik ? formik.handleChange : onChange;
    const handleBlur = formik ? formik.handleBlur : onBlur;
    const hasError = error || (formik && Boolean(formik.touched[name] && formik.errors[name]));
    const errText = helperText || (formik && formik.touched[name] && formik.errors[name]);

    // When there's a placeholder or a value is chosen, shrink the label so it doesn't overlap text
    const shouldShrink = Boolean(selectedValue !== '' || placeholder || props.shrink);

    return (
        <FormControl fullWidth error={Boolean(hasError)}>
            {label && (
                <InputLabel
                    id={`${name}-label`}
                    shrink={shouldShrink ? true : undefined}
                    sx={{ fontWeight: 500 }}
                >
                    {label}
                </InputLabel>
            )}
            <Select
                id={name}
                name={name}
                labelId={`${name}-label`}
                value={selectedValue}
                onChange={handleChange}
                onBlur={handleBlur}
                displayEmpty={Boolean(placeholder || props.displayEmpty)}
                {...props}
                label={label}
                notched={shouldShrink ? true : undefined}
                renderValue={
                    props.renderValue ||
                    ((selected) => {
                        if (!selected || selected === '') {
                            return placeholder ? (
                                <span style={{ color: 'var(--text-muted, #71717A)' }}>{placeholder}</span>
                            ) : (
                                ''
                            );
                        }
                        const match = options.find((opt) =>
                            typeof opt === 'object' && opt !== null ? opt.value === selected : opt === selected
                        );
                        if (match) {
                            return typeof match === 'object' && match.label ? match.label : match;
                        }
                        return selected;
                    })
                }
                sx={{
                    borderRadius: '8px',
                    bgcolor: 'var(--surface)',
                    ...props.sx,
                }}
            >
                {placeholder && (
                    <MenuItem value="" disabled sx={{ color: 'var(--text-muted)' }}>
                        {placeholder}
                    </MenuItem>
                )}
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
            {hasError && <FormHelperText>{errText}</FormHelperText>}
        </FormControl>
    );
};

export default CustomSelect;
