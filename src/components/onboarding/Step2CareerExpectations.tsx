'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useOnboardingStore } from '@/lib/stores/onboardingStore'
import { Shield } from 'lucide-react'

const careerExpectationsSchema = z.object({
    minSalary: z.number().min(0, 'Minimum salary must be at least 0'),
    maxSalary: z.number().min(0, 'Maximum salary must be at least 0'),
    noticePeriod: z.string().min(1, 'Notice period is required'),
    willingToRelocate: z.boolean(),
    openToOpportunities: z.boolean(),
}).refine((data) => data.maxSalary >= data.minSalary, {
    message: 'Maximum salary must be greater than or equal to minimum salary',
    path: ['maxSalary'],
})

type CareerExpectationsForm = z.infer<typeof careerExpectationsSchema>

export function Step2CareerExpectations() {
    const {
        updateCareerExpectations,
        minSalary,
        maxSalary,
        noticePeriod,
        willingToRelocate,
        openToOpportunities
    } = useOnboardingStore()

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch,
        trigger,
    } = useForm<CareerExpectationsForm>({
        resolver: zodResolver(careerExpectationsSchema),
        defaultValues: {
            minSalary,
            maxSalary,
            noticePeriod,
            willingToRelocate,
            openToOpportunities,
        },
        mode: 'onChange',
    })

    const watchedMinSalary = watch('minSalary')
    const watchedMaxSalary = watch('maxSalary')

    const onSubmit = (data: CareerExpectationsForm) => {
        updateCareerExpectations(data)
    }

    // Auto-save on form changes
    useEffect(() => {
        const subscription = watch((value) => {
            updateCareerExpectations(value as any)
        })
        return () => subscription.unsubscribe()
    }, [watch, updateCareerExpectations])

    // Format salary as Naira currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Career Expectations</h2>
                <p className="text-gray-600">Share your salary expectations and availability</p>
            </div>

            {/* Salary Expectations */}
            <div className="space-y-4">
                <Label className="text-base font-medium">Salary Expectations (₦ Naira)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="minSalary">Minimum Salary</Label>
                        <Input
                            id="minSalary"
                            type="number"
                            {...register('minSalary', { valueAsNumber: true })}
                            placeholder="e.g., 5000000"
                            min="0"
                            step="50000"
                            className={errors.minSalary ? 'border-red-500' : ''}
                        />
                        {watchedMinSalary && (
                            <p className="text-sm text-gray-500 mt-1">
                                {formatCurrency(watchedMinSalary)}
                            </p>
                        )}
                        {errors.minSalary && (
                            <p className="text-red-500 text-sm mt-1">{errors.minSalary.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="maxSalary">Maximum Salary</Label>
                        <Input
                            id="maxSalary"
                            type="number"
                            {...register('maxSalary', { valueAsNumber: true })}
                            placeholder="e.g., 8000000"
                            min="0"
                            step="50000"
                            className={errors.maxSalary ? 'border-red-500' : ''}
                        />
                        {watchedMaxSalary && (
                            <p className="text-sm text-gray-500 mt-1">
                                {formatCurrency(watchedMaxSalary)}
                            </p>
                        )}
                        {errors.maxSalary && (
                            <p className="text-red-500 text-sm mt-1">{errors.maxSalary.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Notice Period */}
            <div>
                <Label htmlFor="noticePeriod">Notice Period *</Label>
                <Select
                    value={watch('noticePeriod')}
                    onValueChange={(value) => {
                        setValue('noticePeriod', value)
                        trigger('noticePeriod')
                    }}
                >
                    <SelectTrigger className={errors.noticePeriod ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select your notice period" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="1_week">1 Week</SelectItem>
                        <SelectItem value="2_weeks">2 Weeks</SelectItem>
                        <SelectItem value="1_month">1 Month</SelectItem>
                        <SelectItem value="2_months">2 Months</SelectItem>
                        <SelectItem value="3_months">3 Months</SelectItem>
                        <SelectItem value="6_months">6 Months</SelectItem>
                    </SelectContent>
                </Select>
                {errors.noticePeriod && (
                    <p className="text-red-500 text-sm mt-1">{errors.noticePeriod.message}</p>
                )}
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="willingToRelocate"
                        checked={watch('willingToRelocate')}
                        onCheckedChange={(checked) => {
                            setValue('willingToRelocate', checked as boolean)
                            trigger('willingToRelocate')
                        }}
                    />
                    <Label htmlFor="willingToRelocate" className="text-sm">
                        I am willing to relocate for the right opportunity
                    </Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="openToOpportunities"
                        checked={watch('openToOpportunities')}
                        onCheckedChange={(checked) => {
                            setValue('openToOpportunities', checked as boolean)
                            trigger('openToOpportunities')
                        }}
                    />
                    <Label htmlFor="openToOpportunities" className="text-sm">
                        I am open to new opportunities
                    </Label>
                </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-medium text-blue-900 mb-1">
                            Privacy Guarantee
                        </h3>
                        <p className="text-sm text-blue-700">
                            Your salary expectations and career preferences are kept completely confidential.
                            We use this information only to match you with relevant opportunities and never
                            share it with potential employers without your explicit consent.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    )
}
