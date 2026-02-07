'use client';

import React from 'react';
import { useLocale } from 'next-intl';

export default function Privacy() {
    const locale = useLocale();
    const lastUpdated = locale === 'ko' ? "2024년 5월 20일" : locale === 'ja' ? "2024年5月20日" : "May 20, 2024";

    const content = {
        ko: {
            title: "개인정보처리방침",
            lastUpdated: "최종 수정일",
            sections: [
                {
                    title: "1. 개인정보의 수집 및 이용 목적",
                    content: "'선물지니'(이하 '회사')는 사용자가 입력한 정보를 바탕으로 최적의 선물 아이디어를 제공하기 위해 최소한의 정보만을 사용합니다. 회사는 별도의 회원가입 절차 없이 서비스를 제공하며, 입력된 정보는 다음과 같은 목적으로만 활용됩니다.",
                    items: [
                        "AI 기반 맞춤형 선물 추천 결과 생성",
                        "서비스 개선을 위한 익명화된 통계 분석",
                        "문의 사항에 대한 응대 및 지원"
                    ]
                },
                {
                    title: "2. 수집하는 개인정보 항목",
                    content: "본 서비스는 맞춤형 추천을 위해 다음과 같은 정보를 사용자의 직접 입력을 통해 일시적으로 처리합니다.",
                    items: [
                        "추천 대상의 정보: 성별, 연령대, 성격/취향 키워드",
                        "상황 정보: 기념일 종류, 예산 범위, 선호 카테고리",
                        "(문의 시) 이름, 이메일 주소"
                    ]
                },
                {
                    title: "3. 개인정보의 보유 및 이용 기간",
                    content: "사용자가 입력한 추천 관련 정보는 브라우저 세션 동안만 유지되거나 추천 결과 생성 즉시 파기되는 것을 원칙으로 합니다. 단, 관련 법령에 의해 보존할 필요가 있는 경우 해당 법령이 정한 기간 동안 보관합니다."
                },
                {
                    title: "4. 제3자 제공 및 위탁",
                    content: "회사는 사용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 다음의 경우 주의가 필요합니다.",
                    items: [
                        "OpenAI API: 추천 결과 생성을 위해 사용자가 입력한 익명화된 선물 조건 정보가 OpenAI의 서버로 전송될 수 있습니다.",
                        "쿠팡 파트너스: 상품 구매 링크 클릭 시 쿠팡의 결제 및 서비스 정책이 적용됩니다."
                    ]
                },
                {
                    title: "5. 정보주체의 권리",
                    content: "사용자는 언제든지 본인의 개인정보 열람, 정정, 삭제를 요청할 수 있습니다. 문의하기 페이지 또는 이메일을 통해 요청 주시면 지체 없이 처리하겠습니다."
                }
            ],
            footer: "본 방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는 공지사항을 통해 고지할 것입니다."
        },
        en: {
            title: "Privacy Policy",
            lastUpdated: "Last Updated",
            sections: [
                {
                    title: "1. Purpose of Collection and Use of Personal Information",
                    content: "GiftGenie (hereinafter 'Company') uses only minimal information to provide optimal gift ideas based on user input. The Company provides services without a separate sign-up process, and the entered information is used only for the following purposes:",
                    items: [
                        "Generating AI-based personalized gift recommendations",
                        "Anonymized statistical analysis for service improvement",
                        "Responding to and supporting inquiries"
                    ]
                },
                {
                    title: "2. Personal Information Items Collected",
                    content: "This service temporarily processes the following information through direct user input for personalized recommendations:",
                    items: [
                        "Recipient information: Gender, age group, personality/preference keywords",
                        "Situational information: Type of occasion, budget range, preferred categories",
                        "(For inquiries) Name, email address"
                    ]
                },
                {
                    title: "3. Retention and Use Period of Personal Information",
                    content: "Recommendation-related information entered by users is maintained only during the browser session or is destroyed immediately after generating recommendation results. However, if it needs to be preserved according to relevant laws, it will be stored for the period specified by those laws."
                },
                {
                    title: "4. Third-Party Provision and Outsourcing",
                    content: "The Company does not provide users' personal information to third parties in principle. However, caution is needed in the following cases:",
                    items: [
                        "OpenAI API: Anonymized gift condition information entered by users may be transmitted to OpenAI's servers for generating recommendations.",
                        "Amazon Associates: Amazon's payment and service policies apply when clicking product purchase links."
                    ]
                },
                {
                    title: "5. Rights of Data Subjects",
                    content: "Users can request access, correction, and deletion of their personal information at any time. Please contact us through the Contact page or email, and we will process your request without delay."
                }
            ],
            footer: "This policy is effective from the date of implementation. Any additions, deletions, or corrections to the policy in accordance with laws and regulations will be announced through notices."
        },
        ja: {
            title: "プライバシーポリシー",
            lastUpdated: "最終更新日",
            sections: [
                {
                    title: "1. 個人情報の収集および利用目的",
                    content: "「ギフトジニー」（以下「当社」）は、ユーザーが入力した情報をもとに最適なギフトアイデアを提供するために、最小限の情報のみを使用します。当社は別途の会員登録手続きなしでサービスを提供し、入力された情報は次のような目的でのみ活用されます。",
                    items: [
                        "AIベースのカスタマイズギフト推薦結果の生成",
                        "サービス改善のための匿名化された統計分析",
                        "お問い合わせへの対応およびサポート"
                    ]
                },
                {
                    title: "2. 収集する個人情報の項目",
                    content: "本サービスは、カスタマイズ推薦のために、ユーザーの直接入力を通じて以下の情報を一時的に処理します。",
                    items: [
                        "推薦対象の情報：性別、年齢層、性格/好みのキーワード",
                        "状況情報：記念日の種類、予算範囲、好みのカテゴリ",
                        "（お問い合わせ時）氏名、メールアドレス"
                    ]
                },
                {
                    title: "3. 個人情報の保有および利用期間",
                    content: "ユーザーが入力した推薦関連情報は、ブラウザセッション中のみ維持されるか、推薦結果生成後直ちに破棄されることを原則とします。ただし、関連法令により保存が必要な場合は、該当法令が定める期間保管します。"
                },
                {
                    title: "4. 第三者提供および委託",
                    content: "当社は、ユーザーの個人情報を原則として外部に提供しません。ただし、以下の場合は注意が必要です。",
                    items: [
                        "OpenAI API：推薦結果生成のために、ユーザーが入力した匿名化されたギフト条件情報がOpenAIのサーバーに送信される場合があります。",
                        "Amazonアソシエイト：商品購入リンククリック時にAmazonの決済およびサービスポリシーが適用されます。"
                    ]
                },
                {
                    title: "5. 情報主体の権利",
                    content: "ユーザーはいつでも本人の個人情報の閲覧、訂正、削除を要求できます。お問い合わせページまたはメールでご連絡いただければ、遅滞なく処理いたします。"
                }
            ],
            footer: "本方針は施行日から適用され、法令および方針に基づく変更内容の追加、削除、訂正がある場合は、お知らせを通じて告知いたします。"
        }
    };

    const c = content[locale as keyof typeof content] || content.ko;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="glass-card p-8 md:p-12 space-y-8 text-[var(--text-main-70)]">
                <header className="text-center border-b border-gray-100 pb-8 mb-8">
                    <h2 className="text-4xl font-bold gradient-text mb-4">{c.title}</h2>
                    <p className="text-sm text-[var(--text-main-70)]">{c.lastUpdated}: {lastUpdated}</p>
                </header>

                {c.sections.map((section, index) => (
                    <section key={index} className="space-y-4">
                        <h3 className="text-xl font-bold text-[var(--text-main)]">{section.title}</h3>
                        <p className="leading-relaxed">{section.content}</p>
                        {section.items && (
                            <ul className="list-disc pl-6 space-y-2">
                                {section.items.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                ))}
                            </ul>
                        )}
                    </section>
                ))}

                <footer className="pt-8 border-top border-gray-100 mt-12 text-sm text-[var(--text-main-70)] text-center">
                    {c.footer}
                </footer>
            </div>
        </div>
    );
}
