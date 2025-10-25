# Deployment Configuration Update - October 2, 2025

## Summary
Updated deployment configuration to use production Firebase project instead of testing environment.

## Changes Made

### Primary Deployment Target
- **NEW Production URLs:**
  - https://salatiso-lifecv.web.app/
  - https://salatiso-lifecv.firebaseapp.com/

- **Old Testing URLs (kept for reference only):**
  - https://lifecv-d2724.web.app/
  - https://lifecv-d2724.firebaseapp.com/

### Configuration Files Updated

#### 1. `.firebaserc`
- Changed default project from `lifecv-d2724` to `salatiso-lifecv`
- Kept `lifecv-d2724` as a secondary "testing" project
- Separated hosting targets for each project

#### 2. `firebase.json`
- Reordered hosting configurations to prioritize `salatiso-lifecv` as primary target
- Kept `lifecv-d2724` configuration as secondary for testing purposes
- Both configurations maintain the same hosting settings (headers, rewrites, cache control)

### Environment Configuration
The `.env.production` file already has the correct configuration:
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=salatiso-lifecv.web.app`
- `VITE_APP_BASE_URL=https://salatiso-lifecv.web.app`
- Firebase project ID remains: `lifecv-d2724` (internal project identifier)

## Deployment Instructions

### Deploy to Production (salatiso-lifecv)
```bash
npm run build
firebase deploy --only hosting:salatiso-lifecv
```

### Deploy to Testing (lifecv-d2724)
```bash
npm run build
firebase deploy --project testing --only hosting:lifecv-d2724
```

### Deploy to Both
```bash
npm run build
firebase deploy --only hosting
```

## Important Notes

1. **Default Deployment**: Running `firebase deploy` without specifying a project will now deploy to `salatiso-lifecv` (production)
2. **Testing Environment**: The `lifecv-d2724` project is retained for testing purposes and can be deployed using the `--project testing` flag
3. **Firebase Project ID**: The internal Firebase project ID (`lifecv-d2724`) remains the same in configuration files as it's the shared backend
4. **Domain Names**: Both projects use the same Firebase project backend but different hosting domains

## Migration Checklist
- [x] Update `.firebaserc` with new default project
- [x] Reorder `firebase.json` hosting targets
- [x] Verify `.env.production` settings (already correct)
- [ ] Test deployment to production
- [ ] Verify authentication works on new domain
- [ ] Update any external links or documentation pointing to old domain
- [ ] Update README.md with new production URL

## Related Files
- `.firebaserc` - Firebase project configuration
- `firebase.json` - Hosting configuration
- `.env.production` - Environment variables (already configured correctly)
- `AUTHORIZED_FAMILY_MEMBERS.md` - May need URL updates
- `ECOSYSTEM_I18N_COMPLETION_REPORT.md` - May need URL updates
- Other documentation files referencing old URL

## Rollback Instructions
If you need to revert to the testing configuration:
```bash
firebase use testing
firebase deploy --only hosting:lifecv-d2724
```

Or manually update `.firebaserc` to set `"default": "lifecv-d2724"`
