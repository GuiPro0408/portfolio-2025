import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from '@headlessui/react';

export type SelectValue = string | number;

export interface ListboxOptionItem {
    value: SelectValue;
    label: string;
}

interface ListboxSelectProps {
    label: string;
    value: SelectValue;
    onChange: (value: SelectValue) => void;
    options: ListboxOptionItem[];
    labelClassName?: string;
    containerClassName?: string;
    buttonClassName?: string;
    iconClassName?: string;
    optionsClassName?: string;
    optionClassName?: string;
    ariaLabel?: string;
}

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
}: ListboxSelectProps) {
    if (options.length === 0) {
        return null;
    }

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
                                key={String(option.value ?? 'all')}
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
