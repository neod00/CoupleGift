import { chromium } from '@playwright/test';
import fs from 'fs';

async function run() {
    console.log('🚀 쿠팡 파트너스 정책 추출 시작...');
    // 사용자 화면에 브라우저를 직접 띄웁니다 (동작 확인용)
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    try {
        // 1. 이용약관 페이지 접속
        console.log('📄 이용약관 페이지 접속 중...');
        await page.goto('https://partners.coupang.com/#help/terms', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000); // SPA 렌더링 대기

        const terms = await page.evaluate(() => {
            const content = document.querySelector('.help-content') || document.body;
            return content.innerText;
        });

        // 2. 운영정책 페이지 접속
        console.log('📋 운영정책 페이지 접속 중...');
        await page.goto('https://partners.coupang.com/#help/operating-policy', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        const policy = await page.evaluate(() => {
            const content = document.querySelector('.help-content') || document.body;
            return content.innerText;
        });

        // 결과 저장
        const result = `
========================================
쿠팡 파트너스 이용약관 (추출일: ${new Date().toLocaleString()})
========================================
${terms}

========================================
쿠팡 파트너스 운영정책
========================================
${policy}
`;

        fs.writeFileSync('COUPANG_POLICIES.txt', result);
        console.log('✅ 추출 완료! COUPANG_POLICIES.txt 파일이 생성되었습니다.');

    } catch (error) {
        console.error('❌ 에러 발생:', error);
    } finally {
        // 확인을 위해 브라우저를 5초간 열어두고 닫습니다
        console.log('종료 대기 중 (5초)...');
        await page.waitForTimeout(5000);
        await browser.close();
    }
}

run();
