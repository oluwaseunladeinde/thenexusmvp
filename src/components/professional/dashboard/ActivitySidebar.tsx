import { LucideIcon } from 'lucide-react';

interface ActivityItem {
    icon: LucideIcon;
    label: string;
    value: number | string;
}

interface ActivitySidebarProps {
    title: string;
    items: ActivityItem[];
}

export default function ActivitySidebar({ title, items }: ActivitySidebarProps) {
    return (
        <div className="bg-card rounded-sm shadow border border-border p-4">
            <h4 className="font-semibold text-foreground mb-3">{title}</h4>
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <item.icon className="w-4 h-4 text-primary" />
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                        </div>
                        <span className="font-semibold text-primary">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
