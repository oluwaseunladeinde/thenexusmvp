'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useOnboardingStore } from '@/lib/stores/onboardingStore'
import { prisma } from '@/lib/database/prisma'

const basicInfoSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    profileHeadline: z.string().min(1, 'Profile headline is required').max(200, 'Headline must be less than 200 characters'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    yearsOfExperience: z.number().min(0, 'Years of experience must be at least 0').max(50, 'Years of experience must be less than 50'),
    currentTitle: z.string().min(1, 'Current title is required'),
    currentCompany: z.string().min(1, 'Current company is required'),
    industry: z.string().min(1, 'Industry is required'),
})

type BasicInfoForm = z.infer<typeof basicInfoSchema>

export function Step1BasicInfo() {
    const { updateBasicInfo, firstName, lastName, profileHeadline, state, city, yearsOfExperience, currentTitle, currentCompany, industry } = useOnboardingStore()
    const [states, setStates] = useState<Array<{ id: string; name: string }>>([])
    const [cities, setCities] = useState<Array<{ id: string; name: string }>>([])
    const [loading, setLoading] = useState(true)

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch,
        trigger,
    } = useForm<BasicInfoForm>({
        resolver: zodResolver(basicInfoSchema),
        defaultValues: {
            firstName,
            lastName,
            profileHeadline,
            state,
            city,
            yearsOfExperience,
            currentTitle,
            currentCompany,
            industry,
        },
        mode: 'onChange',
    })

    const selectedState = watch('state')

    // Load states on component mount
    useEffect(() => {
        const loadStates = async () => {
            try {
                // For now, using hardcoded Nigerian states. In production, fetch from API
                const nigerianStates = [
                    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
                    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT', 'Gombe',
                    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
                    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
                    'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
                ]
                setStates(nigerianStates.map(name => ({ id: name, name })))
            } catch (error) {
                console.error('Failed to load states:', error)
            } finally {
                setLoading(false)
            }
        }

        loadStates()
    }, [])

    // Load cities when state changes
    useEffect(() => {
        const loadCities = async () => {
            if (!selectedState) {
                setCities([])
                return
            }

            try {
                // For now, using sample cities. In production, fetch from API based on state
                const sampleCities: Record<string, string[]> = {
                    'Lagos': ['Lagos Island', 'Ikeja', 'Surulere', 'Yaba', 'Victoria Island', 'Lekki'],
                    'Abuja': ['Wuse', 'Maitama', 'Asokoro', 'Garki', 'Jabi'],
                    'Kano': ['Kano Municipal', 'Fagge', 'Dala', 'Gwale'],
                    'Ibadan': ['Ibadan North', 'Ibadan South-East', 'Ibadan North-West'],
                    'Port Harcourt': ['Port Harcourt City', 'Obio-Akpor', 'Eleme'],
                    // Add more states and cities as needed
                }

                const stateCities = sampleCities[selectedState] || [`${selectedState} City`]
                setCities(stateCities.map(name => ({ id: name, name })))

                // Reset city if current city is not in the new state's cities
                if (city && !stateCities.includes(city)) {
                    setValue('city', '')
                }
            } catch (error) {
                console.error('Failed to load cities:', error)
            }
        }

        loadCities()
    }, [selectedState, city, setValue])

    const onSubmit = (data: BasicInfoForm) => {
        updateBasicInfo(data)
    }

    // Auto-save on form changes
    useEffect(() => {
        const subscription = watch((value) => {
            updateBasicInfo(value as any)
        })
        return () => subscription.unsubscribe()
    }, [watch, updateBasicInfo])

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
                <p className="text-gray-600">Tell us about yourself and your current role</p>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                        id="firstName"
                        {...register('firstName')}
                        placeholder="Enter your first name"
                        className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                        id="lastName"
                        {...register('lastName')}
                        placeholder="Enter your last name"
                        className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                </div>
            </div>

            {/* Profile Headline */}
            <div>
                <Label htmlFor="profileHeadline">Profile Headline *</Label>
                <Textarea
                    id="profileHeadline"
                    {...register('profileHeadline')}
                    placeholder="e.g., Senior Product Manager with 8+ years in fintech"
                    className={errors.profileHeadline ? 'border-red-500' : ''}
                    rows={3}
                />
                {errors.profileHeadline && (
                    <p className="text-red-500 text-sm mt-1">{errors.profileHeadline.message}</p>
                )}
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="state">State *</Label>
                    <Select
                        value={watch('state')}
                        onValueChange={(value) => {
                            setValue('state', value)
                            trigger('state')
                        }}
                    >
                        <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select your state" />
                        </SelectTrigger>
                        <SelectContent>
                            {states.map((state) => (
                                <SelectItem key={state.id} value={state.name}>
                                    {state.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.state && (
                        <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="city">City *</Label>
                    <Select
                        value={watch('city')}
                        onValueChange={(value) => {
                            setValue('city', value)
                            trigger('city')
                        }}
                        disabled={!selectedState}
                    >
                        <SelectTrigger className={errors.city ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select your city" />
                        </SelectTrigger>
                        <SelectContent>
                            {cities.map((city) => (
                                <SelectItem key={city.id} value={city.name}>
                                    {city.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                </div>
            </div>

            {/* Experience */}
            <div>
                <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                <Input
                    id="yearsOfExperience"
                    type="number"
                    {...register('yearsOfExperience', { valueAsNumber: true })}
                    placeholder="e.g., 5"
                    min="0"
                    max="50"
                    className={errors.yearsOfExperience ? 'border-red-500' : ''}
                />
                {errors.yearsOfExperience && (
                    <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience.message}</p>
                )}
            </div>

            {/* Current Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="currentTitle">Current Title *</Label>
                    <Input
                        id="currentTitle"
                        {...register('currentTitle')}
                        placeholder="e.g., Senior Product Manager"
                        className={errors.currentTitle ? 'border-red-500' : ''}
                    />
                    {errors.currentTitle && (
                        <p className="text-red-500 text-sm mt-1">{errors.currentTitle.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="currentCompany">Current Company *</Label>
                    <Input
                        id="currentCompany"
                        {...register('currentCompany')}
                        placeholder="e.g., Flutterwave"
                        className={errors.currentCompany ? 'border-red-500' : ''}
                    />
                    {errors.currentCompany && (
                        <p className="text-red-500 text-sm mt-1">{errors.currentCompany.message}</p>
                    )}
                </div>
            </div>

            {/* Industry */}
            <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select
                    value={watch('industry')}
                    onValueChange={(value) => {
                        setValue('industry', value)
                        trigger('industry')
                    }}
                >
                    <SelectTrigger className={errors.industry ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select your industry" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Fintech">Fintech</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Consulting">Consulting</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Real Estate">Real Estate</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                </Select>
                {errors.industry && (
                    <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
                )}
            </div>
        </form>
    )
}
