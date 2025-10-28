import { Users } from 'lucide-react';

const EmptyIntroductionRequests = () => {
    return (
        <div className="bg-white rounded-sm border border-gray-200 p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Introduction Requests Yet
                    </h3>
                    <p className="text-gray-600 text-sm max-w-md">
                        When HR partners find your profile interesting, they'll send you introduction requests for relevant opportunities.
                        Keep your profile updated to increase your chances!
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>💡</span>
                    <span>Complete your profile to get more visibility</span>
                </div>
            </div>
        </div>
    );
};

export default EmptyIntroductionRequests;
