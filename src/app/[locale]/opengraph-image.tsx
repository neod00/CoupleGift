import { ImageResponse } from 'next/og';

// SNS 공유 미리보기 이미지 (기존 metadata의 /og-image.jpg 파일이 실제로 존재하지 않아
// 공유 카드가 깨지던 문제를 빌드 타임 생성 이미지로 대체)
export const alt = 'GiftGenie - AI Gift Recommendations';
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #f43f5e 0%, #a855f7 50%, #6366f1 100%)',
                    color: 'white',
                }}
            >
                <div style={{ fontSize: 140, display: 'flex' }}>🎁</div>
                <div style={{ fontSize: 84, fontWeight: 700, marginTop: 24, display: 'flex' }}>GiftGenie</div>
                <div style={{ fontSize: 40, marginTop: 16, opacity: 0.9, display: 'flex' }}>
                    AI Gift Recommendations
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
