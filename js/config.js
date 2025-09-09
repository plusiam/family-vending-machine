/**
 * 우리 가족 자판기 - 설정 파일
 * @module config
 */

const CONFIG = {
    // 앱 기본 설정
    app: {
        name: '우리 가족 자판기',
        version: '2.0.0',
        author: '룰루랄라 한기샘',
        description: '《엄마 자판기》 그림책 연계 교육 활동'
    },
    
    // 가족 구성원 설정
    roles: [
        { id: 'mom', label: '엄마', icon: '👩' },
        { id: 'dad', label: '아빠', icon: '👨' },
        { id: 'daughter', label: '딸', icon: '👧' },
        { id: 'son', label: '아들', icon: '👦' }
    ],
    
    // 테마 설정
    themes: [
        { id: 'light', label: '밝은 테마', icon: '🌞' },
        { id: 'dark', label: '다크 테마', icon: '🌙' },
        { id: 'pastel', label: '파스텔 테마', icon: '🌸' },
        { id: 'kids', label: '키즈 테마', icon: '🎈' }
    ],
    
    // 자판기 설정
    machine: {
        maxNameLength: 20,
        maxButtons: 12,
        minButtons: 1,
        defaultButtonCount: 6
    },
    
    // 버튼 설정
    button: {
        maxTextLength: 15,
        defaultEmoji: '😊',
        animationDuration: 300
    },
    
    // 역할별 이모지 팔레트
    roleEmojis: {
        mom: [
            '🍰', '🍪', '💝', '📚', '🌈', '☕', '🧘', '🌸', '🎵', '😍',
            '🎪', '🍽️', '🧺', '🌻', '💍', '🎶', '👩‍❤️‍👨', '🌙', '🎆', '🎁',
            '🗿', '🎄', '💜', '🎀', '🍫', '🌳', '🌤️', '🎭', '🌊', '🍉'
        ],
        dad: [
            '🎣', '⚽', '🛠️', '🚗', '🏔️', '📰', '🏌️', '🎾', '📺', '🔧',
            '🎖', '🏞️', '🚜', '🍺', '🍖', '💻', '🎸', '🎹', '🎽', '🏆',
            '🏈', '🏀', '🌌', '🔮', '⛳', '🎯', '🎲', '🎮', '🎱', '🏋️'
        ],
        daughter: [
            '🎨', '🎵', '💃', '📖', '🎭', '🌸', '🥰', '💎', '🎀', '🧚',
            '🎊', '🧿', '👑', '🎄', '🦄', '🌹', '🧩', '🎸', '🌠', '🌈',
            '🦋', '🌺', '🍭', '🎠', '🍬', '📷', '🎬', '🍦', '🌼', '🎉'
        ],
        son: [
            '🎮', '🚀', '🏃', '🎸', '🏀', '🎯', '🚁', '🤖', '🎲', '🎈',
            '🏎️', '🧩', '⚽', '🏈', '🦅', '🎱', '🚦', '🐉', '🌍', '🏋️',
            '🏊', '🎷', '🤺', '🎗️', '🎰', '🎳', '🥋', '🎿', '🎆', '🎪'
        ]
    },
    
    // 공통 이모지 (모든 역할에서 사용 가능)
    emojis: [
        '🍕', '🎮', '📚', '🎨', '🤗', '🎵', '🍰', '⚽', '✨', '🚗',
        '🎣', '🛠️', '📖', '🍖', '🏔️', '🎬', '💝', '🎤', '💃', '🧘',
        '🏃', '🌈', '💪', '🚀', '🎸', '🎯', '🏀', '🎾', '🏊', '🚴',
        '📷', '🎪', '🎭', '🎰', '🎲', '🎯', '🎳', '🥋', '🏉', '🎿'
    ],
    
    // 예시 데이터
    examples: {
        mom: [
            { emoji: '🍰', text: '요리하기' },
            { emoji: '💝', text: '가족시간' },
            { emoji: '📚', text: '독서' },
            { emoji: '🌈', text: '산책' },
            { emoji: '☕', text: '커피타임' },
            { emoji: '🧘', text: '요가' }
        ],
        dad: [
            { emoji: '🎣', text: '낙시' },
            { emoji: '⚽', text: '축구' },
            { emoji: '🛠️', text: '만들기' },
            { emoji: '🚗', text: '드라이브' },
            { emoji: '🏔️', text: '등산' },
            { emoji: '📰', text: '신문읽기' }
        ],
        daughter: [
            { emoji: '🎨', text: '그림그리기' },
            { emoji: '🎵', text: '노래부르기' },
            { emoji: '💃', text: '춤추기' },
            { emoji: '📖', text: '동화책' },
            { emoji: '🎭', text: '연극놀이' },
            { emoji: '🌸', text: '꽃 가꾸기' }
        ],
        son: [
            { emoji: '🎮', text: '게임' },
            { emoji: '🚀', text: '우주탐험' },
            { emoji: '🏃', text: '달리기' },
            { emoji: '🎸', text: '기타치기' },
            { emoji: '🏀', text: '농구' },
            { emoji: '🎯', text: '다트' }
        ]
    },
    
    // 저장소 설정
    storage: {
        key: 'familyVendingMachine',
        version: '2.0',
        autoSave: true,
        autoSaveDelay: 1000 // ms
    },
    
    // 캡처 설정
    capture: {
        format: 'png',
        quality: 0.95,
        scale: 2
    },
    
    // 내보내기/가져오기 설정
    export: {
        filePrefix: 'family-vending-machine',
        dateFormat: 'YYYY-MM-DD',
        includeMetadata: true
    },
    
    // 접근성 설정
    accessibility: {
        enableKeyboardNav: true,
        enableScreenReader: true,
        highContrast: false
    },
    
    // 다국어 설정
    languages: [
        { code: 'ko', label: '한국어', flag: '🇰🇷' },
        { code: 'en', label: 'English', flag: '🇺🇸' }
    ],
    
    // 애니메이션 설정
    animations: {
        enabled: true,
        duration: {
            fast: 200,
            normal: 300,
            slow: 500
        }
    },
    
    // 디버그 설정
    debug: {
        enabled: false,
        logLevel: 'error' // 'error', 'warn', 'info', 'debug'
    }
};

// 설정 불변성 보장
Object.freeze(CONFIG);
Object.freeze(CONFIG.app);
Object.freeze(CONFIG.roles);
Object.freeze(CONFIG.themes);
Object.freeze(CONFIG.machine);
Object.freeze(CONFIG.button);
Object.freeze(CONFIG.roleEmojis);
Object.freeze(CONFIG.emojis);
Object.freeze(CONFIG.examples);
Object.freeze(CONFIG.storage);
Object.freeze(CONFIG.capture);
Object.freeze(CONFIG.export);
Object.freeze(CONFIG.accessibility);
Object.freeze(CONFIG.languages);
Object.freeze(CONFIG.animations);
Object.freeze(CONFIG.debug);

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}