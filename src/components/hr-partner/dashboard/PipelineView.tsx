"use client";

import React, { useState, useEffect } from "react";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    sortableKeyboardCoordinates,
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CandidateCard {
    id: string;
    name: string;
    role: string;
    status: string;
}

const columnsOrder = [
    "search",
    "contacted",
    "accepted",
    "interview",
    "offer",
];

const columnLabels: Record<string, string> = {
    search: "Search",
    contacted: "Contacted",
    accepted: "Accepted",
    interview: "Interview",
    offer: "Offer",
};

const initialCandidates: CandidateCard[] = [
    { id: "1", name: "John Doe", role: "Software Engineer", status: "search" },
    { id: "2", name: "Jane Smith", role: "Product Manager", status: "contacted" },
    { id: "3", name: "Alice Johnson", role: "UX Designer", status: "accepted" },
    { id: "4", name: "Michael Brown", role: "QA Analyst", status: "interview" },
    { id: "5", name: "Emily Davis", role: "DevOps Engineer", status: "offer" },
];

const PipelineView: React.FC = () => {
    const [candidates, setCandidates] = useState<CandidateCard[]>([]);

    useEffect(() => {
        setCandidates(initialCandidates);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const getCandidatesByStatus = (status: string) =>
        candidates.filter((c) => c.status === status);

    const onDragOver = (event: DragOverEvent) => {
        // Intentionally empty
    };

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || !active) return;

        if (active.id !== over.id) {
            const activeCandidate = candidates.find(c => c.id === active.id);
            const overCandidateStatus = over.id as string;

            if (activeCandidate) {
                setCandidates((items) => {
                    // Remove dragged candidate from old position
                    const filtered = items.filter(c => c.id !== active.id);

                    // Candidates grouped by status for reconstruction in correct order
                    const groupedByStatus = columnsOrder.reduce<Record<string, CandidateCard[]>>((acc, status) => {
                        acc[status] = filtered.filter(c => c.status === status);
                        return acc;
                    }, {});

                    // Insert dragged candidate at the start of destination column
                    groupedByStatus[overCandidateStatus] = [{ ...activeCandidate, status: overCandidateStatus }, ...groupedByStatus[overCandidateStatus]];

                    // Flatten candidates maintaining column order
                    return columnsOrder.flatMap(status => groupedByStatus[status] || []);
                });
            }
        }
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6 overflow-x-auto">
            <h3 className="text-lg font-semibold text-foreground mb-4">Pipeline View</h3>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                <div className="flex space-x-6 min-w-max">
                    {columnsOrder.map((col) => (
                        <SortableContext
                            key={col}
                            items={getCandidatesByStatus(col).map(c => c.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="bg-background rounded-md shadow p-3 w-60 flex-shrink-0 min-h-[200px]">
                                <h4 className="font-semibold text-foreground mb-3">{columnLabels[col]}</h4>
                                {getCandidatesByStatus(col).map((candidate) => (
                                    <SortableCandidateCard key={candidate.id} candidate={candidate} />
                                ))}
                            </div>
                        </SortableContext>
                    ))}
                </div>
            </DndContext>
        </div>
    );
};

interface SortableCandidateCardProps {
    candidate: CandidateCard;
}

const SortableCandidateCard: React.FC<SortableCandidateCardProps> = ({ candidate }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: candidate.id, animateLayoutChanges: (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true }) });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        cursor: 'grab',
        opacity: isDragging ? 0.8 : 1,
        userSelect: 'text' as 'text' | 'none' | 'auto',
        marginBottom: '0.75rem',
        padding: '0.75rem',
        borderRadius: '0.375rem',
        border: '1px solid var(--border)',
        backgroundColor: isDragging ? 'var(--primary-light)' : 'var(--card-background)',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} tabIndex={0}>
            <div className="font-medium text-foreground">{candidate.name}</div>
            <div className="text-sm text-muted-foreground">{candidate.role}</div>
        </div>
    );
};

export default PipelineView;
