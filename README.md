# URL Shortener Service

<https://s.heyo.me>  
URL을 짧게 만들어주는 서비스입니다.


## 기술 스택

- Next.js
- Prisma
- SQLite (개발 환경)
- MongoDB (운영 환경)

## 시작하기

### 사전 요구사항

- Node.js 18.0.0 이상
- npm 또는 yarn
- Docker (운영 환경용)

### 설치

1. 저장소 클론
```bash
git clone https://github.com/m320ng/shortlink
cd shortlink
```

2. 의존성 설치
```bash
npm i
# or
yarn
```

3. 환경 변수 설정
`.env` 파일 생성 (개발 환경):
```env
DATABASE_PROVIDER="sqlite"
DATABASE_URL="file:./dev.db"
```

`.env.production` 파일 생성 (운영 환경):
```env
DATABASE_PROVIDER="mongodb"
DATABASE_URL="mongodb://username:password@host:27017/dbname"
```

4. 데이터베이스 설정
```bash
# 개발 환경
npm run prisma:dev

# 운영 환경
npm run prisma:deploy
```

### 개발 서버 실행

```bash
npm run dev
# or
yarn dev
```

## 운영 환경 설정

### MongoDB 설정

1. MongoDB 컨테이너 실행:
```bash
docker-compose up -d
```

2. MongoDB 관리자 계정으로 접속:
```bash
mongosh mongodb://admin:admin123@mongodb:27017/admin
```

3. 애플리케이션용 사용자 생성:
```javascript
use admin
db.createUser({
    user: "shortlink",
    pwd: "shortlink11",
    roles: [
        { role: "readWrite", db: "shortlink" },
        { role: "dbAdmin", db: "shortlink" }
    ]
})
```

## 주요 기능

- URL 단축
- 단축 URL 통계

