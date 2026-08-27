import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import ResultClient from './ResultClient';

// 추천 결과 페이지는 세션 데이터에 의존하는 일회성 페이지이므로 색인 제외
// (내용 없는 얇은 페이지가 색인되면 사이트 품질 평가에 불리)
export const metadata: Metadata = {
    robots: {
        index: false,
        follow: true,
    },
};

export default async function ResultPage({ params }: any) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <ResultClient />;
}
