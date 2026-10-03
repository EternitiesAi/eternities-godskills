import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const text = path => readFile(resolve(root, path), 'utf8');
const words = value => value.trim().split(/\s+/u).filter(Boolean).length;
const hash = value => createHash('sha256').update(value).digest('hex');
const check = (condition, reason) => { if (!condition) throw new Error(reason); };
try {
  const frozen = JSON.parse(await text('application-output-freeze.json'));
  for (const item of frozen.files) {
    const bytes = await readFile(resolve(root, item.path));
    check(bytes.length === item.bytes && hash(bytes) === item.sha256, `Output changed: ${item.path}`);
  }
  const style = await text('C01/output.md');
  const notice = style.split('## Notice\n\n')[1]?.trim();
  check(!!notice, 'C01 notice missing');
  const noticeWords = words(notice);
  const noticeParagraphs = notice.split(/\n\s*\n/u).length;
  check(noticeWords >= 130 && noticeWords <= 170, 'C01 word bound violated');
  check(noticeParagraphs === 2, 'C01 paragraph bound violated');
  check(notice.endsWith('Ask us for the rollout checklist.'), 'C01 final sentence changed');
  check(!/revolutionary|effortless|world-class/iu.test(notice), 'C01 prohibited wording');
  const profileRules = [...style.matchAll(/^\d\. /gmu)].length;
  check(profileRules === 5, 'C01 profile rule count');
  const interpersonal = await text('C03/output.md');
  const message = interpersonal.split('## Private message draft\n\n')[1]?.split('\n\n## If she')[0];
  check(!!message, 'C03 draft missing');
  const messageWords = words(message);
  check(messageWords >= 110 && messageWords <= 170, 'C03 word bound violated');
  const noteBytes = await readFile(resolve(root, 'C04/task-state.md'));
  const noteWords = words(noteBytes.toString('utf8'));
  const retention = JSON.parse(await text('C04/retention-readback.json'));
  check(noteWords <= 230 && noteWords === retention.whitespaceWords, 'C04 note word bound');
  check(hash(noteBytes) === retention.sha256 && noteBytes.length === retention.bytes, 'C04 readback identity');
  const continuity = await text('C06/output.md');
  const intervals = [...continuity.matchAll(/^\| (\d+)-(\d+) \|/gmu)]
    .map(m => [Number(m[1]), Number(m[2])]);
  let end = 0;
  for (const [start, next] of intervals) {
    check(start === end && next > start, 'C06 timing gap, overlap, or negative interval');
    end = next;
  }
  check(intervals.length > 0 && end === 30, 'C06 thirty-minute sequence');
  console.log(JSON.stringify({
    passed: true, frozenApplicationFiles: frozen.files.length,
    C01: { noticeWords, noticeParagraphs, profileRules, finalSentenceExact: true, prohibitedWordsAbsent: true },
    C03: { draftWords: messageWords },
    C04: { noteWords, noteBytes: noteBytes.length, persistedReadbackSha256: hash(noteBytes), retentionReceiptMatches: true },
    C06: { intervals, totalMinutes: end },
    limits: 'Literal artifact checks only. No aesthetic/semantic score, C05 snippet execution, external operation or runtime continuity test.',
  }, null, 2));
} catch (error) { console.error(error.message); process.exitCode = 1; }
