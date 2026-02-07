'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { GiftFormData } from '../types/gift';

interface GiftFormProps {
  onSubmit: (formData: GiftFormData) => void;
  isLoading?: boolean;
}

const GiftForm: React.FC<GiftFormProps> = ({ onSubmit, isLoading }) => {
  const t = useTranslations();
  const locale = useLocale();

  // 환경 변수 디버깅 정보 추가
  useEffect(() => {
    const hasOpenAIKey = !!process.env.NEXT_PUBLIC_OPENAI_API_KEY || !!process.env.REACT_APP_OPENAI_API_KEY;
    const hasCoupangPartnerId = !!process.env.REACT_APP_COUPANG_PARTNER_ID;
    const hasAdSenseId = !!process.env.REACT_APP_ADSENSE_PUBLISHER_ID;

    console.log('🔍 환경 변수 상태 확인:', {
      openAIKey: hasOpenAIKey ? '✅ 설정됨' : '❌ 없음',
      coupangPartnerId: hasCoupangPartnerId ? '✅ 설정됨' : '⚠️ 없음 (일반 링크 사용)',
      adSenseId: hasAdSenseId ? '✅ 설정됨' : '⚠️ 없음 (광고 비활성화)',
      nodeEnv: process.env.NODE_ENV || 'development'
    });
  }, []);

  const [formData, setFormData] = useState<GiftFormData>({
    gender: 'female',
    age: 25,
    personality: '',
    occasionType: '',
    minBudget: 30000,
    maxBudget: 100000,
    category: '',
    additionalInfo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'minBudget' || name === 'maxBudget'
        ? Number(value)
        : value
    }));
  };

  // 언어별 나이 단위
  const ageUnit = locale === 'ko' ? '세' : locale === 'ja' ? '歳' : ' years old';

  // 나이 옵션 생성 함수
  const generateAgeOptions = () => {
    const ageLabels = {
      ko: {
        select: '나이를 선택해주세요',
        children: '👶 어린이 (10-12세)',
        teen: '👦 청소년 (13-19세)',
        youngAdult: '🧑‍💼 청년층 (20-39세)',
        middleAged: '👨‍💼 중년층 (40-59세)',
        elderly: '👨‍🦳 장년층 (60-70세)'
      },
      en: {
        select: 'Select Age',
        children: '👶 Children (10-12)',
        teen: '👦 Teens (13-19)',
        youngAdult: '🧑‍💼 Young Adults (20-39)',
        middleAged: '👨‍💼 Middle-Aged (40-59)',
        elderly: '👨‍🦳 Seniors (60-70)'
      },
      ja: {
        select: '年齢を選択してください',
        children: '👶 子供 (10-12歳)',
        teen: '👦 10代 (13-19歳)',
        youngAdult: '🧑‍💼 青年 (20-39歳)',
        middleAged: '👨‍💼 中年 (40-59歳)',
        elderly: '👨‍🦳 高齢 (60-70歳)'
      }
    };

    const labels = ageLabels[locale as keyof typeof ageLabels] || ageLabels.ko;

    const createOptions = (start: number, end: number) => {
      const options: React.ReactNode[] = [];
      for (let age = start; age <= end; age++) {
        options.push(<option key={age} value={age}>{age}{ageUnit}</option>);
      }
      return options;
    };

    return (
      <>
        <option value="">{labels.select}</option>
        <optgroup label={labels.children}>{createOptions(10, 12)}</optgroup>
        <optgroup label={labels.teen}>{createOptions(13, 19)}</optgroup>
        <optgroup label={labels.youngAdult}>{createOptions(20, 39)}</optgroup>
        <optgroup label={labels.middleAged}>{createOptions(40, 59)}</optgroup>
        <optgroup label={labels.elderly}>{createOptions(60, 70)}</optgroup>
      </>
    );
  };

  // 언어별 기념일 옵션
  const occasionOptions = {
    ko: {
      select: '기념일을 선택해주세요',
      birthday: {
        label: '🎂 생일 & 개인 기념일', options: [
          { value: '생일', text: '생일' },
          { value: '성인식', text: '성인식' },
          { value: '졸업', text: '졸업' },
          { value: '취업', text: '취업 축하' }
        ]
      },
      couple: {
        label: '💑 커플 기념일', options: [
          { value: '사귄지 100일', text: '사귄지 100일' },
          { value: '사귄지 1년', text: '사귄지 1년' },
          { value: '사귄지 2년', text: '사귄지 2년' },
          { value: '사귄지 3년 이상', text: '사귄지 3년 이상' },
          { value: '첫 만남 기념일', text: '첫 만남 기념일' }
        ]
      },
      wedding: {
        label: '💒 부부 기념일', options: [
          { value: '결혼기념일 1년', text: '결혼기념일 1년' },
          { value: '결혼기념일 5년', text: '결혼기념일 5년' },
          { value: '결혼기념일 10년', text: '결혼기념일 10년' },
          { value: '결혼기념일 20년 이상', text: '결혼기념일 20년 이상' },
          { value: '프러포즈 기념일', text: '프러포즈 기념일' }
        ]
      },
      special: {
        label: '🎁 특별한 날', options: [
          { value: '밸런타인데이', text: '밸런타인데이' },
          { value: '화이트데이', text: '화이트데이' },
          { value: '크리스마스', text: '크리스마스' },
          { value: '어버이날', text: '어버이날' },
          { value: '스승의날', text: '스승의날' },
          { value: '기타', text: '기타' }
        ]
      }
    },
    en: {
      select: 'Select Occasion',
      birthday: {
        label: '🎂 Birthday & Personal', options: [
          { value: 'Birthday', text: 'Birthday' },
          { value: 'Coming of Age', text: 'Coming of Age' },
          { value: 'Graduation', text: 'Graduation' },
          { value: 'New Job', text: 'New Job' }
        ]
      },
      couple: {
        label: '💑 Couple Anniversary', options: [
          { value: '100 Days', text: '100 Days Together' },
          { value: '1 Year', text: '1 Year Anniversary' },
          { value: '2 Years', text: '2 Years Anniversary' },
          { value: '3+ Years', text: '3+ Years Anniversary' },
          { value: 'First Meet', text: 'First Meeting Anniversary' }
        ]
      },
      wedding: {
        label: '💒 Wedding Anniversary', options: [
          { value: 'Wedding 1 Year', text: '1st Wedding Anniversary' },
          { value: 'Wedding 5 Years', text: '5th Wedding Anniversary' },
          { value: 'Wedding 10 Years', text: '10th Wedding Anniversary' },
          { value: 'Wedding 20+ Years', text: '20+ Years Wedding Anniversary' },
          { value: 'Proposal', text: 'Proposal Anniversary' }
        ]
      },
      special: {
        label: '🎁 Special Days', options: [
          { value: 'Valentines', text: "Valentine's Day" },
          { value: 'White Day', text: 'White Day' },
          { value: 'Christmas', text: 'Christmas' },
          { value: 'Parents Day', text: "Parents' Day" },
          { value: 'Teachers Day', text: "Teachers' Day" },
          { value: 'Other', text: 'Other' }
        ]
      }
    },
    ja: {
      select: '記念日を選択してください',
      birthday: {
        label: '🎂 誕生日 & 個人', options: [
          { value: '誕生日', text: '誕生日' },
          { value: '成人式', text: '成人式' },
          { value: '卒業', text: '卒業' },
          { value: '就職', text: '就職祝い' }
        ]
      },
      couple: {
        label: '💑 カップル記念日', options: [
          { value: '100日', text: '付き合って100日' },
          { value: '1周年', text: '付き合って1年' },
          { value: '2周年', text: '付き合って2年' },
          { value: '3年以上', text: '付き合って3年以上' },
          { value: '初めて会った日', text: '初めて会った記念日' }
        ]
      },
      wedding: {
        label: '💒 結婚記念日', options: [
          { value: '結婚1周年', text: '結婚1周年' },
          { value: '結婚5周年', text: '結婚5周年' },
          { value: '結婚10周年', text: '結婚10周年' },
          { value: '結婚20年以上', text: '結婚20年以上' },
          { value: 'プロポーズ', text: 'プロポーズ記念日' }
        ]
      },
      special: {
        label: '🎁 特別な日', options: [
          { value: 'バレンタイン', text: 'バレンタインデー' },
          { value: 'ホワイトデー', text: 'ホワイトデー' },
          { value: 'クリスマス', text: 'クリスマス' },
          { value: '父母の日', text: '父母の日' },
          { value: '先生の日', text: '先生の日' },
          { value: 'その他', text: 'その他' }
        ]
      }
    }
  };

  const occasions = occasionOptions[locale as keyof typeof occasionOptions] || occasionOptions.ko;

  // 언어별 예산 옵션
  const budgetOptions = {
    ko: {
      min: '최소 금액',
      max: '최대 금액',
      options: [
        { value: 10000, text: '1만원' },
        { value: 30000, text: '3만원' },
        { value: 50000, text: '5만원' },
        { value: 100000, text: '10만원' },
        { value: 200000, text: '20만원' },
        { value: 300000, text: '30만원' },
        { value: 500000, text: '50만원' },
        { value: 1000000, text: '100만원' },
        { value: 2000000, text: '200만원 이상' }
      ]
    },
    en: {
      min: 'Minimum',
      max: 'Maximum',
      options: [
        { value: 10000, text: '$10' },
        { value: 30000, text: '$30' },
        { value: 50000, text: '$50' },
        { value: 100000, text: '$100' },
        { value: 200000, text: '$200' },
        { value: 300000, text: '$300' },
        { value: 500000, text: '$500' },
        { value: 1000000, text: '$1,000' },
        { value: 2000000, text: '$2,000+' }
      ]
    },
    ja: {
      min: '最小金額',
      max: '最大金額',
      options: [
        { value: 10000, text: '1,000円' },
        { value: 30000, text: '3,000円' },
        { value: 50000, text: '5,000円' },
        { value: 100000, text: '10,000円' },
        { value: 200000, text: '20,000円' },
        { value: 300000, text: '30,000円' },
        { value: 500000, text: '50,000円' },
        { value: 1000000, text: '100,000円' },
        { value: 2000000, text: '200,000円以上' }
      ]
    }
  };

  const budgets = budgetOptions[locale as keyof typeof budgetOptions] || budgetOptions.ko;

  // 언어별 카테고리 옵션
  const categoryOptions = {
    ko: {
      all: '전체 카테고리',
      fashion: {
        label: '👗 패션 & 뷰티', options: [
          { value: '패션', text: '의류 & 패션' },
          { value: '뷰티', text: '뷰티 & 화장품' },
          { value: '향수', text: '향수' },
          { value: '액세서리', text: '액세서리 & 주얼리' }
        ]
      },
      digital: {
        label: '📱 디지털 & 라이프스타일', options: [
          { value: 'IT기기', text: 'IT기기 & 전자제품' },
          { value: '스마트워치', text: '스마트워치 & 웨어러블' },
          { value: '가전제품', text: '생활가전' }
        ]
      },
      hobby: {
        label: '🎨 취미 & 문화', options: [
          { value: '도서', text: '도서 & 문구' },
          { value: '음악', text: '음악 & 악기' },
          { value: '스포츠', text: '스포츠 & 아웃도어' },
          { value: '여행', text: '여행 & 레저' }
        ]
      },
      food: {
        label: '🍰 음식 & 체험', options: [
          { value: '음식', text: '음식 & 디저트' },
          { value: '체험', text: '체험 & 클래스' },
          { value: '꽃', text: '꽃 & 화분' }
        ]
      },
      home: {
        label: '🏠 생활 & 인테리어', options: [
          { value: '홈데코', text: '홈데코 & 인테리어' },
          { value: '생활용품', text: '생활용품' },
          { value: '기타', text: '기타' }
        ]
      }
    },
    en: {
      all: 'All Categories',
      fashion: {
        label: '👗 Fashion & Beauty', options: [
          { value: 'Fashion', text: 'Clothing & Fashion' },
          { value: 'Beauty', text: 'Beauty & Cosmetics' },
          { value: 'Perfume', text: 'Perfume' },
          { value: 'Accessories', text: 'Accessories & Jewelry' }
        ]
      },
      digital: {
        label: '📱 Digital & Lifestyle', options: [
          { value: 'Electronics', text: 'Electronics & Gadgets' },
          { value: 'Smartwatch', text: 'Smartwatch & Wearables' },
          { value: 'Appliances', text: 'Home Appliances' }
        ]
      },
      hobby: {
        label: '🎨 Hobby & Culture', options: [
          { value: 'Books', text: 'Books & Stationery' },
          { value: 'Music', text: 'Music & Instruments' },
          { value: 'Sports', text: 'Sports & Outdoor' },
          { value: 'Travel', text: 'Travel & Leisure' }
        ]
      },
      food: {
        label: '🍰 Food & Experience', options: [
          { value: 'Food', text: 'Food & Desserts' },
          { value: 'Experience', text: 'Experience & Classes' },
          { value: 'Flowers', text: 'Flowers & Plants' }
        ]
      },
      home: {
        label: '🏠 Living & Interior', options: [
          { value: 'Home Decor', text: 'Home Decor & Interior' },
          { value: 'Daily Items', text: 'Daily Essentials' },
          { value: 'Other', text: 'Other' }
        ]
      }
    },
    ja: {
      all: '全カテゴリー',
      fashion: {
        label: '👗 ファッション & ビューティー', options: [
          { value: 'ファッション', text: '衣類 & ファッション' },
          { value: 'ビューティー', text: 'ビューティー & 化粧品' },
          { value: '香水', text: '香水' },
          { value: 'アクセサリー', text: 'アクセサリー & ジュエリー' }
        ]
      },
      digital: {
        label: '📱 デジタル & ライフスタイル', options: [
          { value: 'IT機器', text: 'IT機器 & 電子製品' },
          { value: 'スマートウォッチ', text: 'スマートウォッチ & ウェアラブル' },
          { value: '家電製品', text: '生活家電' }
        ]
      },
      hobby: {
        label: '🎨 趣味 & 文化', options: [
          { value: '本', text: '本 & 文房具' },
          { value: '音楽', text: '音楽 & 楽器' },
          { value: 'スポーツ', text: 'スポーツ & アウトドア' },
          { value: '旅行', text: '旅行 & レジャー' }
        ]
      },
      food: {
        label: '🍰 食べ物 & 体験', options: [
          { value: '食べ物', text: '食べ物 & デザート' },
          { value: '体験', text: '体験 & クラス' },
          { value: '花', text: '花 & 観葉植物' }
        ]
      },
      home: {
        label: '🏠 生活 & インテリア', options: [
          { value: 'ホームデコ', text: 'ホームデコ & インテリア' },
          { value: '生活用品', text: '生活用品' },
          { value: 'その他', text: 'その他' }
        ]
      }
    }
  };

  const categories = categoryOptions[locale as keyof typeof categoryOptions] || categoryOptions.ko;

  // 언어별 UI 텍스트
  const uiText = {
    ko: {
      title: 'AI 맞춤형 선물 추천을 위한 정보 입력',
      subtitle: '커플 선물, 기념일 선물, 생일 선물 등 자세한 정보를 제공할수록 더 정확한 맞춤형 선물 아이디어를 받을 수 있어요! ✨',
      gender: '성별',
      female: '여성',
      male: '남성',
      age: '나이',
      personality: '성격 특성 또는 MBTI',
      personalityPlaceholder: '예: ENFP, 활발한, 조용한, 패션에 관심이 많은, 독서를 좋아하는...',
      occasion: '기념일 종류',
      budget: '예산 범위',
      category: '선호 카테고리 (선택사항)',
      additionalInfo: '추가 정보 (선택사항)',
      additionalInfoPlaceholder: '특별히 좋아하는 것이나 싫어하는 것, 관심사, 취미 등 추가로 알려주고 싶은 정보가 있다면 자유롭게 작성해주세요...',
      submit: 'AI 맞춤형 선물 추천받기'
    },
    en: {
      title: 'Enter Information for AI Gift Recommendations',
      subtitle: 'The more details you provide about couple gifts, anniversary gifts, birthday gifts, etc., the more accurate personalized gift ideas you can receive! ✨',
      gender: 'Gender',
      female: 'Female',
      male: 'Male',
      age: 'Age',
      personality: 'Personality or MBTI',
      personalityPlaceholder: 'e.g., ENFP, outgoing, quiet, fashion-conscious, loves reading...',
      occasion: 'Occasion Type',
      budget: 'Budget Range',
      category: 'Preferred Category (Optional)',
      additionalInfo: 'Additional Info (Optional)',
      additionalInfoPlaceholder: 'Feel free to share any additional information about likes, dislikes, interests, hobbies, etc...',
      submit: 'Get AI Gift Recommendations'
    },
    ja: {
      title: 'AIギフト推薦のための情報入力',
      subtitle: 'カップルギフト、記念日ギフト、誕生日ギフトなどの詳細な情報を提供するほど、より正確なオーダーメイドギフトアイデアを受け取ることができます！ ✨',
      gender: '性別',
      female: '女性',
      male: '男性',
      age: '年齢',
      personality: '性格特性またはMBTI',
      personalityPlaceholder: '例：ENFP、活発、静か、ファッションに興味がある、読書が好き...',
      occasion: '記念日の種類',
      budget: '予算範囲',
      category: '好みのカテゴリ（任意）',
      additionalInfo: '追加情報（任意）',
      additionalInfoPlaceholder: '特に好きなことや嫌いなこと、関心、趣味など追加で知らせたい情報があれば自由にご記入ください...',
      submit: 'AIギフト推薦を受ける'
    }
  };

  const ui = uiText[locale as keyof typeof uiText] || uiText.ko;

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-4">
          {ui.title}
        </h2>
        <p className="text-gray-600 text-lg">
          {ui.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 성별 */}
        <div>
          <label className="form-label">
            <span className="text-2xl">👤</span>
            {ui.gender}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`radio-option ${formData.gender === 'female' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === 'female'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <span className="text-xl">👩</span>
              <span>{ui.female}</span>
            </label>
            <label className={`radio-option ${formData.gender === 'male' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === 'male'}
                onChange={handleInputChange}
                className="sr-only"
              />
              <span className="text-xl">👨</span>
              <span>{ui.male}</span>
            </label>
          </div>
        </div>

        {/* 나이 */}
        <div>
          <label className="form-label">
            <span className="text-2xl">🎂</span>
            {ui.age}
          </label>
          <select
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="input-field"
            required
          >
            {generateAgeOptions()}
          </select>
        </div>

        {/* 성격/MBTI */}
        <div>
          <label className="form-label">
            <span className="text-2xl">🎭</span>
            {ui.personality}
          </label>
          <input
            type="text"
            name="personality"
            value={formData.personality}
            onChange={handleInputChange}
            placeholder={ui.personalityPlaceholder}
            className="input-field"
            required
          />
        </div>

        {/* 기념일 종류 */}
        <div>
          <label className="form-label">
            <span className="text-2xl">🎉</span>
            {ui.occasion}
          </label>
          <select
            name="occasionType"
            value={formData.occasionType}
            onChange={handleInputChange}
            className="input-field"
            required
          >
            <option value="">{occasions.select}</option>
            <optgroup label={occasions.birthday.label}>
              {occasions.birthday.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.text}</option>
              ))}
            </optgroup>
            <optgroup label={occasions.couple.label}>
              {occasions.couple.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.text}</option>
              ))}
            </optgroup>
            <optgroup label={occasions.wedding.label}>
              {occasions.wedding.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.text}</option>
              ))}
            </optgroup>
            <optgroup label={occasions.special.label}>
              {occasions.special.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.text}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* 예산 범위 */}
        <div>
          <label className="form-label">
            <span className="text-2xl">💰</span>
            {ui.budget}
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-2">{budgets.min}</div>
              <select
                name="minBudget"
                value={formData.minBudget}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                {budgets.options.slice(0, 7).map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.text}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-2">{budgets.max}</div>
              <select
                name="maxBudget"
                value={formData.maxBudget}
                onChange={handleInputChange}
                className="input-field"
                required
              >
                {budgets.options.slice(2).map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.text}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 카테고리 */}
        <div>
          <label className="form-label">
            <span className="text-2xl">🛍️</span>
            {ui.category}
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="">{categories.all}</option>
            <optgroup label={categories.fashion.label}>
              {categories.fashion.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.text}</option>
              ))}
            </optgroup>
            <optgroup label={categories.digital.label}>
              {categories.digital.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.text}</option>
              ))}
            </optgroup>
            <optgroup label={categories.hobby.label}>
              {categories.hobby.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.text}</option>
              ))}
            </optgroup>
            <optgroup label={categories.food.label}>
              {categories.food.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.text}</option>
              ))}
            </optgroup>
            <optgroup label={categories.home.label}>
              {categories.home.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.text}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* 추가 정보 */}
        <div>
          <label className="form-label">
            <span className="text-2xl">💬</span>
            {ui.additionalInfo}
          </label>
          <textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            placeholder={ui.additionalInfoPlaceholder}
            rows={4}
            className="input-field resize-none"
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full text-lg py-4 font-semibold"
        >
          <span className="text-xl mr-2">🎁</span>
          {ui.submit}
          <span className="text-xl ml-2">✨</span>
        </button>
      </form>
    </div>
  );
};

export default GiftForm;