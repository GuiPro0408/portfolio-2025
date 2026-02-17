import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

interface ActionSheetProps {
    open: boolean;
    title: string;
    subtitle?: string;
    onClose: () => void;
    children: ReactNode;
}

export default function ActionSheet({
    open,
    title,
    subtitle,
    onClose,
    children,
}: ActionSheetProps) {
    return (
        <Transition show={open}>
            <Dialog className="dashboard-action-sheet-root" onClose={onClose}>
                <TransitionChild
                    enter="dashboard-sheet-fade-enter"
                    enterFrom="dashboard-sheet-fade-from"
                    enterTo="dashboard-sheet-fade-to"
                    leave="dashboard-sheet-fade-leave"
                    leaveFrom="dashboard-sheet-fade-to"
                    leaveTo="dashboard-sheet-fade-from"
                >
                    <div className="dashboard-action-sheet-backdrop" />
                </TransitionChild>

                <div className="dashboard-action-sheet-wrap">
                    <TransitionChild
                        enter="dashboard-sheet-panel-enter"
                        enterFrom="dashboard-sheet-panel-from"
                        enterTo="dashboard-sheet-panel-to"
                        leave="dashboard-sheet-panel-leave"
                        leaveFrom="dashboard-sheet-panel-to"
                        leaveTo="dashboard-sheet-panel-from"
                    >
                        <DialogPanel className="dashboard-action-sheet-panel">
                            <div className="dashboard-action-sheet-header">
                                <div>
                                    <h3>{title}</h3>
                                    {subtitle ? <p>{subtitle}</p> : null}
                                </div>
                                <button
                                    type="button"
                                    className="dashboard-action-sheet-close"
                                    onClick={onClose}
                                    aria-label="Close actions"
                                >
                                    <X size={16} aria-hidden="true" />
                                </button>
                            </div>
                            <div className="dashboard-action-sheet-body">{children}</div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}
