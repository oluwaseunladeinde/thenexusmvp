'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SkillsSelectorProps {
    requiredSkills: string[];
    preferredSkills: string[];
    onRequiredSkillsChange: (skills: string[]) => void;
    onPreferredSkillsChange: (skills: string[]) => void;
    className?: string;
}

const PREDEFINED_SKILLS = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust',
    'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express', 'Django',
    'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB',
    'Redis', 'GraphQL', 'REST APIs', 'Microservices', 'DevOps', 'CI/CD',
    'Machine Learning', 'Data Science', 'Product Management', 'Agile',
    'Scrum', 'Leadership', 'Strategy', 'Finance', 'Marketing', 'Sales'
];

export default function SkillsSelector({
    requiredSkills,
    preferredSkills,
    onRequiredSkillsChange,
    onPreferredSkillsChange,
    className = ""
}: SkillsSelectorProps) {
    const [requiredInput, setRequiredInput] = useState('');
    const [preferredInput, setPreferredInput] = useState('');
    const [filteredRequiredSkills, setFilteredRequiredSkills] = useState<string[]>([]);
    const [filteredPreferredSkills, setFilteredPreferredSkills] = useState<string[]>([]);

    useEffect(() => {
        if (requiredInput) {
            const filtered = PREDEFINED_SKILLS.filter(skill =>
                skill.toLowerCase().includes(requiredInput.toLowerCase()) &&
                !requiredSkills.includes(skill)
            );
            setFilteredRequiredSkills(filtered);
        } else {
            setFilteredRequiredSkills([]);
        }
    }, [requiredInput, requiredSkills]);

    useEffect(() => {
        if (preferredInput) {
            const filtered = PREDEFINED_SKILLS.filter(skill =>
                skill.toLowerCase().includes(preferredInput.toLowerCase()) &&
                !preferredSkills.includes(skill)
            );
            setFilteredPreferredSkills(filtered);
        } else {
            setFilteredPreferredSkills([]);
        }
    }, [preferredInput, preferredSkills]);

    const addRequiredSkill = (skill: string) => {
        if (skill && !requiredSkills.includes(skill)) {
            onRequiredSkillsChange([...requiredSkills, skill]);
        }
        setRequiredInput('');
    };

    const addPreferredSkill = (skill: string) => {
        if (skill && !preferredSkills.includes(skill)) {
            onPreferredSkillsChange([...preferredSkills, skill]);
        }
        setPreferredInput('');
    };

    const removeRequiredSkill = (skillToRemove: string) => {
        onRequiredSkillsChange(requiredSkills.filter(skill => skill !== skillToRemove));
    };

    const removePreferredSkill = (skillToRemove: string) => {
        onPreferredSkillsChange(preferredSkills.filter(skill => skill !== skillToRemove));
    };

    const handleRequiredKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addRequiredSkill(requiredInput.trim());
        }
    };

    const handlePreferredKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addPreferredSkill(preferredInput.trim());
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Required Skills */}
            <div>
                <Label htmlFor="required-skills">Required Skills *</Label>
                <div className="mt-2">
                    <div className="flex gap-2 mb-2">
                        <Input
                            id="required-skills"
                            value={requiredInput}
                            onChange={(e) => setRequiredInput(e.target.value)}
                            onKeyPress={handleRequiredKeyPress}
                            placeholder="Type a skill and press Enter, or select from suggestions"
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addRequiredSkill(requiredInput.trim())}
                            disabled={!requiredInput.trim()}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Suggestions for required skills */}
                    {filteredRequiredSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2 p-2 border rounded bg-gray-50">
                            {filteredRequiredSkills.slice(0, 8).map((skill) => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => addRequiredSkill(skill)}
                                    className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                                >
                                    + {skill}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Selected required skills */}
                    {requiredSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {requiredSkills.map((skill) => (
                                <Badge key={skill} variant="default" className="flex items-center gap-1">
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removeRequiredSkill(skill)}
                                        className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Preferred Skills */}
            <div>
                <Label htmlFor="preferred-skills">Preferred Skills</Label>
                <div className="mt-2">
                    <div className="flex gap-2 mb-2">
                        <Input
                            id="preferred-skills"
                            value={preferredInput}
                            onChange={(e) => setPreferredInput(e.target.value)}
                            onKeyPress={handlePreferredKeyPress}
                            placeholder="Type a skill and press Enter, or select from suggestions"
                            className="flex-1"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addPreferredSkill(preferredInput.trim())}
                            disabled={!preferredInput.trim()}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Suggestions for preferred skills */}
                    {filteredPreferredSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2 p-2 border rounded bg-gray-50">
                            {filteredPreferredSkills.slice(0, 8).map((skill) => (
                                <button
                                    key={skill}
                                    type="button"
                                    onClick={() => addPreferredSkill(skill)}
                                    className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                                >
                                    + {skill}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Selected preferred skills */}
                    {preferredSkills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {preferredSkills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                                    {skill}
                                    <button
                                        type="button"
                                        onClick={() => removePreferredSkill(skill)}
                                        className="ml-1 hover:bg-red-200 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
