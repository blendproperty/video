# Video final transfer checklist - 27 October 2026

**Prepared for review only. NO transfer has been performed or authorised by this checklist.**

Proposed single change, after Brett's separate approval: transfer the EXISTING repository `blendproperty/video` (ID **1318321997**) to **BlendPropertyGroup/video**, preserving repository identity, history, branch `main`, current PUBLIC visibility and existing settings. Do not create a replacement copy, change visibility, update a server remote or trigger a deployment as part of this approval.

## Ready checks - verified as of 2026-10-27T09:54:26.550698+00:00

- [x] Source is standalone, public, not archived and not a fork; account has administrator access. Main at assessment: `ff0a3cab941ba1715a33d591ce76bf5e777b2ae8`. This assessment head contains documentation changes; the deployed application snapshot is `7a14d116575c1a06aee0dd793f9b5f9e3e983396`. Re-pin the exact remote main after this documentation/checklist commit before any transfer.
- [x] One branch (`main`), zero tags, no Pages, no open pull requests. Snapshot complete branch/ref metadata, repository ID, settings, collaborators and fresh head again immediately before an approved transfer.
- [x] Destination name currently absent. Receiving organisation is GitHub Team, default member repository permission none; two allocated seats and one filled. Source's only collaborator is `blendproperty`, already the organisation owner. No invitation, additional paid seat, plan, app permission or cost change is part of this plan.
- [x] Source has zero GitHub workflows/runs, Actions secrets/variables, deploy keys, webhooks, runners, environments and recorded deployments. No copied automation or deployment credentials to activate. Recheck before approval because this can change.
- [x] Server direct checkout/HTTPS origin previously verified, main application commit `7a14d116575c1a06aee0dd793f9b5f9e3e983396`; running image and persistent database/render/upload mounts preserved. Hostinger Docker Manager showed the local Compose project and no GitHub source binding field. This is bounded evidence, not proof of all hidden provider state.
- [x] Provider VPS backups listed and latest successful creation independently confirmed; one-off video-specific encrypted backup/cloud readback/isolated restore also passed. Archive SHA-256 `199be2a9713b3b074e59156ac2d8024f0250ad03e203dfd87717a425f2845ca3`. All 18 files, database integrity/foreign keys, Git history, image config/19 layers and 10 completed video outputs verified. Earlier comparison-stop and later successful verification remain separately recorded.
- [x] Recovery key saved in owner-approved Zoho Vault PERSONAL account, no shared folder/login URL, persisted after reload/unlock. User-assisted masked verification PASS at 2026-10-27T09:50:42.911080+00:00: original 32-byte key authenticated the independent AES-GCM challenge without Windows DPAPI. Browser automation's redacted raw readback was not bypassed. No key value committed, logged or emailed.
- [x] Canonical PROJECT_CONTEXT.md and this checklist are the only intended documentation changes. Promotion and final runtime readback are mandatory separately recorded checks; the exact final commit must be read back from original remote main before handoff. Both temporary plaintext import files were removed after the successful key proof; original protected fallback retained.

## Required approval and execution boundary - NOT DONE

- [ ] Brett explicitly approves ownership transfer of repository ID1318321997 to BlendPropertyGroup/video, preserving public visibility and main. Approval of this checklist is not implied by preparing it.
- [ ] Agree an administrative window and avoid concurrent pushes; refresh source/destination/ref/access snapshots and cloud backup availability immediately beforehand. If application/data changed materially since capture, prepare a fresh consistent backup before proceeding.
- [ ] Confirm the receiving organisation has no new conflicting repository, fork/network conflict, ruleset or app constraint, and source administrator/create-repository permissions still apply. If any precondition differs, stop and review it.
- [ ] Perform only GitHub's normal ownership transfer once approved. Do not detach/delete/recreate, rewrite history, change visibility or default branch, install GitHub Apps, copy credentials, invite users, buy anything or run server commands that mutate configuration.

## Post-transfer acceptance - planned, NOT TESTED

- [ ] Verify the SAME repository ID1318321997 now has owner BlendPropertyGroup and name video. Compare every branch/tag SHA and history, default main, visibility and retained settings against the pre-transfer snapshot.
- [ ] Verify `blendproperty` retains intended admin access; organisation default permissions/teams/collaborators and paid-seat allocation have not broadened access or costs. No other person is granted access without approval.
- [ ] Verify old GitHub web/Git URLs redirect and the new public URL is readable. On the server, use read-only `git ls-remote` against old/new URLs; no fetch, pull, checkout, build or remote-setting change. Never recreate the old `blendproperty/video` namespace, which removes redirects.
- [ ] Verify the live container image/start time/restart count and database/render/upload mounts are unchanged; public login still responds. No customer render, database mutation or provider call for acceptance. Do not equate HTTP200 with complete application UAT.
- [ ] Confirm no Actions/deployment runs or Hostinger changes were started; verify source/backups remain accessible. Log exact post-transfer owner/ref/time and remaining gates in PROJECT_CONTEXT.md.

## Hosting and security changes - separately approved later

- [ ] Update developer/server Git remote URLs only under separate approval; current old URL redirects must be verified first. Keep the same server directory, image, domain, persistent data, configuration and runtime secrets.
- [ ] Review whether Hostinger/PostHog personal-account GitHub App installations are needed after transfer. Their personal installation rights are not assumed to carry into the organisation. Do not grant organisation app access or reconnect/deploy without separate approval.
- [ ] Plan main protection (no force pushes/deletions; reviewed pull requests and meaningful verified checks). Currently no source branch protection/rulesets or CI exists. Do not require fictitious CI statuses or enable a provider-connected workflow. One independent approval requires an authorised second reviewer; do not invite anyone automatically.
- [ ] Any change to private visibility requires a separate credential/access test and approval. Organisation ownership alone does not make this public code private or certify website security.

## Stop and recovery procedure

If identity/ref/access/provider checks fail, STOP administrative changes. Leave the existing application, image, source checkout, database and mounts running. Do not restore the shared live VPS, restart services, delete either namespace, recreate the old repository, force push or automatically reverse ownership. Diagnose read-only; an ownership reversal needs separate approval and fresh GitHub eligibility checks. Existing encrypted backup/isolated restore evidence provides a recovery route, not authority to restore production.

## Remaining operational limits

Fresh-host image import/startup, complete renders/provider/customer journeys, recurring video-specific backups/alerting/retention and full host-loss RPO/RTO are unverified. Zoho account recovery/access on a different device and approved company emergency key custody remain untested; no team sharing was added. Provider Daily setting showed history gaps. These limits are recorded, not presented as passed.

References: [GitHub transfer rules, retained data and redirects](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository), [Zoho password categories and personal entries](https://help.zoho.com/portal/en/kb/vault/user-guide/sharing-passwords/articles/vault-add-passwords-notes-documents).
