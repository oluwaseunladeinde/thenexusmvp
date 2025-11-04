# Building the signin/signup and onboarding workflow 

Professional Dashboard
├── Top Navigation (Sticky)
├── Hero Section (Profile Summary)
├── Main Content Grid
│   ├── Left Sidebar (Profile Completion, Quick Stats)
│   ├── Center Feed (Introduction Requests, Activity)
│   └── Right Sidebar (Career Insights, Suggestions)
└── Mobile Responsive Layout


## Performance and safety concerns with metadata access.

The performance issue can be eliminated by configuring your Clerk session token to include publicMetadata:

Go to Clerk Dashboard → Sessions → Customize session token → Claims editor
Add a claim that maps public metadata into the JWT:
### 
bash```
{
  "metadata": "{{user.public_metadata}}"
}
```
Once configured, metadata will be available in sessionClaims.metadata without API calls. However, there are two additional issues:

Using unsafeMetadata is unsafe: This field is for internal metadata and shouldn't be used for session data. If you need a fallback (e.g., during token refresh delays), fetch from publicMetadata via the API instead.

Unsafe type assertions: Type casting without validation (lines 60-61) can cause runtime errors.

### Suggested fix:

Ensure Clerk's session token is configured as described above
If you need a fallback for the brief period during token refresh, update the API call to use publicMetadata:
-        onboardingComplete = user.unsafeMetadata?.onboardingComplete as boolean;
-        userType = user.unsafeMetadata?.userType as 'professional' | 'hr_partner' | 'admin' | undefined;
+        const publicMetadata = user.publicMetadata as Record<string, unknown>;
+        onboardingComplete = typeof publicMetadata?.onboardingComplete === 'boolean' ? publicMetadata.onboardingComplete : false;
+        userType = ['professional', 'hr_partner', 'admin'].includes(publicMetadata?.userType as string) ? publicMetadata?.userType as 'professional' | 'hr_partner' | 'admin' : undefined;
