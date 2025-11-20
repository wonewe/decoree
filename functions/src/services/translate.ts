import OpenAI from 'openai';
import { BaseEvent, SupportedLanguage } from '../types/event';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface TranslatedFields {
    title: string;
    summary: string;
    content: string;
}

export const translateEvent = async (
    event: BaseEvent,
    targetLangs: SupportedLanguage[]
): Promise<Record<SupportedLanguage, TranslatedFields>> => {
    const results: Record<SupportedLanguage, TranslatedFields> = {} as any;

    // If no API key, return original text for all languages (mock mode or error)
    if (!process.env.OPENAI_API_KEY) {
        console.warn('OPENAI_API_KEY not found. Skipping translation.');
        targetLangs.forEach((lang) => {
            results[lang] = {
                title: event.title,
                summary: event.summary,
                content: event.content,
            };
        });
        return results;
    }

    for (const lang of targetLangs) {
        if (lang === 'ko') {
            // Assuming input is Korean (KOPIS default), just copy. 
            // If input is NOT Korean, we might need to translate to Korean too.
            // For now, let's assume KOPIS gives Korean data mostly.
            // BUT the requirements say "Base Language" is input.
            // If base is English, we need to translate to Korean.
            // Let's just ask GPT to translate to the target language regardless.
        }

        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o', // or gpt-3.5-turbo
                messages: [
                    {
                        role: 'system',
                        content: `You are a professional translator for K-Culture events. 
            Translate the following JSON fields (title, summary, content) into ${lang}.
            Rules:
            1. Maintain context.
            2. If text is long, translate by paragraph.
            3. DO NOT translate prices (KRW), dates, or specific place names unless there is a standard official translation.
            4. Keep official English titles if available.
            5. Return ONLY valid JSON format: {"title": "...", "summary": "...", "content": "..."}`,
                    },
                    {
                        role: 'user',
                        content: JSON.stringify({
                            title: event.title,
                            summary: event.summary,
                            content: event.content,
                        }),
                    },
                ],
                response_format: { type: 'json_object' },
            });

            const content = completion.choices[0].message.content;
            if (content) {
                results[lang] = JSON.parse(content) as TranslatedFields;
            } else {
                throw new Error('Empty response from GPT');
            }
        } catch (error) {
            console.error(`Translation failed for ${lang}:`, error);
            // Fallback to original
            results[lang] = {
                title: event.title,
                summary: event.summary,
                content: event.content,
            };
        }
    }

    return results;
};
