# v0.12.0 Release Preparation Checklist

← [Back to Developer Documentation](../README-DEV.md)

## 1. Verify repository boundaries

Confirm:

```text
src/matchmaking/              tracked source code
operator-console/             tracked console source
misc/matchmaking-demo/        tracked synthetic fixtures
matchmaking/                  untracked runtime records
templates/*.css               tracked PDF styles
operator-console/src/styles/  tracked console UI styles
```

## 2. Confirm `.gitignore`

Recommended:

```gitignore
# Matchmaking runtime records
/matchmaking/profiles/
/matchmaking/evaluations/
/matchmaking/introductions/
/matchmaking/pool-index.json

# Console local staging and builds
/operator-console/staging/
/operator-console/dist/
/operator-console/node_modules/

# Root dependencies and generated output
/node_modules/
```

Do not ignore:

```text
misc/matchmaking-demo/
src/matchmaking/
scripts/tests/matchmaking/
```

## 3. Run targeted matchmaking tests

```powershell
node scripts/tests/matchmaking/compatibility-profile.smoke.test.js
node scripts/tests/matchmaking/pair-compatibility.smoke.test.js
node scripts/tests/matchmaking/matchmaking-pool.smoke.test.js
node scripts/tests/matchmaking/group-compatibility.smoke.test.js
node scripts/tests/matchmaking/introduction-workflow.smoke.test.js
```

Expected:

```text
6/6
6/6
6/6
6/6
7/7
```

## 4. Run the full project suite

```powershell
node scripts/tests/runAllTests.js
```

When appropriate:

```powershell
node scripts/tests/runAllTests.js --include-fixtures
```

## 5. Validate the Operator Console

```powershell
cd operator-console
npm.cmd install
npm.cmd run build
npm.cmd run dev
```

Manual checks:

- Campaign Operations loads.
- Matchmaking Overview loads.
- Demo dataset imports.
- Pair details display.
- Group Builder shows grouped blockers and discussion points.
- Introduction drafts can be created from an eligible result.
- Contact references remain hidden before approval.
- Demo cleanup removes only demo records.

## 6. Check runtime cleanup

Before staging:

```powershell
git status --short
```

Verify no live applicant data appears under:

```text
matchmaking/
```

Clear demo runtime data through the console if needed. Preserved fixtures under `misc/matchmaking-demo/` should remain.

## 7. Review package versions

Confirm intended versions in:

- root `package.json`;
- `operator-console/package.json`;
- lock files;
- README;
- changelog.

Recommended release marker:

```text
root runtime: v0.12.0
operator console: v0.2.0
```

## 8. Review changes

```powershell
git diff --stat
git diff -- README.md CHANGELOG.md
git status
```

Inspect especially:

- schemas;
- validators;
- consent handling;
- introduction release gates;
- `.gitignore`;
- generated or temporary files.

## 9. Commit

```powershell
git add -A
git status
git commit -m "Add matchmaking and controlled introduction workflow"
```

## 10. Synchronize

```powershell
git fetch origin
git status
git log --oneline --decorate -10
```

When the remote branch has moved:

```powershell
git pull --rebase origin <branch-name>
```

Rerun tests after resolving any rebase conflict.

## 11. Push

```powershell
git push origin <branch-name>
```

## 12. Tag after verification

```powershell
git tag -a v0.12.0 -m "QuestForge matchmaking and controlled introductions"
git push origin v0.12.0
```

Tag only after the pushed branch and release build are verified.
