'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useOnboardingStore } from '@/lib/stores/onboardingStore'
import { X, Plus, Upload } from 'lucide-react'
import { useAlert } from '@/components/ui/alert'

const skillsLinksSchema = z.object({
    skills: z.array(z.string().min(1, 'Skill cannot be empty')).min(1, 'At least one skill is required').max(10, 'Maximum 10 skills allowed'),
    linkedinUrl: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
    portfolioUrl: z.string().url('Please enter a valid portfolio URL').optional().or(z.literal('')),
    resumeFile: z.any().optional(),
})

type SkillsLinksForm = z.infer<typeof skillsLinksSchema>

export function Step3SkillsLinks() {
    const { updateSkillsAndLinks, skills, linkedinUrl, portfolioUrl, resumeUrl } = useOnboardingStore()
    const { showAlert } = useAlert()
    const [skillInput, setSkillInput] = useState('')
    const [resumeFile, setResumeFile] = useState<File | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch,
        trigger,
    } = useForm<SkillsLinksForm>({
        resolver: zodResolver(skillsLinksSchema),
        defaultValues: {
            skills,
            linkedinUrl,
            portfolioUrl,
        },
        mode: 'onChange',
    })

    const watchedSkills = watch('skills') || [];

    useEffect(() => {
        return () => {
            if (resumeUrl && resumeUrl.startsWith('blob:')) {
                URL.revokeObjectURL(resumeUrl)
            }
        }
    }, [resumeUrl])

    const onSubmit = (data: SkillsLinksForm) => {
        updateSkillsAndLinks({
            skills: data.skills,
            linkedinUrl: data.linkedinUrl,
            portfolioUrl: data.portfolioUrl,
            resumeUrl: resumeFile ? URL.createObjectURL(resumeFile) : resumeUrl,
        })
    }

    // Auto-save on form changes
    useEffect(() => {
        const subscription = watch((value) => {
            updateSkillsAndLinks({
                skills: value.skills?.filter((skill): skill is string => skill !== undefined) || [],
                linkedinUrl: value.linkedinUrl,
                portfolioUrl: value.portfolioUrl,
            })
        })
        return () => subscription.unsubscribe()
    }, [watch, updateSkillsAndLinks])

    const addSkill = () => {
        if (skillInput.trim() && watchedSkills.length < 10) {
            const newSkills = [...watchedSkills, skillInput.trim()]
            setValue('skills', newSkills)
            setSkillInput('')
            trigger('skills')
        }
    }

    const removeSkill = (index: number) => {
        const newSkills = watchedSkills.filter((_, i) => i !== index)
        setValue('skills', newSkills)
        trigger('skills')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            addSkill()
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type and size
            if (file.type !== 'application/pdf') {
                showAlert('error', 'Please upload a PDF file')
                return
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB
                showAlert('error', 'File size must be less than 5MB')
                return
            }
            setResumeFile(file)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-100">Skills & Links</h2>
                <p className="text-gray-600 dark:text-gray-400">Showcase your expertise and professional presence</p>
            </div>

            {/* Skills */}
            <div>
                <Label className="text-base font-medium dark:text-gray-200">Skills *</Label>
                <p className="text-sm text-gray-500 mb-3 dark:text-gray-400">
                    Add up to 10 skills that best describe your expertise
                </p>

                {/* Add Skill Input */}
                <div className="flex gap-2 mb-3">
                    <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyPress={handleKeyDown}
                        placeholder="e.g., Product Management, Agile, Data Analysis"
                        disabled={watchedSkills.length >= 10}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                    />
                    <Button
                        type="button"
                        onClick={addSkill}
                        disabled={!skillInput.trim() || watchedSkills.length >= 10}
                        variant="outline"
                        className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                {/* Skills List */}
                <div className="flex flex-wrap gap-2 mb-2">
                    {watchedSkills.map((skill, index) => (
                        <div
                            key={index}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                            {skill}
                            <button
                                type="button"
                                onClick={() => removeSkill(index)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {watchedSkills.length}/10 skills added
                </p>

                {errors.skills && (
                    <p className="text-red-500 text-sm mt-1">{errors.skills.message}</p>
                )}
            </div>

            {/* LinkedIn URL */}
            <div>
                <Label htmlFor="linkedinUrl" className="dark:text-gray-200">LinkedIn Profile</Label>
                <Input
                    id="linkedinUrl"
                    {...register('linkedinUrl')}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 ${errors.linkedinUrl ? 'border-red-500' : ''}`}
                />
                {errors.linkedinUrl && (
                    <p className="text-red-500 text-sm mt-1">{errors.linkedinUrl.message}</p>
                )}
            </div>

            {/* Portfolio URL */}
            <div>
                <Label htmlFor="portfolioUrl" className="dark:text-gray-200">Portfolio/Website</Label>
                <Input
                    id="portfolioUrl"
                    {...register('portfolioUrl')}
                    placeholder="https://yourportfolio.com"
                    className={`dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400 ${errors.portfolioUrl ? 'border-red-500' : ''}`}
                />
                {errors.portfolioUrl && (
                    <p className="text-red-500 text-sm mt-1">{errors.portfolioUrl.message}</p>
                )}
            </div>

            {/* Resume Upload */}
            <div>
                <Label className="text-base font-medium dark:text-gray-200">Resume/CV</Label>
                <p className="text-sm text-gray-500 mb-3 dark:text-gray-400">
                    Upload your resume in PDF format (max 5MB)
                </p>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center dark:border-gray-600">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                            <Upload className="w-8 h-8 text-gray-400 mb-2 dark:text-gray-500" />
                            <p className="text-sm text-gray-600 mb-1 dark:text-gray-400">
                                {resumeFile ? resumeFile.name : 'Click to upload your resume'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                                PDF files only, up to 5MB
                            </p>
                        </div>
                    </label>
                </div>

                {resumeFile && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded dark:bg-green-900/20 dark:border-green-800">
                        <p className="text-sm text-green-800 dark:text-green-300">
                            ✓ {resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                    </div>
                )}
            </div>

            {/* Completion Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-900/20 dark:border-green-800">
                <h3 className="text-sm font-medium text-green-900 mb-1 dark:text-green-200">
                    Almost Done!
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                    Once you submit this form, your professional profile will be created and you'll be
                    redirected to your dashboard where you can start receiving relevant opportunities.
                </p>
            </div>

            <Button type="submit" className="w-full">
                Complete Profile
            </Button>
        </form>
    )
}
