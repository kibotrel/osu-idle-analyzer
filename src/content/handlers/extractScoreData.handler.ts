import { OsuIdleIndexedDbDatabases } from '#/shared/constants/api.constants.ts';
import { SKILL_ORDER } from '#/shared/constants/data.constants.ts';
import { StandardUnitMultipliers, TimeUnits } from '#/shared/constants/maths.constants.ts';
import { convertBlobToDataUrl } from '#/shared/methods/internal.methods.ts';
import { convertDuration, unitsPerSecond } from '#/shared/methods/maths.methods.ts';
import { Beatmap, Score, ScoreSkill, ScoresMap } from '#/shared/types/data.type.ts';
import {
  ContentExtractScoreDataResponse,
  IndexedDbBeatmapMetadata,
  LocalStorageData,
} from '#/shared/types/internal.types.ts';
import { StandardUnitMultiplierKey } from '#/shared/types/maths.types.ts';

const getBeatmapMetadataFromIndexedDB = async (options: {
  artistAndTitle: string;
  difficulty: string;
}): Promise<{ record: IndexedDbBeatmapMetadata | undefined }> => {
  const { artistAndTitle, difficulty } = options;

  return new Promise((resolve) => {
    const request = indexedDB.open(OsuIdleIndexedDbDatabases.Beatmaps);

    request.addEventListener('error', () => resolve({ record: undefined }));
    request.addEventListener('success', (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      const metadataTransaction = database.transaction('meta', 'readonly');
      const metadataStore = metadataTransaction.objectStore('meta');
      const cursorRequest = metadataStore.openCursor();

      cursorRequest.addEventListener('success', (cursorEvent) => {
        const cursor = (cursorEvent.target as IDBRequest<IDBCursorWithValue | null>).result;

        if (!cursor) {
          database.close();

          return resolve({ record: undefined });
        }

        const record = cursor.value as IndexedDbBeatmapMetadata;

        if (artistAndTitle !== `${record.artist} - ${record.title}`) {
          return cursor.continue();
        }

        const hasRightVersion =
          Array.isArray(record.versions) &&
          record.versions.some((version) => version.version === difficulty);

        if (!hasRightVersion) {
          return cursor.continue();
        }

        const filesTransaction = database.transaction('files', 'readonly');
        const filesStore = filesTransaction.objectStore('files');
        const prefix = `${record.id}/`;
        /**
         * Acts as a WHERE x LIKE prefix% in SQL.
         * See https://hacks.mozilla.org/2014/06/breaking-the-borders-of-indexeddb/
         * for more details.
         */
        const range = IDBKeyRange.bound(prefix, `${prefix}\uFFFF`);
        const filesCursor = filesStore.openCursor(range);

        filesCursor.addEventListener('success', (fileCursorEvent) => {
          const fileCursor = (fileCursorEvent.target as IDBRequest<IDBCursorWithValue | null>)
            .result;

          if (!fileCursor) {
            database.close();

            return resolve({ record });
          }

          if (
            typeof fileCursor.key === 'string' &&
            /\.(png|jpe?g|gif|webp)$/i.test(fileCursor.key)
          ) {
            const backgroundBlob = fileCursor.value as unknown;

            database.close();

            return resolve({
              record: {
                ...record,
                backgroundBlob: backgroundBlob instanceof Blob ? backgroundBlob : undefined,
              },
            });
          }

          fileCursor.continue();
        });
        filesCursor.addEventListener('error', () => {
          database.close();
          resolve({ record });
        });
      });
      cursorRequest.addEventListener('error', () => {
        database.close();
        resolve({ record: undefined });
      });
    });
  });
};

const extractBeatmapData = async (): Promise<Beatmap> => {
  const artistAndTitleElement = document.querySelector('.result__title');

  if (!artistAndTitleElement) {
    throw new Error('Beatmap title not found.');
  }

  const difficultyElement = artistAndTitleElement.querySelector('.result__version');

  if (!difficultyElement) {
    throw new Error('Beatmap difficulty not found.');
  }

  const artistAndTitle = Array.from(artistAndTitleElement.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent?.trim() ?? '')
    .join('')
    .trim();
  const difficulty = difficultyElement.textContent.trim().replace(/^\[|\]$/g, '');

  const { record } = await getBeatmapMetadataFromIndexedDB({ artistAndTitle, difficulty });

  if (!record) {
    throw new Error('Beatmap metadata not found');
  }

  const difficultyMetadata = record.versions.find((version) => version.version === difficulty);

  if (!difficultyMetadata) {
    throw new Error('Beatmap difficulty metadata not found');
  }

  return {
    artist: record.artist,
    backgroundUrl: record.backgroundBlob ? await convertBlobToDataUrl(record.backgroundBlob) : '',
    difficultyName: difficultyMetadata.version,
    durationInSeconds: convertDuration(difficultyMetadata.total_length, {
      fromUnit: TimeUnits.Millisecond,
      toUnit: TimeUnits.Second,
    }),
    id: difficultyMetadata.id,
    starRating: difficultyMetadata.difficulty,
    title: record.title,
  };
};

const parseXpValue = (raw: string): number => {
  const xpValueString = raw.trim().toLowerCase().replace(/xp$/, '').trim();
  const optionalMultiplierCharacter = xpValueString
    .at(-1)
    ?.toLowerCase() as StandardUnitMultiplierKey;
  const multiplier = StandardUnitMultipliers[optionalMultiplierCharacter] ?? 1;
  const numeric = Number.parseFloat(
    multiplier !== undefined ? xpValueString.slice(0, -1) : xpValueString
  );

  if (Number.isNaN(numeric)) {
    return 0;
  }

  return Math.round(numeric * multiplier);
};

const extractSkillsData = (options: { beatmapDuration: number }): ScoreSkill[] => {
  const { beatmapDuration } = options;
  const skills: ScoreSkill[] = SKILL_ORDER.map((name) => {
    return { name, xp: { absolute: 0, perSecond: 0 } };
  });

  const skillsContainerElement = document.querySelector('.result__progression');

  if (!skillsContainerElement) {
    throw new Error('Skill progression breakdown not found.');
  }

  skillsContainerElement.querySelectorAll('.skillxp__row').forEach((skillElement) => {
    const skillNameElement = skillElement.querySelector('.skillxp__name');

    if (!skillNameElement) {
      return;
    }

    const skillName = skillNameElement.textContent.trim();
    const skillToUpdate = skills.find((skill) => skill.name === skillName);

    if (!skillToUpdate) {
      return;
    }

    const absoluteXpGainElement = skillElement.querySelector('.skillxp__gain');

    if (!absoluteXpGainElement) {
      return;
    }

    const absoluteXpGain = parseXpValue(absoluteXpGainElement.textContent.trim());

    skillToUpdate.xp = {
      absolute: absoluteXpGain,
      perSecond: unitsPerSecond({ duration: beatmapDuration, total: absoluteXpGain }),
    };
  });

  return skills;
};

const formatExportableData = (options: {
  beatmap: Beatmap;
  skills: ScoreSkill[];
  timestamp: number;
}): string => {
  const { beatmap, skills, timestamp } = options;
  const globalXpRate = unitsPerSecond({
    total: skills.reduce((total, skill) => total + skill.xp.absolute, 0),
    duration: beatmap.durationInSeconds,
  });
  const scoreDate = new Date(timestamp).toLocaleDateString('en');

  return [
    beatmap.artist,
    beatmap.title,
    beatmap.difficultyName,
    beatmap.starRating,
    beatmap.durationInSeconds,
    ...skills.map((skill) => skill.xp.perSecond),
    globalXpRate,
    scoreDate,
  ].join('\t');
};

const extractScoreData = async (): Promise<Score> => {
  const timestamp = Date.now();
  const beatmap = await extractBeatmapData();
  const gainedSkills = extractSkillsData({ beatmapDuration: beatmap.durationInSeconds });
  const exportableData = formatExportableData({ beatmap, skills: gainedSkills, timestamp });

  const score = { beatmap, exportableData, gainedSkills, timestamp };
  const { scores } = await chrome.storage.local.get<Pick<LocalStorageData, 'scores'>>('scores');

  const scoresMap: ScoresMap = scores ? new Map(scores) : new Map();

  scoresMap.set(score.beatmap.id, score);

  await chrome.storage.local.set<Pick<LocalStorageData, 'scores'>>({
    scores: [...scoresMap.entries()],
  });

  return score;
};

export const handleExtractScoreData = async (
  data: Record<string, never>,
  sendResponse: (response: ContentExtractScoreDataResponse) => void
): Promise<void> => {
  try {
    const score = await extractScoreData();

    sendResponse({ score, success: true });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    sendResponse({ error: errorMessage, success: false });
  }
};
