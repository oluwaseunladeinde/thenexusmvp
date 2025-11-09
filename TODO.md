# TODO: Make Industry Field Dropdown on Job Forms

## Tasks
- [x] Update create new job form (src/app/dashboard/hr-partner/roles/new/page.tsx) to use Select dropdown for industry field, fetch from industries API, use cached data
- [x] Update edit job form (src/app/dashboard/hr-partner/roles/[id]/edit/page.tsx) to use Select dropdown for industry field, fetch from industries API, use cached data

## Notes
- Use getIndustries from @/lib/cache for caching
- Map industries to SelectItem with value=industryName, display=industryName
- Ensure form data uses industry as string (industryName)