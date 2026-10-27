# Video project context

## 2026-10-27 - Verified one-off encrypted backup and isolated restore rehearsal

### Implementation

Brett authorised a video-specific backup and isolated restore test, with no customer changes, service restart or repository transfer. Captured a consistent SQLite online snapshot, persistent render/upload files, runtime configuration, Git source/history and the exact running application image. Source application commit: `7a14d116575c1a06aee0dd793f9b5f9e3e983396`. Application image: `sha256:d94f9fe29b85a06ae7bccc2df48dd43baa43ec317c0ad41c5f61eab1cb5f59f5`. Capture-window database/media/configuration stability and unchanged live-container metadata passed. This is a one-off operation; no video backup schedule or provider configuration was changed.

Archive encryption is AES-256-GCM with a random 256-bit key and authenticated header. Round-trip and tampered-authentication-tag tests passed. Secrets and customer data remain inside encrypted backup storage and protected temporary recovery locations, not this public repository or evidence log. Archive size: 1088162072 bytes; SHA-256: `199be2a9713b3b074e59156ac2d8024f0250ad03e203dfd87717a425f2845ca3`. Exact protected locations, key-custody instructions and detailed evidence are retained in Brett's private operational evidence, not published here.

### Testing - verified evidence

- Uploaded the encrypted archive using the existing business OneDrive connection and independently downloaded it from that cloud destination; byte length and SHA-256 matched before restoration. No new cloud app, paid plan, seat or sharing link was created.
- Authenticated/decrypted that cloud readback and extracted into a separate protected recovery directory. All 18 manifest files matched their captured sizes and SHA-256 values, including 10 media files and the encrypted-in-transit runtime configuration.
- Restored SQLite passed full integrity_check and foreign_key_check; schema/table counts matched the captured snapshot. Original production database was opened read-only for the online snapshot; subsequent database checks used restored copies only.
- Restored Git bundle passed full strict fsck; restored main matched the captured source commit. Exported image configuration and all 19 layer contents matched their expected content digests.
- One-shot container recovery probe used the exact digest of the existing image, network mode none, no published ports, read-only root filesystem, read-only bind mount of restored data only, capped CPU/memory/PIDs and dropped capabilities. Overrode the normal startup entrypoint; no application server, migrations, seeding, rendering or provider requests were started. Production environment values were not supplied to the probe. A temporary copy of the restored database was read successfully through the image's Prisma client; saved job metadata parsed and completed jobs' output files were checked against restored media. Compiled application build and renderer package were present. Probe exited successfully.
- Original attempt: the first isolated probe exited 0, but a subsequent comparison guard raised AssertionError. Its original event log and diagnostics are retained as failed-final-comparison evidence. Diagnostics reproduced two different Docker mount-array orders while all normalised live fields/bindings stayed identical. Follow-up verification compared mounts by destination/source/permissions, authenticated and extracted the cloud-readback archive again into a new scratch directory, rechecked files/database/image/history, and ran a separately named network-disabled probe successfully. This follow-up is reported separately and does not relabel the original stopped attempt as a pass.
- Only the task's test container and task-owned plaintext scratch directories/files were removed after verification. Timestamped encrypted archives and evidence retained. Original live container image/start time/restart count/mounts were unchanged.

### Commit and push

This PROJECT_CONTEXT.md is the only intended source-repository change: documentation-only bootstrap on the original `blendproperty/video` default branch, after the restore checks passed. Promotion/readback evidence records the resulting commit and blob IDs. Application files remain byte-identical to the captured source commit; server checkout remains at that application commit. No force push or history rewrite.

### Merge

No PR merge; direct documentation-only context bootstrap. No application change promoted.

### Deployment and configuration

No deployment, service restart, Hostinger Compose/save/snapshot/restore/schedule action, DNS change, database migration, production credential change or repository transfer. Default branch has no GitHub Actions workflows. Hostinger project mapping was inspected previously without edits; no GitHub source binding field was shown. No live pull/checkout/build command was executed.

### Live production verification

Bounded before/after Docker metadata verification: original image, start time, restart count and persistent mounts unchanged, container running. No customer/provider/payment/signing journey was exercised. This is not a blanket availability or security certification.

### Remaining gates and limitations

- Fresh-host image import/startup was NOT tested. Exported image config/layer hashes were verified; the isolated probe reused the exact already-present image digest. No end-to-end render or external listing/provider flow tested, and external source media services are not backed up by this operation.
- Encryption key is protected under Brett's Windows CurrentUser account with user/SYSTEM-only access; separate-process key recovery succeeded. Independent portable recovery-key custody remains unverified. Losing that Windows recovery context can prevent decryption; arrange independent custody before claiming complete disaster recovery. No key value is in Git, logs or cloud backup storage.
- This proves one manual backup/cloud-readback/restore sequence, not recurring video backup coverage, alerting, long-term retention, RPO/RTO or complete host-loss recovery. Provider hPanel backups exist and showed Daily configured, but prior action-history gaps remain uninvestigated.
- Repository remains personal-owned and public; no `BlendPropertyGroup/video` copy or transfer exists. Any transfer, visibility/app permission/hosting change, new cost or production restore needs a separately reviewed plan and approval. Earlier provider/UAT/customer-data/training/security acceptance gates are not closed by this backup test.

Rehearsal completion evidence UTC: 2026-10-27T07:56:44.490726+00:00. Private run reference: `video-20261027T074207Z`.


## 2026-10-27 - Recovery key in owner-approved password vault; final transfer checklist prepared

### Implementation and privacy

Saved one recovery-key entry in the owner-approved Zoho Vault account. Verified correct CSV column mapping into a masked Password field, header skipped, no login URL/shared folder; one successful import and persisted entry after page reload and owner master-password unlock. Subscription UI showed PERSONAL Active / Free Forever. No other user, sharing link, folder membership, plan change or external message was created. The original Windows-protected key remains as a secondary recovery copy. Both task-owned plaintext key/CSV staging files were removed and absence verified after the PASS; original DPAPI copy retained. Private evidence records the cleanup.

### Testing

Browser secret readback was redacted; this was not bypassed. Earlier command-line attempts did not verify and are retained as failures, without logging supplied values. A user-operated masked local verification box then passed at 2026-10-27T09:50:42.911080+00:00, accepting a 44-character Base64 value decoding to the original 32-byte AES key and authenticating an independent AES-GCM challenge. This check used no DPAPI, automatic clipboard reading, network request or production service. Zoho UI Copy plus user paste was used. The previously tested archive identity is SHA-256 `199be2a9713b3b074e59156ac2d8024f0250ad03e203dfd87717a425f2845ca3`. This establishes user-assisted portable key correctness; vault-account recovery/another-device access and a full fresh-host archive/image recovery are not newly tested here.

### Checklist, commit/push and merge

Prepared [TRANSFER_CHECKLIST.md](TRANSFER_CHECKLIST.md) for exactly one proposed transfer: existing repository ID1318321997, blendproperty/video to BlendPropertyGroup/video, preserving public visibility/main/history/settings. Ready checks, fresh pre-transfer snapshots, post-transfer acceptance, stop/recovery boundaries and separately approved hosting/security actions are explicit. It does NOT authorise or perform transfer. Current organisation Team allocation remains two seats/one filled, source sole collaborator already the org owner; no members/paid features added. Only this context and checklist documentation are promoted; exact commit/blob/head and changed-file verification are recorded in private evidence. No PR merge.

### Deployment/configuration and live verification

No repository transfer, app code change, live pull/checkout/build, service restart, Hostinger configuration, runtime secret, DNS, provider access, visibility or billing change. Source still has no Actions workflows. Pre-promotion read-only checks verified source owner/destination absence, running original application checkout/image/start/restarts and unchanged origin with no tracked diff; login returned HTTP 200. Post-promotion docs-only diff, canonical remote context/checklist and runtime readback are mandatory handoff guards, recorded with exact commit/blob IDs in private evidence. These are bounded checks; no customer/provider journeys executed.

### Outstanding gates

Brett's separate explicit transfer approval and a fresh exact-head/access/provider snapshot are still required. No old namespace recreation, app installation, additional reviewer invitation, branch-protection/CI activation, server-remote update, backup schedule change or production restore is approved. Earlier full disaster-recovery/UAT/provider/data/training/security acceptance limits remain. Recurring video backup operation, vault account recovery/emergency company custody and fresh-host restoration remain separate work.
