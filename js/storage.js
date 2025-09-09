/**
 * 우리 가족 자판기 - 저장소 모듈
 * @module Storage
 */

class StorageManager {
    constructor(config = CONFIG) {
        this.config = config;
        this.storageKey = config.storage.key;
        this.version = config.storage.version;
    }
    
    /**
     * LocalStorage 지원 확인
     * @returns {boolean} 지원 여부
     */
    isSupported() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * 데이터 저장
     * @param {Object} data - 저장할 데이터
     * @returns {boolean} 저장 성공 여부
     */
    save(data) {
        if (!this.isSupported()) {
            console.error('LocalStorage is not supported');
            return false;
        }
        
        try {
            const saveData = {
                version: this.version,
                timestamp: new Date().toISOString(),
                data: data
            };
            
            localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            return true;
        } catch (e) {
            console.error('Failed to save data:', e);
            
            // 용량 초과 시 처리
            if (e.name === 'QuotaExceededError') {
                this.handleQuotaExceeded();
            }
            return false;
        }
    }
    
    /**
     * 데이터 불러오기
     * @returns {Object|null} 저장된 데이터
     */
    load() {
        if (!this.isSupported()) {
            return null;
        }
        
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (!savedData) {
                return null;
            }
            
            const parsed = JSON.parse(savedData);
            
            // 버전 체크
            if (parsed.version !== this.version) {
                console.log('Data version mismatch, attempting migration...');
                return this.migrateData(parsed);
            }
            
            return parsed.data;
        } catch (e) {
            console.error('Failed to load data:', e);
            return null;
        }
    }
    
    /**
     * 데이터 삭제
     * @returns {boolean} 삭제 성공 여부
     */
    clear() {
        if (!this.isSupported()) {
            return false;
        }
        
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (e) {
            console.error('Failed to clear data:', e);
            return false;
        }
    }
    
    /**
     * 백업 생성
     * @returns {string|null} 백업 데이터 (JSON 문자열)
     */
    createBackup() {
        const data = this.load();
        if (!data) {
            return null;
        }
        
        const backup = {
            version: this.version,
            timestamp: new Date().toISOString(),
            app: this.config.app,
            data: data
        };
        
        return JSON.stringify(backup, null, 2);
    }
    
    /**
     * 백업 복원
     * @param {string} backupString - 백업 데이터 문자열
     * @returns {boolean} 복원 성공 여부
     */
    restoreBackup(backupString) {
        try {
            const backup = JSON.parse(backupString);
            
            // 유효성 검사
            if (!backup.data || !backup.version) {
                throw new Error('Invalid backup format');
            }
            
            // 버전 호환성 체크
            if (backup.version !== this.version) {
                console.warn('Backup version mismatch, attempting migration...');
                backup.data = this.migrateData(backup).data;
            }
            
            return this.save(backup.data);
        } catch (e) {
            console.error('Failed to restore backup:', e);
            return false;
        }
    }
    
    /**
     * 데이터 내보내기 (파일 다운로드)
     * @param {Object} data - 내보낼 데이터
     * @param {string} filename - 파일명
     */
    exportToFile(data, filename = null) {
        const exportData = {
            version: this.version,
            timestamp: new Date().toISOString(),
            app: this.config.app,
            data: data
        };
        
        const json = JSON.stringify(exportData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const date = new Date().toISOString().split('T')[0];
        const defaultFilename = `${this.config.export.filePrefix}_${date}.json`;
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || defaultFilename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    /**
     * 파일에서 데이터 가져오기
     * @param {File} file - 입력 파일
     * @returns {Promise<Object>} 가져온 데이터
     */
    async importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importData = JSON.parse(e.target.result);
                    
                    // 유효성 검사
                    if (!importData.data || !importData.version) {
                        throw new Error('Invalid file format');
                    }
                    
                    // 버전 체크 및 마이그레이션
                    if (importData.version !== this.version) {
                        console.warn('Import version mismatch, attempting migration...');
                        importData.data = this.migrateData(importData);
                    }
                    
                    resolve(importData.data);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }
    
    /**
     * 데이터 마이그레이션
     * @param {Object} oldData - 이전 버전 데이터
     * @returns {Object} 마이그레이션된 데이터
     */
    migrateData(oldData) {
        // 버전별 마이그레이션 로직
        let migrated = oldData.data;
        
        // v1.0 -> v2.0 마이그레이션 예시
        if (oldData.version === '1.0') {
            console.log('Migrating from v1.0 to v2.0...');
            // 마이그레이션 로직
            migrated = this.migrateV1ToV2(migrated);
        }
        
        return migrated;
    }
    
    /**
     * v1.0에서 v2.0으로 마이그레이션
     * @param {Object} data - v1.0 데이터
     * @returns {Object} v2.0 데이터
     */
    migrateV1ToV2(data) {
        // 구조 변경 예시
        const migrated = {};
        
        // 각 역할별 데이터 마이그레이션
        ['mom', 'dad', 'daughter', 'son'].forEach(role => {
            if (data[role]) {
                migrated[role] = {
                    name: data[role].name || '',
                    buttons: data[role].buttons || []
                };
            }
        });
        
        return migrated;
    }
    
    /**
     * 용량 초과 처리
     */
    handleQuotaExceeded() {
        console.warn('LocalStorage quota exceeded');
        
        // 오래된 데이터 정리
        this.cleanupOldData();
        
        // 사용자에게 알림
        alert('저장 공간이 부족합니다. 일부 오래된 데이터가 삭제될 수 있습니다.');
    }
    
    /**
     * 오래된 데이터 정리
     */
    cleanupOldData() {
        // 다른 키의 오래된 데이터 삭제
        const keysToCheck = [
            'familyVendingMachine_backup',
            'familyVendingMachine_temp'
        ];
        
        keysToCheck.forEach(key => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                // 무시
            }
        });
    }
    
    /**
     * 저장소 상태 확인
     * @returns {Object} 저장소 상태 정보
     */
    getStorageInfo() {
        if (!this.isSupported()) {
            return {
                supported: false,
                used: 0,
                available: 0
            };
        }
        
        let used = 0;
        
        // 사용량 계산
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                used += localStorage[key].length + key.length;
            }
        }
        
        return {
            supported: true,
            used: used,
            // 대략적인 가용 공간 (브라우저마다 다름, 보통 5-10MB)
            available: 5 * 1024 * 1024 - used,
            percentage: (used / (5 * 1024 * 1024) * 100).toFixed(2)
        };
    }
    
    /**
     * 자동 백업 설정
     * @param {number} intervalMinutes - 백업 간격 (분)
     */
    enableAutoBackup(intervalMinutes = 30) {
        // 기존 타이머 제거
        if (this.autoBackupTimer) {
            clearInterval(this.autoBackupTimer);
        }
        
        // 새 타이머 설정
        this.autoBackupTimer = setInterval(() => {
            const backup = this.createBackup();
            if (backup) {
                try {
                    localStorage.setItem(`${this.storageKey}_autobackup`, backup);
                    console.log('Auto backup completed');
                } catch (e) {
                    console.error('Auto backup failed:', e);
                }
            }
        }, intervalMinutes * 60 * 1000);
    }
    
    /**
     * 자동 백업 비활성화
     */
    disableAutoBackup() {
        if (this.autoBackupTimer) {
            clearInterval(this.autoBackupTimer);
            this.autoBackupTimer = null;
        }
    }
}

// 싱글톤 인스턴스 생성
const storage = new StorageManager();

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageManager, storage };
}