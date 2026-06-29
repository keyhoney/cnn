/** 한국어 교육 콘텐츠 기준 분당 읽을 수 있는 글자 수 (공백 제외) */
const CHARS_PER_MINUTE = 400;

/** 문제·단계별 풀이는 읽기 외에 생각하는 시간이 추가됩니다 (분) */
const PROBLEM_THINKING_MINUTES = 0.75;
const STEP_THINKING_MINUTES = 0.5;

/**
 * MDX 본문으로 예상 학습 시간(분)을 계산합니다.
 * 수식 내용·JSX 속성(문항·해설)을 포함하고, Problem·StepByStep에는 생각 시간을 더합니다.
 */
export function estimateReadingMinutes(body: string): number {
  const normalized = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\$\$([\s\S]*?)\$\$/g, ' $1 ')
    .replace(/\$([^$\n]+)\$/g, ' $1 ')
    .replace(/<[/A-Za-z][^>]*>/g, ' ')
    .replace(/[#*_`]/g, ' ')
    .replace(/\\n/g, ' ')
    .replace(/\\"/g, '"')
    .replace(/\s+/g, '');

  const charCount = normalized.length;
  const problems = (body.match(/<Problem\b/g) || []).length;
  const steps = (body.match(/<StepByStep\b/g) || []).length;

  const readingMinutes = charCount / CHARS_PER_MINUTE;
  const thinkingMinutes = problems * PROBLEM_THINKING_MINUTES + steps * STEP_THINKING_MINUTES;

  if (charCount === 0 && thinkingMinutes === 0) return 1;

  return Math.max(1, Math.ceil(readingMinutes + thinkingMinutes));
}
