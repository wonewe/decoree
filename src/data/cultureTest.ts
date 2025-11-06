export type CultureArchetype = "trendsetter" | "foodie" | "wellness" | "heritage";

export type CultureQuizAnswer = {
  id: string;
  labelKey: string;
  weights: Partial<Record<CultureArchetype, number>>;
};

export type CultureQuizQuestion = {
  id: string;
  titleKey: string;
  subtitleKey?: string;
  answers: CultureQuizAnswer[];
};

export type CultureQuizResult = {
  id: CultureArchetype;
  titleKey: string;
  descriptionKey: string;
  highlightsKeys: string[];
};

export type CultureQuizScore = {
  totals: Record<CultureArchetype, number>;
  dominantArchetype: CultureArchetype;
};

export const CULTURE_QUIZ_QUESTIONS: CultureQuizQuestion[] = [
  {
    id: "pace",
    titleKey: "cultureTest.questions.pace.title",
    subtitleKey: "cultureTest.questions.pace.subtitle",
    answers: [
      {
        id: "pace-trendsetter",
        labelKey: "cultureTest.questions.pace.answers.trendsetter",
        weights: { trendsetter: 2 }
      },
      {
        id: "pace-foodie",
        labelKey: "cultureTest.questions.pace.answers.foodie",
        weights: { foodie: 2 }
      },
      {
        id: "pace-wellness",
        labelKey: "cultureTest.questions.pace.answers.wellness",
        weights: { wellness: 2 }
      },
      {
        id: "pace-heritage",
        labelKey: "cultureTest.questions.pace.answers.heritage",
        weights: { heritage: 2 }
      }
    ]
  },
  {
    id: "morning",
    titleKey: "cultureTest.questions.morning.title",
    subtitleKey: "cultureTest.questions.morning.subtitle",
    answers: [
      {
        id: "morning-trendsetter",
        labelKey: "cultureTest.questions.morning.answers.trendsetter",
        weights: { trendsetter: 2 }
      },
      {
        id: "morning-foodie",
        labelKey: "cultureTest.questions.morning.answers.foodie",
        weights: { foodie: 2 }
      },
      {
        id: "morning-wellness",
        labelKey: "cultureTest.questions.morning.answers.wellness",
        weights: { wellness: 2 }
      },
      {
        id: "morning-heritage",
        labelKey: "cultureTest.questions.morning.answers.heritage",
        weights: { heritage: 2 }
      }
    ]
  },
  {
    id: "souvenir",
    titleKey: "cultureTest.questions.souvenir.title",
    subtitleKey: "cultureTest.questions.souvenir.subtitle",
    answers: [
      {
        id: "souvenir-trendsetter",
        labelKey: "cultureTest.questions.souvenir.answers.trendsetter",
        weights: { trendsetter: 2 }
      },
      {
        id: "souvenir-foodie",
        labelKey: "cultureTest.questions.souvenir.answers.foodie",
        weights: { foodie: 2 }
      },
      {
        id: "souvenir-wellness",
        labelKey: "cultureTest.questions.souvenir.answers.wellness",
        weights: { wellness: 2 }
      },
      {
        id: "souvenir-heritage",
        labelKey: "cultureTest.questions.souvenir.answers.heritage",
        weights: { heritage: 2 }
      }
    ]
  },
  {
    id: "evening",
    titleKey: "cultureTest.questions.evening.title",
    subtitleKey: "cultureTest.questions.evening.subtitle",
    answers: [
      {
        id: "evening-trendsetter",
        labelKey: "cultureTest.questions.evening.answers.trendsetter",
        weights: { trendsetter: 2 }
      },
      {
        id: "evening-foodie",
        labelKey: "cultureTest.questions.evening.answers.foodie",
        weights: { foodie: 2 }
      },
      {
        id: "evening-wellness",
        labelKey: "cultureTest.questions.evening.answers.wellness",
        weights: { wellness: 2 }
      },
      {
        id: "evening-heritage",
        labelKey: "cultureTest.questions.evening.answers.heritage",
        weights: { heritage: 2 }
      }
    ]
  },
  {
    id: "motto",
    titleKey: "cultureTest.questions.motto.title",
    subtitleKey: "cultureTest.questions.motto.subtitle",
    answers: [
      {
        id: "motto-trendsetter",
        labelKey: "cultureTest.questions.motto.answers.trendsetter",
        weights: { trendsetter: 2 }
      },
      {
        id: "motto-foodie",
        labelKey: "cultureTest.questions.motto.answers.foodie",
        weights: { foodie: 2 }
      },
      {
        id: "motto-wellness",
        labelKey: "cultureTest.questions.motto.answers.wellness",
        weights: { wellness: 2 }
      },
      {
        id: "motto-heritage",
        labelKey: "cultureTest.questions.motto.answers.heritage",
        weights: { heritage: 2 }
      }
    ]
  }
];

export const CULTURE_QUIZ_RESULTS: Record<CultureArchetype, CultureQuizResult> = {
  trendsetter: {
    id: "trendsetter",
    titleKey: "cultureTest.results.trendsetter.title",
    descriptionKey: "cultureTest.results.trendsetter.description",
    highlightsKeys: [
      "cultureTest.results.trendsetter.highlights.1",
      "cultureTest.results.trendsetter.highlights.2",
      "cultureTest.results.trendsetter.highlights.3"
    ]
  },
  foodie: {
    id: "foodie",
    titleKey: "cultureTest.results.foodie.title",
    descriptionKey: "cultureTest.results.foodie.description",
    highlightsKeys: [
      "cultureTest.results.foodie.highlights.1",
      "cultureTest.results.foodie.highlights.2",
      "cultureTest.results.foodie.highlights.3"
    ]
  },
  wellness: {
    id: "wellness",
    titleKey: "cultureTest.results.wellness.title",
    descriptionKey: "cultureTest.results.wellness.description",
    highlightsKeys: [
      "cultureTest.results.wellness.highlights.1",
      "cultureTest.results.wellness.highlights.2",
      "cultureTest.results.wellness.highlights.3"
    ]
  },
  heritage: {
    id: "heritage",
    titleKey: "cultureTest.results.heritage.title",
    descriptionKey: "cultureTest.results.heritage.description",
    highlightsKeys: [
      "cultureTest.results.heritage.highlights.1",
      "cultureTest.results.heritage.highlights.2",
      "cultureTest.results.heritage.highlights.3"
    ]
  }
};

export function scoreCultureQuiz(answers: Record<string, string>): CultureQuizScore {
  const totals: Record<CultureArchetype, number> = {
    trendsetter: 0,
    foodie: 0,
    wellness: 0,
    heritage: 0
  };

  for (const question of CULTURE_QUIZ_QUESTIONS) {
    const answerId = answers[question.id];
    if (!answerId) continue;
    const choice = question.answers.find((answer) => answer.id === answerId);
    if (!choice) continue;
    for (const [archetype, weight] of Object.entries(choice.weights)) {
      totals[archetype as CultureArchetype] += weight ?? 0;
    }
  }

  const sorted = Object.entries(totals).sort(([, scoreA], [, scoreB]) => scoreB - scoreA);
  const dominantArchetype = (sorted[0]?.[0] ?? "trendsetter") as CultureArchetype;

  return { totals, dominantArchetype };
}
