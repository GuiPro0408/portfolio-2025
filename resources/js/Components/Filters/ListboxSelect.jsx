import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';

export default function ListboxSelect({
    label,
    value,
    onChange,
    options,
    labelClassName,
    containerClassName,
    buttonClassName,
    iconClassName,
    optionsClassName,
    optionClassName,
    ariaLabel,
}) {
    const selectedOption =
        options.find((option) => option.value === value) ?? options[0];

    return (
        <label className={labelClassName}>
            {label}
            <Listbox value={selectedOption.value} onChange={onChange}>
                <div className={containerClassName}>
                    <ListboxButton
                        className={buttonClassName}
                        aria-label={ariaLabel}
                    >
                        <span>{selectedOption.label}</span>
                        <span className={iconClassName} aria-hidden="true">
                            ▾
                        </span>
                    </ListboxButton>
                    <ListboxOptions className={optionsClassName}>
                        {options.map((option) => (
                            <ListboxOption
                                key={option.value || 'all'}
                                value={option.value}
                                className={optionClassName}
                            >
                                {option.label}
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            </Listbox>
        </label>
    );
}
