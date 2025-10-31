# 📋 Phase 4 & 5 Quick Reference - Development Workflow

## 🔄 Deployment Workflow Pattern

After Phase 3 completion, follow this pattern for each subsequent phase:

```
Phase X Development
    ↓
Code + Commit
    ↓
npm run build (verify 0 errors)
    ↓
firebase deploy --only hosting
    ↓
Verify URLs live
    ↓
Phase X+1 Planning
```

---

## 🎯 Phase 4: Google Gemini Cloud Function (Week 1)

### Estimated Duration: 2-3 hours

### Development Tasks:
1. **Enable Vertex AI API** in Google Cloud Console
2. **Create processChat Cloud Function**
3. **Integrate Google Gemini API**
4. **Set up environment variables**
5. **Test function locally**

### Files to Create/Modify:
- `functions/src/index.ts` - Main Cloud Function
- `functions/src/geminiService.ts` - Gemini integration
- `.env.local` - API keys (local dev)
- `firebase.json` - Functions config

### Deployment Command:
```bash
# After Phase 4 completion:
npm run build
firebase deploy --only hosting,functions
```

### Success Criteria:
- ✅ Build successful (0 errors)
- ✅ Functions deployed to Firebase
- ✅ Chatbot responds to messages via Cloud Function
- ✅ Both URLs live and functional

---

## 🧪 Phase 5: RBAC Testing & Verification (Week 1-2)

### Estimated Duration: 2-3 hours

### Testing Tasks:
1. **Unit Tests** - All 4 RBAC services
2. **Integration Tests** - Firestore interaction
3. **Performance Tests** - <50ms latency verification
4. **Coverage Analysis** - Target 80%+
5. **Age Routing Tests** - 4 age bands

### Files to Create:
- `src/services/rbac/__tests__/roleService.test.ts`
- `src/services/rbac/__tests__/permissionService.test.ts`
- `src/services/rbac/__tests__/contentFilterService.test.ts`
- `src/services/rbac/__tests__/ageRoutingService.test.ts`

### Deployment Command:
```bash
# After Phase 5 completion:
npm run test -- --coverage
npm run build
firebase deploy --only hosting
```

### Success Criteria:
- ✅ All tests passing
- ✅ Coverage >80%
- ✅ Performance <50ms
- ✅ Build successful
- ✅ Both URLs live and functional

---

## 🔐 Security & Quality Gates

Before EACH phase deployment:

### Code Quality
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Code properly formatted
- [ ] No dead code

### Build Quality
- [ ] `npm run build` succeeds
- [ ] 0 compilation errors
- [ ] All pages generated (75/75+)
- [ ] No build warnings related to code

### Testing (Phases 4+)
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] No console errors during tests
- [ ] Coverage meets target (80%+)

### Firestore
- [ ] Security rules deployed (if changed)
- [ ] Collections verified in Firebase Console
- [ ] Test data accessible

### Firebase Deployment
- [ ] Both URLs respond
- [ ] No 404 errors on key pages
- [ ] Admin pages accessible
- [ ] Authentication working
- [ ] API endpoints responding

---

## 🚀 Quick Command Reference

### Daily Development:
```bash
# Start development
npm run dev

# Build for testing
npm run build

# Run tests (Phase 5+)
npm run test

# Check test coverage (Phase 5+)
npm run test -- --coverage
```

### Phase Completion & Deployment:
```bash
# 1. Verify everything works
npm run build

# 2. Stop any running processes
taskkill /F /IM node.exe

# 3. Deploy to Firebase
firebase deploy --only hosting

# 4. For Phase 4 (with functions)
firebase deploy --only hosting,functions

# 5. Git commit with phase tag
git add -A
git commit -m "🚀 Phase X: Complete - Deploy to Firebase"
git tag phase-X-complete
git push origin main --tags
```

---

## 📊 Deployment Timeline

| Phase | Estimated Time | Deploy Command | Status |
|-------|---|---|---|
| **Phase 3** | Oct 31 | `firebase deploy --only hosting` | 🔄 In Progress |
| **Phase 4** | Week 1 (2-3 hrs) | `firebase deploy --only hosting,functions` | ⏳ Next |
| **Phase 5** | Week 1-2 (2-3 hrs) | `firebase deploy --only hosting` | ⏳ After Phase 4 |
| **Phase 6** | Week 2+ | `firebase deploy` (full) | ⏳ After Phase 5 |

---

## 🎓 Key Points

### Important Rules:
1. ✅ **Always build before deploying** - `npm run build`
2. ✅ **Always verify build succeeds** - Look for "✓ Compiled successfully"
3. ✅ **Always test URLs after deploy** - Load https://lifecv-d2724.web.app
4. ✅ **Always commit before deploying** - `git add -A && git commit`
5. ✅ **Always tag phase completions** - `git tag phase-X-complete`

### Never:
- ❌ Deploy with build errors
- ❌ Deploy without testing URLs
- ❌ Skip the build step
- ❌ Deploy uncommitted changes
- ❌ Deploy to production without verifying staging

---

## 📞 Troubleshooting

### Build Fails:
```bash
# 1. Check for errors
npm run build

# 2. Clear cache if needed
rm -r .next

# 3. Rebuild
npm run build
```

### Deployment Fails:
```bash
# 1. Make sure you're logged in
firebase login

# 2. Check project
firebase projects:list

# 3. Try deployment again
firebase deploy --only hosting
```

### URLs Not Loading:
```bash
# 1. Check Firebase Console deployment status
# 2. Clear browser cache (Ctrl+Shift+Delete)
# 3. Try both URLs:
#    - https://lifecv-d2724.web.app
#    - https://salatiso-lifecv.web.app
```

---

## ✅ Checklist Template

Use this for each phase deployment:

```markdown
## Phase X Deployment Checklist

- [ ] All code written and tested
- [ ] All changes committed: `git add -A && git commit -m "..."`
- [ ] Build passes: `npm run build`
- [ ] Build shows "✓ Compiled successfully"
- [ ] No TypeScript errors
- [ ] Tests passing (if applicable)
- [ ] Firebase login verified: `firebase projects:list`
- [ ] Deployment starts: `firebase deploy --only hosting`
- [ ] Deployment shows "Deploy complete!"
- [ ] Staging URL loads: https://lifecv-d2724.web.app
- [ ] Production URL loads: https://salatiso-lifecv.web.app
- [ ] Key features working on both URLs
- [ ] Git tag created: `git tag phase-X-complete`
- [ ] Changes pushed: `git push origin main --tags`
- [ ] Documentation updated
- [ ] Phase X marked complete ✅
```

---

**Current Phase:** 3 (50% complete, awaiting KB initialization & deployment)  
**Next Phase:** 4 (Google Gemini - Week 1)  
**Target:** All phases deployed to Firebase with continuous deployment at phase completion  
**Last Updated:** Oct 31, 2025
