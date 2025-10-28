import Image from 'next/image';
import React from 'react'

export const Logo = ({ small = false }: { small?: boolean }) => {

    if (small) {
        return (
            <div className="flex items-center justify-center gap-2">
                <Image
                    src={'/assets/logoV.png'}
                    className='border border-border'
                    alt='Company Logo'
                    width={50}
                    height={50}
                />
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center gap-2">
            <Image
                src="/assets/logoV.png"
                alt="theNexus Logo"
                width={50}
                height={50}
            />
            <div className='flex flex-col text-left'>
                <div className="font-bold text-xl text-secondary">
                    theNexus
                </div>
                <div className='font-medium text-sm text-[#666666]'>
                    Premier Talent Network
                </div>
            </div>
        </div>
    )
};

export const LogoFull = () => {
    return (
        <div className="flex items-center shrink-0 px-4 mb-8">
            <Image src={'/assets/logoII.png'} className='border border-border' alt='Company Logo' width={250} height={100} />
            <div className="ml-3">
                <p className="text-xs text-slate-500">Professional Networking</p>
            </div>
        </div>
    )
};

export const LogoFullII = () => {
    return (
        <div className="flex items-center space-x-3">
            <Image src={'/assets/logoV.png'} className='border border-border' alt='Company Logo' width={250} height={100} />
            <div>
                <h1 className="text-left text-lg font-bold text-gray-800">theNexus</h1>
                <p className="text-xs text-gray-500">Professional Networking</p>
            </div>
        </div>
    )
}
