import { Transition } from '@headlessui/react';
import { Link } from '@inertiajs/react';
import {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
    type Dispatch,
    type ComponentProps,
    type SetStateAction,
} from 'react';

interface DropDownContextValue {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    toggleOpen: () => void;
}

const DropDownContext = createContext<DropDownContextValue | undefined>(
    undefined,
);

function useDropDownContext(): DropDownContextValue {
    const context = useContext(DropDownContext);

    if (!context) {
        throw new Error('Dropdown components must be used inside <Dropdown>.');
    }

    return context;
}

interface DropdownProps {
    children: ReactNode;
}

const Dropdown = ({ children }: DropdownProps) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    const value = useMemo(
        () => ({ open, setOpen, toggleOpen }),
        [open],
    );

    return (
        <DropDownContext.Provider value={value}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

interface TriggerProps {
    children: ReactNode;
}

const Trigger = ({ children }: TriggerProps) => {
    const { open, setOpen, toggleOpen } = useDropDownContext();

    return (
        <>
            <div onClick={toggleOpen}>{children}</div>

            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                ></div>
            )}
        </>
    );
};

interface ContentProps {
    align?: 'left' | 'right';
    width?: '48' | string;
    contentClasses?: string;
    children: ReactNode;
}

const Content = ({
    align = 'right',
    width = '48',
    contentClasses = 'py-1 bg-slate-900',
    children,
}: ContentProps) => {
    const { open, setOpen } = useDropDownContext();

    let alignmentClasses = 'origin-top';

    if (align === 'left') {
        alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right start-0';
    } else if (align === 'right') {
        alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left end-0';
    }

    let widthClasses = '';

    if (width === '48') {
        widthClasses = 'w-48';
    }

    return (
        <>
            <Transition
                show={open}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <div
                    className={`absolute z-50 mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses}`}
                    onClick={() => setOpen(false)}
                >
                    <div
                        className={
                            `rounded-md ring-1 ring-slate-700 ring-opacity-90 ` +
                            contentClasses
                        }
                    >
                        {children}
                    </div>
                </div>
            </Transition>
        </>
    );
};

const DropdownLink = ({
    className = '',
    children,
    ...props
}: ComponentProps<typeof Link>) => {
    return (
        <Link
            {...props}
            className={
                'block w-full px-4 py-2 text-start text-sm leading-5 text-gray-200 transition duration-150 ease-in-out hover:bg-slate-800 focus:bg-slate-800 focus:outline-none ' +
                className
            }
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;
