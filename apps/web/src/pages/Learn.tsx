import { useI18n } from '../hooks/useI18n';

export default function Learn() {
    const { t } = useI18n();
    return (
        <div className="px-4 pt-6 text-center">
            <div className="bg-white rounded-2xl p-6 shadow">
                <h2 className="text-lg font-semibold mb-2">
                    🎮 {t('learnAndEarn')}
                </h2>

                <p className="text-stone-600 text-sm">
                    {t('gamifiedLearningComingSoon')}
                </p>

                <p className="mt-2 text-xs text-stone-400">
                    {t('thisFeatureWillRollOutInNextRelease')}
                </p>
            </div>
        </div>
    );
}