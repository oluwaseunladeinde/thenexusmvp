import { LucideIcon } from 'lucide-react';

interface QuickAction {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
    href?: string;
}

interface QuickActionsProps {
    title: string;
    actions: QuickAction[];
}

export default function QuickActions({ title, actions }: QuickActionsProps) {
    return (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
            <h4 className="font-semibold text-[#0D1B2A] mb-3">{title}</h4>
            <div className="space-y-2">
                {actions.map((action, index) => {
                    const content = (
                        <>
                            <action.icon className="w-4 h-4 text-primary" />
                            {action.label}
                        </>
                    );

                    if (action.href) {
                        return (
                            <a
                                key={index}
                                href={action.href}
                                className="w-full text-left text-sm text-gray-700 hover:bg-gray-50 p-2 rounded flex items-center gap-2"
                            >
                                {content}
                            </a>
                        );
                    }

                    return (
                        <button
                            key={index}
                            onClick={action.onClick}
                            className="w-full text-left text-sm text-gray-700 hover:bg-gray-50 p-2 rounded flex items-center gap-2"
                        >
                            {content}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
